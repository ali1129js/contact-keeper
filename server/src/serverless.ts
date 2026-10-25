import type { IncomingMessage, ServerResponse } from "node:http";
import mongoose from "mongoose";
import type { Express } from "express";
import { createApp } from "./app.js";
import { loadEnv } from "./env.js";

// Cached across invocations of the same warm function instance.
let appPromise: Promise<Express> | null = null;

async function init(): Promise<Express> {
  const env = loadEnv();
  if (mongoose.connection.readyState !== 1) {
    mongoose.set("strictQuery", true);
    await mongoose.connect(env.MONGODB_URI, { serverSelectionTimeoutMS: 10_000 });
  }
  return createApp({ jwtSecret: env.JWT_SECRET, jwtExpiresIn: env.JWT_EXPIRES_IN, clientOrigin: env.CLIENT_ORIGIN, cronSecret: env.CRON_SECRET });
}

export function getApp(): Promise<Express> {
  appPromise ??= init().catch((err: unknown) => {
    appPromise = null; // allow a retry on the next request
    throw err;
  });
  return appPromise;
}

export default async function handler(req: IncomingMessage, res: ServerResponse): Promise<void> {
  try {
    const app = await getApp();
    app(req as Parameters<Express>[0], res as Parameters<Express>[1]);
  } catch (err) {
    console.error("API init failed:", err instanceof Error ? err.message : "unknown error");
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ msg: "Server misconfigured" }));
  }
}

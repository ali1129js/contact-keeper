import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

let mongo: MongoMemoryServer;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
});
afterAll(async () => {
  await mongoose.disconnect();
  await mongo.stop();
  vi.unstubAllEnvs();
});

describe("Vercel serverless handler", () => {
  it("returns 500 without leaking details when env is missing", async () => {
    vi.resetModules();
    vi.stubEnv("MONGODB_URI", "");
    vi.stubEnv("JWT_SECRET", "");
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const { default: handler } = await import("../src/serverless.js");
    const res = await request(handler).get("/api/health");
    expect(res.status).toBe(500);
    expect(res.body).toEqual({ msg: "Server misconfigured" });
    spy.mockRestore();
  });

  it("recovers after a failed init, connects once and serves the API", async () => {
    vi.stubEnv("MONGODB_URI", mongo.getUri());
    vi.stubEnv("JWT_SECRET", "serverless-test-secret-at-least-32-chars");
    const connectSpy = vi.spyOn(mongoose, "connect");
    const mod = await import("../src/serverless.js");
    expect((await request(mod.default).get("/api/health")).body).toEqual({ ok: true });
    const reg = await request(mod.default)
      .post("/api/auth/register")
      .send({ name: "Fn User", email: "fn@example.com", password: "password-123" });
    expect(reg.status).toBe(201);
    expect(connectSpy).toHaveBeenCalledTimes(1);
    expect(await mod.getApp()).toBe(await mod.getApp());
  });
});

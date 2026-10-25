import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { afterAll, afterEach, beforeAll } from "vitest";
import { createApp } from "../src/app.js";

export const TEST_SECRET = "test-secret-that-is-at-least-32-characters-long";
export const app = createApp({ jwtSecret: TEST_SECRET, bcryptRounds: 4 });

let mongo: MongoMemoryServer;

export function useTestDb(): void {
  beforeAll(async () => {
    mongo = await MongoMemoryServer.create();
    await mongoose.connect(mongo.getUri());
  });
  afterEach(async () => {
    const collections = await mongoose.connection.db!.collections();
    await Promise.all(collections.map((c) => c.deleteMany({})));
  });
  afterAll(async () => {
    await mongoose.disconnect();
    await mongo.stop();
  });
}

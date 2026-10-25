import { describe, expect, it } from "vitest";
import { loadEnv } from "../src/env.js";

describe("loadEnv", () => {
  it("rejects missing and weak config without echoing values", () => {
    expect(() => loadEnv({ MONGODB_URI: "", JWT_SECRET: "short" })).toThrow(/JWT_SECRET must be at least 32/);
  });

  it("applies defaults", () => {
    const env = loadEnv({ MONGODB_URI: "mongodb://localhost/x", JWT_SECRET: "x".repeat(32) });
    expect(env.PORT).toBe(5000);
    expect(env.JWT_EXPIRES_IN).toBe("7d");
  });
});

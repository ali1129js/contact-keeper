import request from "supertest";
import jwt from "jsonwebtoken";
import { describe, expect, it } from "vitest";
import { app, useTestDb } from "./setup.js";
import { User } from "../src/models/User.js";

useTestDb();

const alice = { name: "Test Person", email: "Test.Person@Example.com", password: "correct-horse" };

describe("auth API", () => {
  it("reports health", async () => {
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true });
  });

  it("registers a user, hashes the password and returns a JWT", async () => {
    const res = await request(app).post("/api/auth/register").send(alice);
    expect(res.status).toBe(201);
    expect(typeof res.body.token).toBe("string");
    const stored = await User.findOne({ email: "test.person@example.com" }).select("+password");
    expect(stored).not.toBeNull();
    expect(stored!.password).not.toBe(alice.password);
    expect(stored!.password.startsWith("$2")).toBe(true);
  });

  it("rejects invalid registration input with field errors", async () => {
    const res = await request(app).post("/api/auth/register").send({ name: "", email: "nope", password: "short" });
    expect(res.status).toBe(400);
    const fields = res.body.errors.map((e: { field: string }) => e.field);
    expect(fields).toEqual(expect.arrayContaining(["name", "email", "password"]));
  });

  it("rejects duplicate emails", async () => {
    await request(app).post("/api/auth/register").send(alice);
    const res = await request(app).post("/api/auth/register").send(alice);
    expect(res.status).toBe(409);
  });

  it("logs in with correct credentials and loads the profile", async () => {
    await request(app).post("/api/auth/register").send(alice);
    const login = await request(app).post("/api/auth/login").send({ email: alice.email, password: alice.password });
    expect(login.status).toBe(200);
    const me = await request(app).get("/api/auth/me").set("Authorization", `Bearer ${login.body.token}`);
    expect(me.status).toBe(200);
    expect(me.body).toMatchObject({ name: alice.name, email: "test.person@example.com" });
    expect(me.body.password).toBeUndefined();
  });

  it("rejects a wrong password", async () => {
    await request(app).post("/api/auth/register").send(alice);
    const res = await request(app).post("/api/auth/login").send({ email: alice.email, password: "wrong-password" });
    expect(res.status).toBe(401);
  });

  it("rejects missing, malformed and foreign-signed tokens", async () => {
    expect((await request(app).get("/api/auth/me")).status).toBe(401);
    expect((await request(app).get("/api/auth/me").set("Authorization", "Bearer garbage")).status).toBe(401);
    const forged = jwt.sign({}, "some-other-secret-that-is-also-long-enough", { subject: "abc" });
    expect((await request(app).get("/api/auth/me").set("Authorization", `Bearer ${forged}`)).status).toBe(401);
  });
});

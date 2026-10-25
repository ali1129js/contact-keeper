import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../src/app.js";
import { Contact } from "../src/models/Contact.js";
import { DEMO_CONTACTS, DEMO_USER } from "../src/scripts/seed.js";
import { TEST_SECRET, useTestDb } from "./setup.js";

useTestDb();

const CRON = "cron-secret-for-tests-0123456789";
const app = createApp({ jwtSecret: TEST_SECRET, bcryptRounds: 4, cronSecret: CRON });
const reset = () => request(app).get("/api/cron/reset-demo").set("Authorization", `Bearer ${CRON}`);

async function login(email: string, password: string) {
  const res = await request(app).post("/api/auth/login").send({ email, password });
  return res.body.token as string | undefined;
}

describe("demo reset cron", () => {
  it("rejects missing or wrong secrets", async () => {
    expect((await request(app).get("/api/cron/reset-demo")).status).toBe(401);
    expect((await request(app).get("/api/cron/reset-demo").set("Authorization", "Bearer wrong")).status).toBe(401);
  });

  it("is disabled when no CRON_SECRET is configured", async () => {
    const noCron = createApp({ jwtSecret: TEST_SECRET, bcryptRounds: 4 });
    expect((await request(noCron).get("/api/cron/reset-demo").set("Authorization", "Bearer ")).status).toBe(401);
  });

  it("restores the seed contacts and demo password after tampering", async () => {
    expect((await reset()).body).toEqual({ ok: true, contacts: DEMO_CONTACTS.length });
    const token = await login(DEMO_USER.email, DEMO_USER.password);
    const auth = { Authorization: `Bearer ${token}` };
    const list = await request(app).get("/api/contacts").set(auth);
    await request(app).delete(`/api/contacts/${list.body[0]._id}`).set(auth);
    await request(app).post("/api/contacts").set(auth).send({ name: "Vandal" });

    await reset();
    const after = await request(app).get("/api/contacts").set({ Authorization: `Bearer ${await login(DEMO_USER.email, DEMO_USER.password)}` });
    expect(after.body.map((c: { name: string }) => c.name).sort()).toEqual(DEMO_CONTACTS.map((c) => c.name).sort());
    expect(await Contact.countDocuments()).toBe(DEMO_CONTACTS.length);
  });

  it("leaves other users and their contacts untouched", async () => {
    const reg = await request(app).post("/api/auth/register").send({ name: "Other", email: "other@example.com", password: "password-123" });
    const auth = { Authorization: `Bearer ${reg.body.token}` };
    await request(app).post("/api/contacts").set(auth).send({ name: "Keep Me" });
    await reset();
    await reset();
    const mine = await request(app).get("/api/contacts").set(auth);
    expect(mine.body.map((c: { name: string }) => c.name)).toEqual(["Keep Me"]);
    expect(await login("other@example.com", "password-123")).toBeTypeOf("string");
  });
});

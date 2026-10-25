import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";
import { app, useTestDb } from "./setup.js";

useTestDb();

async function tokenFor(email: string): Promise<string> {
  const res = await request(app).post("/api/auth/register").send({ name: "Owner", email, password: "password-123" });
  return res.body.token as string;
}

describe("contacts API", () => {
  let token: string;
  const auth = () => ({ Authorization: `Bearer ${token}` });

  beforeEach(async () => {
    token = await tokenFor("owner@example.com");
  });

  it("requires authentication", async () => {
    expect((await request(app).get("/api/contacts")).status).toBe(401);
  });

  it("creates, lists, updates and deletes a contact", async () => {
    const created = await request(app)
      .post("/api/contacts")
      .set(auth())
      .send({ name: "Ada Quill", email: "ada@example.com", phone: "555-0101", type: "professional" });
    expect(created.status).toBe(201);
    const id = created.body._id as string;

    const list = await request(app).get("/api/contacts").set(auth());
    expect(list.body).toHaveLength(1);

    const updated = await request(app).put(`/api/contacts/${id}`).set(auth()).send({ phone: "555-0199" });
    expect(updated.status).toBe(200);
    expect(updated.body.phone).toBe("555-0199");
    expect(updated.body.name).toBe("Ada Quill");

    const del = await request(app).delete(`/api/contacts/${id}`).set(auth());
    expect(del.status).toBe(200);
    expect((await request(app).get("/api/contacts").set(auth())).body).toHaveLength(0);
  });

  it("defaults type to personal and accepts an empty email", async () => {
    const res = await request(app).post("/api/contacts").set(auth()).send({ name: "Bram", email: "" });
    expect(res.status).toBe(201);
    expect(res.body.type).toBe("personal");
    expect(res.body.email).toBeUndefined();
  });

  it("validates contact input", async () => {
    const res = await request(app).post("/api/contacts").set(auth()).send({ name: "", email: "bad", type: "family" });
    expect(res.status).toBe(400);
    expect(res.body.errors.length).toBeGreaterThanOrEqual(3);
  });

  it("isolates contacts between users", async () => {
    const created = await request(app).post("/api/contacts").set(auth()).send({ name: "Private Person" });
    const other = await tokenFor("other@example.com");
    const otherAuth = { Authorization: `Bearer ${other}` };
    expect((await request(app).get("/api/contacts").set(otherAuth)).body).toHaveLength(0);
    expect((await request(app).put(`/api/contacts/${created.body._id}`).set(otherAuth).send({ name: "x" })).status).toBe(404);
    expect((await request(app).delete(`/api/contacts/${created.body._id}`).set(otherAuth)).status).toBe(404);
  });

  it("returns 404 for unknown or malformed ids", async () => {
    expect((await request(app).delete("/api/contacts/not-an-id").set(auth())).status).toBe(404);
    expect((await request(app).delete("/api/contacts/64b7f0000000000000000000").set(auth())).status).toBe(404);
  });
});

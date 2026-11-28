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
    expect(list.body.contacts).toHaveLength(1);
    expect(list.body.total).toBe(1);
    expect(list.body.limit).toBe(20);
    expect(list.body.offset).toBe(0);

    const updated = await request(app).put(`/api/contacts/${id}`).set(auth()).send({ phone: "555-0199" });
    expect(updated.status).toBe(200);
    expect(updated.body.phone).toBe("555-0199");
    expect(updated.body.name).toBe("Ada Quill");

    const del = await request(app).delete(`/api/contacts/${id}`).set(auth());
    expect(del.status).toBe(200);
    expect((await request(app).get("/api/contacts").set(auth())).body.contacts).toHaveLength(0);
    expect((await request(app).get("/api/contacts").set(auth())).body.total).toBe(0);
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
    expect((await request(app).get("/api/contacts").set(otherAuth)).body.contacts).toHaveLength(0);
    expect((await request(app).get("/api/contacts").set(otherAuth)).body.total).toBe(0);
    expect((await request(app).put(`/api/contacts/${created.body._id}`).set(otherAuth).send({ name: "x" })).status).toBe(404);
    expect((await request(app).delete(`/api/contacts/${created.body._id}`).set(otherAuth)).status).toBe(404);
  });

  it("returns 404 for unknown or malformed ids", async () => {
    expect((await request(app).delete("/api/contacts/not-an-id").set(auth())).status).toBe(404);
    expect((await request(app).delete("/api/contacts/64b7f0000000000000000000").set(auth())).status).toBe(404);
  });

  it("returns an empty page when the user has no contacts", async () => {
    const res = await request(app).get("/api/contacts").set(auth());
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ contacts: [], total: 0, limit: 20, offset: 0 });
  });

  it("pages contacts with limit and offset", async () => {
    for (let i = 1; i <= 3; i += 1) {
      const res = await request(app).post("/api/contacts").set(auth()).send({ name: `Person ${i}` });
      expect(res.status).toBe(201);
    }
    const first = await request(app).get("/api/contacts?limit=2&offset=0").set(auth());
    expect(first.status).toBe(200);
    expect(first.body.total).toBe(3);
    expect(first.body.limit).toBe(2);
    expect(first.body.offset).toBe(0);
    expect(first.body.contacts).toHaveLength(2);
    // Newest first: Person 3, then Person 2 on page one.
    expect(first.body.contacts.map((c: { name: string }) => c.name)).toEqual(["Person 3", "Person 2"]);

    const second = await request(app).get("/api/contacts?limit=2&offset=2").set(auth());
    expect(second.status).toBe(200);
    expect(second.body.total).toBe(3);
    expect(second.body.offset).toBe(2);
    expect(second.body.contacts.map((c: { name: string }) => c.name)).toEqual(["Person 1"]);
  });

  it("rejects a bad limit or offset", async () => {
    expect((await request(app).get("/api/contacts?limit=0").set(auth())).status).toBe(400);
    expect((await request(app).get("/api/contacts?limit=101").set(auth())).status).toBe(400);
    expect((await request(app).get("/api/contacts?offset=-1").set(auth())).status).toBe(400);
    expect((await request(app).get("/api/contacts?limit=abc").set(auth())).status).toBe(400);
  });
});

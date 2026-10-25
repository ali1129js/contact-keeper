import { describe, expect, it } from "vitest";
import { filterContacts } from "./ContactFilter";
import type { Contact } from "../lib/types";

const contacts: Contact[] = [
  { _id: "1", name: "Ada Quill", email: "ada@example.com", phone: "555-0101", type: "professional" },
  { _id: "2", name: "Bram Stoneworth", email: "bram@example.com", phone: "555-0102", type: "personal" },
];

describe("filterContacts", () => {
  it("returns everything for an empty query", () => {
    expect(filterContacts(contacts, "  ")).toHaveLength(2);
  });
  it("matches name, email and phone case-insensitively", () => {
    expect(filterContacts(contacts, "BRAM").map((c) => c._id)).toEqual(["2"]);
    expect(filterContacts(contacts, "ada@").map((c) => c._id)).toEqual(["1"]);
    expect(filterContacts(contacts, "0102").map((c) => c._id)).toEqual(["2"]);
  });
});

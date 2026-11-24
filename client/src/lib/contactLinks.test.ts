import { describe, expect, it } from "vitest";
import { mailtoHref, telHref } from "./contactLinks";

describe("mailtoHref", () => {
  it("returns a mailto link for a valid email and rejects empty or invalid values", () => {
    expect(mailtoHref("ada@example.com")).toBe("mailto:ada@example.com");
    expect(mailtoHref("  ada@example.com  ")).toBe("mailto:ada@example.com");
    expect(mailtoHref("")).toBeNull();
    expect(mailtoHref("   ")).toBeNull();
    expect(mailtoHref("not-an-email")).toBeNull();
    expect(mailtoHref("ada@")).toBeNull();
  });
});

describe("telHref", () => {
  it("returns a tel link for a valid phone and rejects empty or invalid values", () => {
    expect(telHref("555-0101")).toBe("tel:5550101");
    expect(telHref("+49 30 1234567")).toBe("tel:+49301234567");
    expect(telHref("")).toBeNull();
    expect(telHref("123")).toBeNull();
    expect(telHref("not a phone")).toBeNull();
    expect(telHref("call-me-maybe")).toBeNull();
  });
});

/// <reference types="node" />
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { resolveTheme } from "./theme";

const html = readFileSync(resolve(process.cwd(), "index.html"), "utf8");
const script = /<script>([\s\S]*?)<\/script>/.exec(html)?.[1] ?? "";

function run(stored: string | null, dark: boolean, reduced = false, motion?: string) {
  localStorage.clear();
  if (stored !== null) localStorage.setItem("contact-keeper.theme", stored);
  if (motion) localStorage.setItem("contact-keeper.motion", motion);
  vi.stubGlobal("matchMedia", (q: string) => ({
    matches: q.includes("prefers-color-scheme") ? dark : reduced,
  }));
  delete document.documentElement.dataset.theme;
  delete document.documentElement.dataset.motion;
  new Function(script)();
  return {
    theme: document.documentElement.dataset.theme,
    motion: document.documentElement.dataset.motion,
  };
}

describe("index.html no-flash script", () => {
  afterEach(() => vi.unstubAllGlobals());
  it("exists", () => expect(script.length).toBeGreaterThan(50));
  it("picks the same theme as resolveTheme for every stored value", () => {
    for (const stored of [null, "khaki", "graphite", "midnight", "bogus", "dark"]) {
      for (const dark of [false, true]) {
        expect(run(stored, dark).theme).toBe(resolveTheme(stored, dark));
      }
    }
  });
  it("is static by default and when reduced motion is on", () => {
    expect(run(null, false).motion).toBe("static");
    expect(run(null, false, false, "animated").motion).toBe("animated");
    expect(run(null, false, true, "animated").motion).toBe("static");
  });
});

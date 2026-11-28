/// <reference types="node" />
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { THEME_NAMES, colors, contrastPairs, contrastRatio } from "./colors";

const css = readFileSync(resolve(process.cwd(), "src/styles.css"), "utf8");

function cssBlock(theme: string): string {
  const re = new RegExp(`:root(?:,\\s*:root)?\\[data-theme="${theme}"\\]\\s*\\{([^}]*)\\}`);
  const m = re.exec(css);
  if (!m) throw new Error(`no CSS block for ${theme}`);
  return m[1] ?? "";
}

describe("contrast", () => {
  for (const theme of THEME_NAMES) {
    describe(theme, () => {
      for (const { bg, fg, min } of contrastPairs) {
        it(`${fg} on ${bg} is at least ${min}:1`, () => {
          expect(contrastRatio(colors[theme][bg], colors[theme][fg])).toBeGreaterThanOrEqual(min);
        });
      }
    });
  }
});

describe("CSS and tokens stay in sync", () => {
  for (const theme of THEME_NAMES) {
    it(`${theme} block matches colors.ts`, () => {
      const block = cssBlock(theme);
      for (const [name, hex] of Object.entries(colors[theme])) {
        expect(block, `--${name}`).toContain(`--${name}: ${hex};`);
      }
    });
  }
  it("leaves no hard-coded hex colours outside the theme blocks", () => {
    const rest = css.replace(/:root[^{]*\[data-theme="[a-z]+"\]\s*\{[^}]*\}/g, "");
    expect(rest.match(/#[0-9a-fA-F]{3,8}\b/g) ?? []).toEqual([]);
  });
});

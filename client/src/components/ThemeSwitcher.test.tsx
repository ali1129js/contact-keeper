import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MOTION_KEY, THEME_KEY, effectiveMotion, parseTheme, resolveTheme } from "../theme/theme";
import { ThemeSwitcher } from "./ThemeSwitcher";

function media(matching: string[]) {
  vi.stubGlobal("matchMedia", (q: string) => ({ matches: matching.includes(q), media: q }));
}

beforeEach(() => {
  localStorage.clear();
  delete document.documentElement.dataset.theme;
  delete document.documentElement.dataset.motion;
  media([]);
});
afterEach(() => vi.unstubAllGlobals());

describe("theme logic", () => {
  it("falls back to the system scheme and ignores junk", () => {
    expect(resolveTheme(null, false)).toBe("khaki");
    expect(resolveTheme(null, true)).toBe("graphite");
    expect(resolveTheme("neon", true)).toBe("graphite");
    expect(parseTheme("midnight")).toBe("midnight");
    expect(parseTheme("neon")).toBeNull();
  });
  it("reduced motion forces static", () => {
    expect(effectiveMotion("animated", true)).toBe("static");
    expect(effectiveMotion("animated", false)).toBe("animated");
  });
});

describe("ThemeSwitcher", () => {
  it("switches data-theme and persists the choice", async () => {
    render(<ThemeSwitcher />);
    expect(document.documentElement.dataset.theme).toBe("khaki");
    await userEvent.selectOptions(screen.getByRole("combobox", { name: "Theme" }), "midnight");
    expect(document.documentElement.dataset.theme).toBe("midnight");
    expect(localStorage.getItem(THEME_KEY)).toBe("midnight");
  });
  it("starts in Graphite when the system prefers dark", () => {
    media(["(prefers-color-scheme: dark)"]);
    render(<ThemeSwitcher />);
    expect(document.documentElement.dataset.theme).toBe("graphite");
  });
  it("motion is static by default and the toggle persists animated", async () => {
    render(<ThemeSwitcher />);
    expect(document.documentElement.dataset.motion).toBe("static");
    const btn = screen.getByRole("button", { name: /Motion/ });
    expect(btn).toHaveAttribute("aria-pressed", "false");
    await userEvent.click(btn);
    expect(document.documentElement.dataset.motion).toBe("animated");
    expect(localStorage.getItem(MOTION_KEY)).toBe("animated");
  });
  it("prefers-reduced-motion forces static and disables the toggle", () => {
    localStorage.setItem(MOTION_KEY, "animated");
    media(["(prefers-reduced-motion: reduce)"]);
    render(<ThemeSwitcher />);
    expect(document.documentElement.dataset.motion).toBe("static");
    expect(screen.getByRole("button", { name: /Motion/ })).toBeDisabled();
  });
});

import { useCallback, useEffect, useState } from "react";
import { MOTION_KEY, THEME_KEY, THEME_NAMES, type Motion, type Theme } from "./colors";

export { MOTION_KEY, THEME_KEY };
export type { Motion, Theme };

/**
 * Previously the app had a single dark theme and stored nothing, so there is
 * nothing to migrate; unknown or missing values fall back to the system scheme.
 * Keep the script in index.html in sync with resolveTheme (noflash.test.ts checks it).
 */
export function parseTheme(v: string | null): Theme | null {
  return (THEME_NAMES as readonly string[]).includes(v ?? "") ? (v as Theme) : null;
}

/** System light maps to Khaki, system dark to Graphite. */
export function resolveTheme(stored: string | null, systemDark: boolean): Theme {
  return parseTheme(stored) ?? (systemDark ? "graphite" : "khaki");
}

function matches(query: string): boolean {
  return typeof window !== "undefined" && typeof window.matchMedia === "function"
    ? window.matchMedia(query).matches
    : false;
}

function read(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* ignore (private mode) */
  }
}

export function initialTheme(): Theme {
  return resolveTheme(read(THEME_KEY), matches("(prefers-color-scheme: dark)"));
}

export function prefersReducedMotion(): boolean {
  return matches("(prefers-reduced-motion: reduce)");
}

/** Default is static; reduced motion always forces static. */
export function effectiveMotion(stored: Motion, reduced: boolean): Motion {
  return reduced ? "static" : stored;
}

export function readStoredMotion(): Motion {
  return read(MOTION_KEY) === "animated" ? "animated" : "static";
}

export function useTheme(): [Theme, (t: Theme) => void] {
  const [theme, setTheme] = useState<Theme>(initialTheme);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);
  const choose = useCallback((t: Theme) => {
    write(THEME_KEY, t);
    setTheme(t);
  }, []);
  return [theme, choose];
}

export function useMotion(): [Motion, () => void, boolean] {
  const [motion, setMotion] = useState<Motion>(readStoredMotion);
  const reduced = prefersReducedMotion();
  useEffect(() => {
    document.documentElement.dataset.motion = effectiveMotion(motion, reduced);
  }, [motion, reduced]);
  const toggle = useCallback(() => {
    setMotion((m) => {
      const next: Motion = m === "animated" ? "static" : "animated";
      write(MOTION_KEY, next);
      return next;
    });
  }, []);
  return [motion, toggle, reduced];
}

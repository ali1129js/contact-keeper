/**
 * Named theme tokens. src/styles.css must carry the same hex values
 * (src/theme/colors.test.ts parses the CSS and fails on drift).
 * Contrast pairs must meet WCAG AA (4.5:1 text, 3:1 control borders).
 */
export const THEME_NAMES = ["khaki", "graphite", "midnight"] as const;
export type Theme = (typeof THEME_NAMES)[number];

export const THEME_LABELS: Readonly<Record<Theme, string>> = {
  khaki: "Khaki",
  graphite: "Graphite",
  midnight: "Midnight",
};

export const THEME_KEY = "contact-keeper.theme";
export const MOTION_KEY = "contact-keeper.motion";
export const MOTION_NAMES = ["static", "animated"] as const;
export type Motion = (typeof MOTION_NAMES)[number];

/** CSS custom property name (without --) to hex, per theme. */
export const colors = {
  khaki: {
    bg: "#d8cdae",
    panel: "#ebe4d0",
    line: "#b8ac8e",
    "border-strong": "#6f6550",
    text: "#2a2418",
    muted: "#554c3e",
    "nav-bg": "#e0d6bb",
    "input-bg": "#f6f1e2",
    primary: "#4f46e5",
    "on-primary": "#ffffff",
    link: "#214bb3",
    danger: "#9f2235",
    "danger-border": "#9f2235",
    "alert-bg": "#f0d3ca",
    "alert-text": "#7a1a28",
    "badge-pro-bg": "#cfe6d6",
    "badge-pro-text": "#00513c",
    "badge-personal-bg": "#f1e0b2",
    "badge-personal-text": "#6b4000",
  },
  graphite: {
    bg: "#1e2329",
    panel: "#2a313a",
    line: "#3a4350",
    "border-strong": "#707a8a",
    text: "#e8ecf1",
    muted: "#a7b0bc",
    "nav-bg": "#181c21",
    "input-bg": "#1e2329",
    primary: "#4f46e5",
    "on-primary": "#ffffff",
    link: "#9db4ff",
    danger: "#ff9a9a",
    "danger-border": "#8a4a50",
    "alert-bg": "#3d1b1f",
    "alert-text": "#ffc9c9",
    "badge-pro-bg": "#173326",
    "badge-pro-text": "#6fdc95",
    "badge-personal-bg": "#3a2c10",
    "badge-personal-text": "#ffc15e",
  },
  midnight: {
    bg: "#1b1428",
    panel: "#2a2238",
    line: "#4a4060",
    "border-strong": "#7a7288",
    text: "#ede7f6",
    muted: "#c9c2d6",
    "nav-bg": "#150f20",
    "input-bg": "#1b1428",
    primary: "#4f46e5",
    "on-primary": "#ffffff",
    link: "#b3c4ff",
    danger: "#ffa3a3",
    "danger-border": "#8c4d5e",
    "alert-bg": "#3f1c26",
    "alert-text": "#ffd0d0",
    "badge-pro-bg": "#183327",
    "badge-pro-text": "#7be0a0",
    "badge-personal-bg": "#3b2d14",
    "badge-personal-text": "#ffc66b",
  },
} as const satisfies Record<Theme, Record<string, string>>;

export type TokenName = keyof (typeof colors)["khaki"];

export interface Pair {
  bg: TokenName;
  fg: TokenName;
  min: number;
}

/** Every text/background combination the app renders, plus control borders. */
export const contrastPairs: readonly Pair[] = [
  { bg: "bg", fg: "text", min: 4.5 },
  { bg: "bg", fg: "muted", min: 4.5 },
  { bg: "bg", fg: "link", min: 4.5 },
  { bg: "panel", fg: "text", min: 4.5 },
  { bg: "panel", fg: "muted", min: 4.5 },
  { bg: "panel", fg: "link", min: 4.5 },
  { bg: "panel", fg: "danger", min: 4.5 },
  { bg: "nav-bg", fg: "text", min: 4.5 },
  { bg: "nav-bg", fg: "muted", min: 4.5 },
  { bg: "nav-bg", fg: "link", min: 4.5 },
  { bg: "input-bg", fg: "text", min: 4.5 },
  { bg: "primary", fg: "on-primary", min: 4.5 },
  { bg: "alert-bg", fg: "alert-text", min: 4.5 },
  { bg: "badge-pro-bg", fg: "badge-pro-text", min: 4.5 },
  { bg: "badge-personal-bg", fg: "badge-personal-text", min: 4.5 },
  // Control borders (inputs, ghost buttons) against what they sit on.
  { bg: "panel", fg: "border-strong", min: 3 },
  { bg: "input-bg", fg: "border-strong", min: 3 },
  { bg: "bg", fg: "border-strong", min: 3 },
];

function channel(v: number): number {
  const s = v / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
}

export function luminance(hex: string): number {
  const n = parseInt(hex.replace("#", ""), 16);
  return 0.2126 * channel((n >> 16) & 255) + 0.7152 * channel((n >> 8) & 255) + 0.0722 * channel(n & 255);
}

export function contrastRatio(a: string, b: string): number {
  const l1 = luminance(a);
  const l2 = luminance(b);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

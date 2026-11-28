import { THEME_LABELS, THEME_NAMES } from "../theme/colors";
import { useMotion, useTheme, type Theme } from "../theme/theme";

export function ThemeSwitcher() {
  const [theme, chooseTheme] = useTheme();
  const [motion, toggleMotion, reduced] = useMotion();
  const animated = motion === "animated" && !reduced;
  return (
    <>
      <label className="theme-select">
        <span>Theme</span>
        <select
          className="input theme-input"
          value={theme}
          onChange={(e) => chooseTheme(e.target.value as Theme)}
        >
          {THEME_NAMES.map((n) => (
            <option key={n} value={n}>
              {THEME_LABELS[n]}
            </option>
          ))}
        </select>
      </label>
      <button
        type="button"
        className="btn btn-ghost"
        aria-pressed={animated}
        disabled={reduced}
        title={reduced ? "Motion is reduced in your system settings" : undefined}
        onClick={toggleMotion}
      >
        {animated ? "Motion: on" : "Motion: off"}
      </button>
    </>
  );
}

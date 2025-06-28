import { useEffect, useState } from "react";

// Valid theme values
const VALID_THEMES = ["light", "dark", "system"] as const;
type Theme = (typeof VALID_THEMES)[number];

/**
 * React hook for managing and persisting user theme preference (light, dark, or system).
 * Applies theme to the document and syncs with localStorage and system preference.
 * @param storageKey The localStorage key to use (default: 'vite-ui-theme')
 * @param defaultTheme The default theme if none is set (default: 'system')
 * @returns An object with the current theme, setter, and isSystemTheme flag
 */
export function useThemePreference(storageKey = "vite-ui-theme", defaultTheme: Theme = "system") {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      const stored = window.localStorage.getItem(storageKey) as Theme | null;
      if (stored && VALID_THEMES.includes(stored)) {
        return stored;
      }
      return stored && !VALID_THEMES.includes(stored) ? "system" : defaultTheme;
    }
    return defaultTheme;
  });

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia || !window.document || !window.document.body) return;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    function applyTheme(theme: Theme) {
      const root = window.document?.documentElement;
      if (!root || !root.classList) return;
      const isDark = theme === "dark" || (theme === "system" && mediaQuery.matches);
      root.classList.remove("light", "dark");
      root.classList.add(isDark ? "dark" : "light");
      if (window.localStorage) {
        window.localStorage.setItem(storageKey, theme);
      }
    }

    function handleChange() {
      if (theme === "system") {
        applyTheme("system");
      }
    }

    applyTheme(theme);
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
    } else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", handleChange);
      } else if (mediaQuery.removeListener) {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, [theme, storageKey]);

  return {
    theme,
    setTheme,
    isSystemTheme: theme === "system",
  };
}

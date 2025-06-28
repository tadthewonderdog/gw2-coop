import { useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

/**
 * React hook for managing and persisting user theme preference (light, dark, or system).
 * Applies theme to the document and syncs with localStorage and system preference.
 * @param storageKey The localStorage key to use (default: 'vite-ui-theme')
 * @param defaultTheme The default theme if none is set (default: 'system')
 * @returns An object with the current theme, setter, and isSystemTheme flag
 */
export function useThemePreference(storageKey = "vite-ui-theme", defaultTheme: Theme = "system") {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem(storageKey) as Theme) || defaultTheme;
    }
    return defaultTheme;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    function applyTheme(theme: Theme) {
      const root = window.document.documentElement;
      const isDark = theme === "dark" || (theme === "system" && mediaQuery.matches);

      root.classList.remove("light", "dark");
      root.classList.add(isDark ? "dark" : "light");
      localStorage.setItem(storageKey, theme);
    }

    function handleChange() {
      if (theme === "system") {
        applyTheme("system");
      }
    }

    applyTheme(theme);
    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, [theme, storageKey]);

  return {
    theme,
    setTheme,
    isSystemTheme: theme === "system",
  };
}

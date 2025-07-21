import { useEffect, useState, useMemo } from "react";

import { ThemeContext, type Theme, type ThemeProviderState } from "./theme-context";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    // Check localStorage first, then fall back to defaultTheme
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(storageKey);
      if (stored && (stored === "light" || stored === "dark" || stored === "system")) {
        return stored as Theme;
      }
    }
    return defaultTheme;
  });

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme =
        (window?.matchMedia?.("(prefers-color-scheme: dark)")?.matches ?? false) ? "dark" : "light";
      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  // Apply theme immediately on mount
  useEffect(() => {
    const root = window.document.documentElement;
    const currentTheme =
      theme === "system"
        ? (window?.matchMedia?.("(prefers-color-scheme: dark)")?.matches ?? false)
          ? "dark"
          : "light"
        : theme;

    root.classList.remove("light", "dark");
    root.classList.add(currentTheme);
  }, [theme]);

  const value = useMemo<ThemeProviderState>(
    () => ({
      theme,
      setTheme: (theme: Theme) => {
        localStorage.setItem(storageKey, theme);
        setTheme(theme);
      },
    }),
    [theme, storageKey]
  );

  return (
    <ThemeContext.Provider {...props} value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

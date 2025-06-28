import { useEffect } from "react";

import { darkTheme } from "@/styles/themes/dark";
import { lightTheme } from "@/styles/themes/light";

/**
 * React hook to apply theme CSS variables to the document root based on dark/light mode.
 * @param isDark Whether to apply the dark theme (true) or light theme (false)
 */
export function useThemeEffect(isDark: boolean) {
  useEffect(() => {
    const root = window.document.documentElement;
    const themeVars = isDark ? darkTheme : lightTheme;

    // Apply theme CSS variables
    Object.entries(themeVars).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
  }, [isDark]);
}

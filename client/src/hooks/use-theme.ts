import { useContext } from "react";

import { ThemeContext } from "@/components/ui/theme-context";

/**
 * React hook to access the current theme context.
 * Throws if used outside of a ThemeProvider.
 * @returns The theme context value
 */
export function useTheme() {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
}

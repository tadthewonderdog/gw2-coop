import { render } from "@testing-library/react";
import type { ReactNode } from "react";
import { vi } from "vitest";

import { ThemeProvider } from "@/components/ui/theme-provider";

// Mock API response helper
export const mockApiResponse = <T,>(data: T, delay = 1000): Promise<T> => {
  return new Promise<T>((resolve) => {
    setTimeout(() => resolve(data), delay);
  });
};

// Mock local storage helper
export const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

// Mock API response with error
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const mockApiError = (error: any): Promise<never> => {
  return Promise.reject(error);
};

// Mock sessionStorage helper
export const mockSessionStorage = (key: string, value: string) => {
  window.sessionStorage.setItem(key, value);
};

export function renderWithThemeProvider(ui: ReactNode): ReturnType<typeof render> {
  return render(
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      {ui}
    </ThemeProvider>
  );
}

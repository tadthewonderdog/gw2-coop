/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./components/ui/theme-provider";
import "./index.css";

// Get the base path from environment variable, defaulting to "/"
const basename: string = import.meta.env.VITE_BASE_PATH || "/";

const el = document.getElementById("root"); // eslint-disable-line @typescript-eslint/no-unsafe-assignment
if (!el || !(el instanceof HTMLElement)) {
  throw new Error("Root element not found");
}
const rootElement: HTMLElement = el;

createRoot(rootElement).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter basename={basename}>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <App />
        </ThemeProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>
);

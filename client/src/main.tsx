import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./components/ui/theme-provider";
import "./index.css";

// Get the base path from environment variable, defaulting to "/"
const basename: string = import.meta.env.VITE_BASE_PATH || "/";

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const rootElement: HTMLElement | null = document.getElementById("root");
if (!(rootElement instanceof HTMLElement)) {
  throw new Error("Root element not found");
}

createRoot(rootElement).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter basename={basename}>
        <HelmetProvider>
          <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <App />
          </ThemeProvider>
        </HelmetProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>
);

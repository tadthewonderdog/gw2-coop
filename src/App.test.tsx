// Vitest test file for App.tsx
import { render, screen, act, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";

import App from "./App";

// Mock store definitions must be above vi.mock due to hoisting
const mockKeys = [
  {
    id: "test-key-id",
    name: "Test Key",
    key: "TEST-API-KEY",
    accountId: "test-account-id",
    accountName: "Test Account",
    permissions: [],
    isSelected: true,
    isInvalid: false,
    characters: [],
  },
];
const mockCurrentKeyId = "test-key-id";
const mockStore = {
  keys: mockKeys,
  currentKeyId: mockCurrentKeyId,
  addKey: () => {},
  updateKey: () => {},
  removeKey: () => {},
  setCurrentKey: () => {},
  toggleSelected: () => {},
};
vi.mock("@/stores/api-keys", () => ({
  useAPIKeyStore: (selector?: (store: typeof mockStore) => unknown) =>
    typeof selector === "function" ? selector(mockStore) : mockStore,
}));

// Helper to render App at a specific route
function renderWithRoute(route: string) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <App />
    </MemoryRouter>
  );
}

describe("App", () => {
  it("renders without crashing", () => {
    act(() => {
      renderWithRoute("/");
    });
  });

  it("renders the Header component", () => {
    act(() => {
      renderWithRoute("/");
    });
    // Adjust selector if Header does not use <header>
    expect(screen.getByRole("banner")).toBeInTheDocument();
  });

  it("renders HomePage at root route", async () => {
    act(() => {
      renderWithRoute("/");
    });
    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /achievement tracker/i, level: 1 })
      ).toBeInTheDocument();
      expect(screen.getByText(/welcome to your achievement tracker/i)).toBeInTheDocument();
    });
  });

  it("renders GroupManagement at /group-management", async () => {
    act(() => {
      renderWithRoute("/group-management");
    });
    await waitFor(() => {
      expect(screen.getByRole("heading", { name: /group manager/i })).toBeInTheDocument();
    });
  });

  it("renders KeyManagement at /key-management", async () => {
    act(() => {
      renderWithRoute("/key-management");
    });
    await waitFor(() => {
      expect(screen.getByRole("heading", { name: /api keys/i })).toBeInTheDocument();
    });
  });

  it("renders Achievements at /achievements", async () => {
    act(() => {
      renderWithRoute("/achievements");
    });
    await waitFor(() => {
      expect(screen.getByRole("heading", { name: "Achievement Groups" })).toBeInTheDocument();
    });
  });

  it("renders ComponentShowcase at /showcase", async () => {
    act(() => {
      renderWithRoute("/showcase");
    });
    await waitFor(() => {
      expect(screen.getByText(/showcase/i)).toBeInTheDocument();
    });
  });

  // Optionally, add a 404 test if a catch-all route is implemented
});

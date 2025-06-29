import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach, type Mock } from "vitest";
import { verifyApiKey } from "@/services/gw2-api";
import { useAPIKeyStore } from "@/stores/api-keys";
import KeyManagement from "../KeyManagement";

// Mock the API key store
vi.mock("@/stores/api-keys", () => ({
  useAPIKeyStore: vi.fn(),
}));

// Mock the GW2 API service
vi.mock("@/services/gw2-api", () => ({
  verifyApiKey: vi.fn(),
}));

describe("KeyManagement", () => {
  const mockStore = {
    keys: [],
    currentKeyId: null,
    addKey: vi.fn(),
    batchAddKeys: vi.fn(),
    updateKey: vi.fn(),
    removeKey: vi.fn(),
    setCurrentKey: vi.fn(),
    toggleSelected: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useAPIKeyStore as unknown as Mock).mockReturnValue(mockStore);
    (verifyApiKey as Mock).mockResolvedValue({
      id: "1",
      name: "Test Account",
      access: [],
    });
  });

  it("renders the key management interface", () => {
    render(<KeyManagement />);
    expect(screen.getByText("API Keys")).toBeInTheDocument();
    expect(screen.getByText("Add New Key")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /import api keys/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /export api keys/i })).toBeInTheDocument();
  });

  it("shows empty state when no keys exist", () => {
    render(<KeyManagement />);
    expect(screen.getByText("No API keys added yet!")).toBeInTheDocument();
    expect(
      screen.getByText("Add your first key using the button above to get started.")
    ).toBeInTheDocument();
  });

  it("shows key count badge", () => {
    render(<KeyManagement />);
    expect(screen.getByText("0 keys")).toBeInTheDocument();
  });

  it("disables export button when no keys exist", () => {
    render(<KeyManagement />);
    const exportButton = screen.getByRole("button", { name: /export api keys/i });
    expect(exportButton).toBeDisabled();
  });

  it("enables import button when no keys exist", () => {
    render(<KeyManagement />);
    const importButton = screen.getByRole("button", { name: /import api keys/i });
    expect(importButton).not.toBeDisabled();
  });

  it("shows table when keys exist", () => {
    const mockStoreWithKeys = {
      ...mockStore,
      keys: [
        {
          id: "1",
          name: "Test Key 1",
          key: "test-key-1",
          accountId: "account-1",
          accountName: "Test Account 1",
          permissions: ["account", "characters"],
          isSelected: false,
          isInvalid: false,
          characters: [{ name: "Character1" }],
        },
      ],
    };
    (useAPIKeyStore as unknown as Mock).mockReturnValue(mockStoreWithKeys);

    render(<KeyManagement />);
    expect(screen.getByText("Test Key 1")).toBeInTheDocument();
    expect(screen.getByText("1 keys")).toBeInTheDocument();
  });

  it("enables export button when keys exist", () => {
    const mockStoreWithKeys = {
      ...mockStore,
      keys: [
        {
          id: "1",
          name: "Test Key 1",
          key: "test-key-1",
          accountId: "account-1",
          accountName: "Test Account 1",
          permissions: ["account", "characters"],
          isSelected: false,
          isInvalid: false,
          characters: [{ name: "Character1" }],
        },
      ],
    };
    (useAPIKeyStore as unknown as Mock).mockReturnValue(mockStoreWithKeys);

    render(<KeyManagement />);
    const exportButton = screen.getByRole("button", { name: /export api keys/i });
    expect(exportButton).not.toBeDisabled();
  });
});

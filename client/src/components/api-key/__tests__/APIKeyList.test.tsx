/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { render, screen, within } from "@testing-library/react";
import { act } from "react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi, beforeEach } from "vitest";

import { useAPIKeyStore } from "@/stores/api-keys";

import { APIKeyList } from "../APIKeyList";

// Mock the store
vi.mock("@/stores/api-keys", () => ({
  useAPIKeyStore: vi.fn(),
}));

describe("APIKeyList", () => {
  const mockKeys = [
    {
      id: "1",
      name: "Test Key 1",
      key: "test-key-1",
      accountId: "account-1",
      accountName: "Test Account 1",
      permissions: ["account", "characters"],
      isSelected: false,
      isInvalid: false,
      characters: [{ name: "Character1" }, { name: "Character2" }, { name: "Character3" }],
    },
    {
      id: "2",
      name: "Test Key 2",
      key: "test-key-2",
      accountId: "account-2",
      accountName: "Test Account 2",
      permissions: ["account"],
      isSelected: true,
      isInvalid: false,
      characters: [{ name: "Character4" }],
    },
  ];

  const mockStore = {
    keys: mockKeys,
    addKey: vi.fn(),
    batchAddKeys: vi.fn(),
    updateKey: vi.fn(),
    removeKey: vi.fn(),
    setCurrentKey: vi.fn(),
    toggleSelected: vi.fn(),
    currentKeyId: "1",
  };

  beforeEach(() => {
    vi.clearAllMocks();
    const mockUseAPIKeyStore = useAPIKeyStore as any;
    mockUseAPIKeyStore.mockReturnValue(mockStore);
  });

  describe("Basic Rendering", () => {
    it("shows Add New Key button when there are no keys", () => {
      const mockUseAPIKeyStore = useAPIKeyStore as any;
      mockUseAPIKeyStore.mockReturnValue({
        ...mockStore,
        keys: [],
        currentKeyId: null,
      });

      render(<APIKeyList />);

      const addButton = screen.getByRole("button", { name: /add new key/i });
      expect(addButton).toBeInTheDocument();
      expect(screen.getByText(/no api keys added yet/i)).toBeInTheDocument();
    });

    it("shows Add New Key button when there are keys", () => {
      render(<APIKeyList />);

      const addButton = screen.getByRole("button", { name: /add new key/i });
      expect(addButton).toBeInTheDocument();
      expect(screen.getByText("Test Key 1")).toBeInTheDocument();
    });

    it("shows key count badge", () => {
      render(<APIKeyList />);
      expect(screen.getByText("2 keys")).toBeInTheDocument();
    });

    it("shows export and import buttons", () => {
      render(<APIKeyList />);

      const exportButton = screen.getByRole("button", { name: /export api keys/i });
      const importButton = screen.getByRole("button", { name: /import api keys/i });

      expect(exportButton).toBeInTheDocument();
      expect(importButton).toBeInTheDocument();
    });

    it("disables export button when no keys exist", () => {
      const mockUseAPIKeyStore = useAPIKeyStore as any;
      mockUseAPIKeyStore.mockReturnValue({
        ...mockStore,
        keys: [],
        currentKeyId: null,
      });

      render(<APIKeyList />);

      const exportButton = screen.getByRole("button", { name: /export api keys/i });
      expect(exportButton).toBeDisabled();
    });

    it("opens Add New Key dialog when button is clicked (empty state)", async () => {
      const mockUseAPIKeyStore = useAPIKeyStore as any;
      mockUseAPIKeyStore.mockReturnValue({
        ...mockStore,
        keys: [],
        currentKeyId: null,
      });

      render(<APIKeyList />);
      const addButton = screen.getByRole("button", { name: /add new key/i });
      await act(async () => {
        await userEvent.click(addButton);
      });
      const dialog = await screen.findByRole("dialog");
      expect(dialog).toBeInTheDocument();
      // Check for the API key input by label within the dialog
      expect(within(dialog).getByLabelText(/api key/i)).toBeInTheDocument();
    });

    it("opens Import dialog when button is clicked (empty state)", async () => {
      const mockUseAPIKeyStore = useAPIKeyStore as any;
      mockUseAPIKeyStore.mockReturnValue({
        ...mockStore,
        keys: [],
        currentKeyId: null,
      });

      render(<APIKeyList />);
      const importButton = screen.getByRole("button", { name: /import api keys/i });
      await act(async () => {
        await userEvent.click(importButton);
      });
      const dialog = await screen.findByRole("dialog");
      expect(dialog).toBeInTheDocument();
      // Check for textarea in import dialog
      expect(screen.getByPlaceholderText(/paste exported api key json here/i)).toBeInTheDocument();
    });

    it("opens Add New Key dialog when button is clicked (with keys)", async () => {
      render(<APIKeyList />);
      const addButton = screen.getByRole("button", { name: /add new key/i });
      await act(async () => {
        await userEvent.click(addButton);
      });
      const dialog = await screen.findByRole("dialog");
      expect(dialog).toBeInTheDocument();
      expect(within(dialog).getByLabelText(/api key/i)).toBeInTheDocument();
    });

    it("opens Import dialog when button is clicked (with keys)", async () => {
      render(<APIKeyList />);
      const importButton = screen.getByRole("button", { name: /import api keys/i });
      await act(async () => {
        await userEvent.click(importButton);
      });
      const dialog = await screen.findByRole("dialog");
      expect(dialog).toBeInTheDocument();
      expect(
        within(dialog).getByPlaceholderText(/paste exported api key json here/i)
      ).toBeInTheDocument();
    });
  });
});

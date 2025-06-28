import { render, screen, fireEvent, within, waitFor, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { create } from "zustand";

import { verifyApiKey } from "@/services/gw2-api";
import { useAPIKeyStore } from "@/stores/api-keys";
import type { APIKey } from "@/stores/api-keys";

import KeyManagement from "../KeyManagement";

// Mock the API key store
vi.mock("@/stores/api-keys", () => ({
  useAPIKeyStore: vi.fn(),
}));

// Mock the GW2 API service
vi.mock("@/services/gw2-api", () => ({
  verifyApiKey: vi.fn(),
}));

// Create a real Zustand store instance for all tests
const createTestStore = () =>
  create<{
    keys: APIKey[];
    addKey: (key: APIKey) => void;
    removeKey: (id: string) => void;
    setCurrentKey: (id: string) => void;
    toggleSelected: (id: string) => void;
  }>((set) => ({
    keys: [],
    addKey: (key) => set((state) => ({ keys: [...state.keys, key] })),
    removeKey: vi.fn(),
    setCurrentKey: vi.fn(),
    toggleSelected: vi.fn(),
  }));

let testStore = createTestStore();

describe("KeyManagement", () => {
  beforeEach(() => {
    testStore = createTestStore();
    (useAPIKeyStore as unknown as Mock).mockImplementation(() => ({
      keys: [],
      addKey: testStore.getState().addKey,
      removeKey: testStore.getState().removeKey,
      setCurrentKey: testStore.getState().setCurrentKey,
      toggleSelected: testStore.getState().toggleSelected,
    }));
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
  });

  it("shows add key form when clicking add key button", () => {
    render(<KeyManagement />);
    fireEvent.click(screen.getByText("Add New Key"));
    expect(screen.getByText("Add New API Key")).toBeInTheDocument();
  });

  it("adds a new API key successfully", async () => {
    const { getByRole, getByLabelText, getByTestId } = render(<KeyManagement />);

    // Click add new key button
    act(() => {
      fireEvent.click(getByRole("button", { name: /add new key/i }));
    });

    // Fill in the form
    const apiKeyInput = getByLabelText("API Key");
    const nameInput = getByLabelText("Name");

    act(() => {
      fireEvent.change(apiKeyInput, {
        target: {
          value: "A1B2C3D4-E5F6-7890-ABCD-1234567890ABCDEF1234-5678-90AB-CDEF-1234567890AB",
        },
      });
      fireEvent.change(nameInput, { target: { value: "Test Key" } });
      fireEvent.submit(getByTestId("api-key-form"));
    });

    // Wait for the dialog to close and verify the key was added
    await waitFor(() => {
      expect(testStore.getState().keys).toHaveLength(1);
      expect(testStore.getState().keys[0].name).toBe("Test Key");
    });
  });

  it("shows error when adding key with incorrect length", () => {
    render(<KeyManagement />);

    fireEvent.click(screen.getByRole("button", { name: /add new key/i }));
    const dialog = screen.getByRole("dialog");
    const form = within(dialog).getByTestId("api-key-form");
    const apiKeyInput = within(form).getByLabelText(/API Key/i);
    const nameInput = within(form).getByLabelText(/Name/i);
    const saveButton = within(form).getByRole("button", { name: /save/i });

    fireEvent.change(nameInput, { target: { value: "Test Key" } });
    fireEvent.change(apiKeyInput, { target: { value: "short" } });
    fireEvent.click(saveButton);

    expect(screen.getByTestId("error-message")).toBeInTheDocument();
    expect(screen.getByTestId("error-message")).toHaveTextContent(
      "API key must follow the format: XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXXXXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"
    );
  });

  it("shows error when adding key with whitespace-only API key", () => {
    render(<KeyManagement />);

    fireEvent.click(screen.getByRole("button", { name: /add new key/i }));
    const dialog = screen.getByRole("dialog");
    const form = within(dialog).getByTestId("api-key-form");
    const apiKeyInput = within(form).getByLabelText(/API Key/i);
    const nameInput = within(form).getByLabelText(/Name/i);
    const saveButton = within(form).getByRole("button", { name: /save/i });

    fireEvent.change(nameInput, { target: { value: "Test Key" } });
    fireEvent.change(apiKeyInput, { target: { value: "   " } });
    fireEvent.click(saveButton);

    expect(screen.getByTestId("error-message")).toBeInTheDocument();
    expect(screen.getByTestId("error-message")).toHaveTextContent(
      "API key must follow the format: XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXXXXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"
    );
  });

  it("shows error when adding key with invalid characters", () => {
    render(<KeyManagement />);

    fireEvent.click(screen.getByRole("button", { name: /add new key/i }));
    const dialog = screen.getByRole("dialog");
    const form = within(dialog).getByTestId("api-key-form");
    const apiKeyInput = within(form).getByLabelText(/API Key/i);
    const nameInput = within(form).getByLabelText(/Name/i);
    const saveButton = within(form).getByRole("button", { name: /save/i });

    fireEvent.change(nameInput, { target: { value: "Test Key" } });
    fireEvent.change(apiKeyInput, {
      target: {
        value: "INVALID-KEY-WITH-SYMBOLS!@#$%-123456789012345678901234567890123456789012345678",
      },
    });
    fireEvent.click(saveButton);

    expect(screen.getByTestId("error-message")).toBeInTheDocument();
    expect(screen.getByTestId("error-message")).toHaveTextContent(
      "API key must follow the format: XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXXXXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"
    );
  });

  it("shows error when adding key with invalid format", () => {
    render(<KeyManagement />);

    fireEvent.click(screen.getByRole("button", { name: /add new key/i }));
    const dialog = screen.getByRole("dialog");
    const form = within(dialog).getByTestId("api-key-form");
    const apiKeyInput = within(form).getByLabelText(/API Key/i);
    const nameInput = within(form).getByLabelText(/Name/i);
    const saveButton = within(form).getByRole("button", { name: /save/i });

    fireEvent.change(nameInput, { target: { value: "Test Key" } });
    fireEvent.change(apiKeyInput, {
      target: { value: "12345678-ABCD-EFGH-IJKL-MNOPQRSTUVWZYZ1234567890123456789012345678901234" },
    });
    fireEvent.click(saveButton);

    expect(screen.getByTestId("error-message")).toBeInTheDocument();
    expect(screen.getByTestId("error-message")).toHaveTextContent(
      "API key must follow the format: XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXXXXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"
    );
  });

  it("shows error when adding key with empty name", () => {
    render(<KeyManagement />);
    fireEvent.click(screen.getByText("Add New Key"));

    const apiKeyInput = screen.getByLabelText("API Key");
    const nameInput = screen.getByLabelText("Name");

    fireEvent.change(apiKeyInput, {
      target: { value: "12345678-1234-1234-1234-12345678901234567890-1234-1234-1234-123456789012" },
    });
    fireEvent.change(nameInput, { target: { value: "" } });

    fireEvent.submit(screen.getByTestId("api-key-form"));

    expect(screen.getByTestId("error-message")).toBeInTheDocument();
    expect(screen.getByTestId("error-message")).toHaveTextContent(
      "Please enter a name for your API key"
    );
  });
});

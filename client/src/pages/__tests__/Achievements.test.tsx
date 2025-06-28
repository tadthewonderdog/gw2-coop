import { screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";

import { renderWithThemeProvider } from "@/test/utils";

import Achievements from "../Achievements";

// Mock the API key store to always provide a valid key
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
vi.mock("@/stores/api-keys", () => ({
  useAPIKeyStore: (selector: (store: { keys: typeof mockKeys; currentKeyId: string }) => unknown) =>
    selector({ keys: mockKeys, currentKeyId: mockCurrentKeyId }),
}));

describe("Achievements", () => {
  it("renders the achievements page with title", () => {
    renderWithThemeProvider(
      <MemoryRouter>
        <Achievements />
      </MemoryRouter>
    );
    expect(screen.getByRole("heading", { name: "Achievement Groups" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Select a Category" })).toBeInTheDocument();
  });
});

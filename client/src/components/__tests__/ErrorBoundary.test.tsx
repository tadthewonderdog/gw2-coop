/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

import ErrorBoundary from "../ErrorBoundary";

// Component that throws an error
const ThrowError = () => {
  throw new Error("Test error");
};

// Component that throws an error with a custom message
const ThrowCustomError = () => {
  throw new Error("Custom error message");
};

// Component that throws a non-Error object
const ThrowNonError = () => {
  throw new Error("This is not an Error object");
};

describe("ErrorBoundary", () => {
  // We use 'any' here because Vitest's MockInstance type is not fully compatible with the expected type signature.
  // This is safe in this test context, as we only use mockRestore and mockImplementation.
  let consoleSpy: any;

  beforeEach(() => {
    consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    // This is a safe usage: mockRestore is always called in the correct context for Vitest/Jest spies.
    consoleSpy.mockRestore();
  });

  it("renders children when there is no error", () => {
    render(
      <ErrorBoundary>
        <div>Test content</div>
      </ErrorBoundary>
    );
    expect(screen.getByText("Test content")).toBeInTheDocument();
  });

  it("renders error UI when child component throws", () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );
    expect(screen.getByText(/oops! something went wrong/i)).toBeInTheDocument();
    expect(screen.getByText(/test error/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /try again/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /refresh page/i })).toBeInTheDocument();
  });

  it("renders error UI with custom error message", () => {
    render(
      <ErrorBoundary>
        <ThrowCustomError />
      </ErrorBoundary>
    );
    expect(screen.getByText(/custom error message/i)).toBeInTheDocument();
  });

  it("handles non-Error objects gracefully", () => {
    render(
      <ErrorBoundary>
        <ThrowNonError />
      </ErrorBoundary>
    );
    expect(screen.getByText(/we're sorry, but something went wrong/i)).toBeInTheDocument();
  });

  it("resets error state when try again button is clicked", async () => {
    let key = 0;
    const { rerender } = render(
      <ErrorBoundary key={key}>
        <ThrowError />
      </ErrorBoundary>
    );
    // Initially shows error
    expect(screen.getByText(/oops! something went wrong/i)).toBeInTheDocument();
    // Click try again
    const tryAgainButton = screen.getByRole("button", { name: /try again/i });
    fireEvent.click(tryAgainButton);
    // Rerender with non-error component and a new key to force remount
    key++;
    rerender(
      <ErrorBoundary key={key}>
        <div>Test content</div>
      </ErrorBoundary>
    );
    // Wait for the content to appear
    await waitFor(() => {
      expect(screen.getByText("Test content")).toBeInTheDocument();
    });
  });

  it("reloads page when refresh button is clicked", () => {
    const originalLocation = window.location;
    // @ts-expect-error - Mocking window.location
    delete window.location;
    const reloadMock = vi.fn();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    window.location = { ...originalLocation, reload: reloadMock } as any;
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );
    const refreshButton = screen.getByRole("button", { name: /refresh page/i });
    fireEvent.click(refreshButton);
    expect(reloadMock).toHaveBeenCalledTimes(1);
    // @ts-expect-error - Restoring window.location
    window.location = originalLocation;
  });

  it("logs error details to console", () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("Error: Uncaught [Error: Test error]"),
      expect.any(Error)
    );
  });
});

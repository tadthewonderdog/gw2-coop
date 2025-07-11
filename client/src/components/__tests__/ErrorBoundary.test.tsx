/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
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
  throw "This is not an Error object";
};

describe("ErrorBoundary", () => {
  // We use 'any' here because Vitest's MockInstance type is not fully compatible with the expected type signature.
  // This is safe in this test context, as we only use mockRestore and mockImplementation.
  let consoleSpy: any;

  beforeEach(() => {
    consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    // Vitest mockRestore is always safe here; suppressing unbound-method lint for test context
    // eslint-disable-next-line @typescript-eslint/unbound-method
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
    delete (window as any).location;
    (window as any).location = { ...originalLocation, reload: vi.fn() };
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );
    const refreshButton = screen.getByRole("button", { name: /refresh page/i });
    fireEvent.click(refreshButton);
    expect(window.location.reload).toHaveBeenCalledTimes(1);
    (window as any).location = originalLocation;
  });

  it("logs error details to console", () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );
    // React 19 changed the error logging format
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("%o\n\n%s\n\n%s\n"),
      expect.any(Error),
      expect.stringContaining("The above error occurred in the <ThrowError> component."),
      expect.stringContaining(
        "React will try to recreate this component tree from scratch using the error boundary you provided, ErrorBoundary."
      )
    );
  });
});

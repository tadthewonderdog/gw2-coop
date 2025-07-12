import { vi, describe, it, expect } from "vitest";

import { retryAsync } from "@/lib/utils";

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
export const mockApiError = (): Promise<never> => {
  return Promise.reject(new Error("Test error"));
};

// Mock sessionStorage helper
export const mockSessionStorage = (key: string, value: string) => {
  window.sessionStorage.setItem(key, value);
};

describe("retryAsync", () => {
  it("resolves on first try if no error", async () => {
    const fn = vi.fn().mockResolvedValue("success");
    const result = await retryAsync(fn, 3, 10);
    expect(result).toBe("success");
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("retries on failure and eventually succeeds", async () => {
    const fn = vi
      .fn()
      .mockRejectedValueOnce(new Error("fail1"))
      .mockRejectedValueOnce(new Error("fail2"))
      .mockResolvedValue("final");
    const result = await retryAsync(fn, 3, 10);
    expect(result).toBe("final");
    expect(fn).toHaveBeenCalledTimes(3);
  });

  it("throws the last error if all retries fail", async () => {
    const fn = vi.fn().mockRejectedValue(new Error("fail always"));
    await expect(retryAsync(fn, 3, 10)).rejects.toThrow("fail always");
    expect(fn).toHaveBeenCalledTimes(3);
  });

  it("waits between retries (exponential backoff)", async () => {
    const fn = vi
      .fn()
      .mockRejectedValueOnce(new Error("fail1"))
      .mockRejectedValueOnce(new Error("fail2"))
      .mockResolvedValue("final");
    const start = Date.now();
    await retryAsync(fn, 3, 20);
    const elapsed = Date.now() - start;
    // Should be at least 20ms + 40ms (exponential backoff)
    expect(elapsed).toBeGreaterThanOrEqual(55); // allow for some timing variance
  });
});

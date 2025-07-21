import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility to merge class names using clsx and tailwind-merge.
 * @param inputs Class values to merge
 * @returns A single merged className string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Retries an async function with exponential backoff.
 * @param fn The async function to retry
 * @param retries Number of attempts (default: 3)
 * @param delay Initial delay in ms (default: 500)
 * @returns The result of the async function
 */
export async function retryAsync<T>(fn: () => Promise<T>, retries = 3, delay = 500): Promise<T> {
  let attempt = 0;
  let lastError: unknown;
  while (attempt < retries) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (attempt < retries - 1) {
        await new Promise((res) => setTimeout(res, delay * Math.pow(2, attempt)));
      }
    }
    attempt++;
  }
  throw lastError;
}

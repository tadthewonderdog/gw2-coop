import type { Hono, Next } from "hono";
import { describe, expect, it, vi } from "vitest";
import { z } from "zod";

import app from "./index";

const helloSchema = z.object({
  ok: z.boolean(),
  message: z.string(),
});

vi.mock("hono/cloudflare-pages", () => {
  return {
    serveStatic: vi.fn(() => (_c: Hono, next: Next) => next()),
  };
});

describe("Hono app", () => {
  it('should return a "hello" message for the /api/hello route', async () => {
    const res = await app.request("/api/hello");
    expect(res.status).toBe(200);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const json = await res.json();
    const parsed = helloSchema.parse(json);
    expect(parsed).toEqual({ ok: true, message: "Hello from Hono!" });
  });

  it("should return 404 for an unknown route", async () => {
    const res = await app.request("/foo");
    expect(res.status).toBe(404);
  });
});

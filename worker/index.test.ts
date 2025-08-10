import { describe, expect, it } from "vitest";
import { z } from "zod";

import app from "./index";

const helloSchema = z.object({
  ok: z.boolean(),
  message: z.string(),
});

describe("Hono app", () => {
  it('should return a "hello" message for the /api/hello route', async () => {
    const res = await app.request("/api/hello");
    expect(res.status).toBe(200);

    const json = await res.json();
    const parsed = helloSchema.parse(json);
    expect(parsed).toEqual({ ok: true, message: "Hello from Hono!" });
  });

  it("should return 404 for an unknown API route", async () => {
    const res = await app.request("/api/foo");
    expect(res.status).toBe(404);
  });

  it("should serve the main app for frontend routes", async () => {
    const res = await app.request("/foo");
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toContain("text/html");
  });
});

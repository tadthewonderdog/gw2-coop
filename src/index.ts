import { Hono } from "hono";
import { serveStatic } from "hono/cloudflare-pages";

const app = new Hono();

app.get("/api/hello", (c) => {
  return c.json({ ok: true, message: "Hello from Hono!" });
});

app.get("*", serveStatic());

export default app;

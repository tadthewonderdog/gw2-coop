import { Hono } from "hono";

const app = new Hono();

app.get("/api/hello", (c) => {
  return c.json({ ok: true, message: "Hello from Hono!" });
});

app.get("/", (c) => c.text("Hono!"));

export default app;

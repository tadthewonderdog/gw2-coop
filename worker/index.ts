import { Hono } from "hono";
import { cors } from "hono/cors";

const app = new Hono();

// Enable CORS for API routes
app.use("/api/*", cors());

// API routes
app.get("/api/hello", (c) => {
  return c.json({ ok: true, message: "Hello from Hono!" });
});

// Serve the main React app for all routes (SPA routing)
app.get("/*", async (c) => {
  // For Cloudflare Workers, we'll let the wrangler configuration handle static assets
  // and just serve the main index.html for SPA routing
  return c.html(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>GW2 Coop</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
      </head>
      <body>
        <div id="root">Loading...</div>
        <script type="module" src="/assets/index.js"></script>
      </body>
    </html>
  `);
});

export default app;

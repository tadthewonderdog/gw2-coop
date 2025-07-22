import { Hono } from 'hono'
import { serveStatic } from 'hono/cloudflare-pages'

const app = new Hono()

app.get('/api/hello', (c) => {
  return c.json({ ok: true, message: 'Hello from Hono!' })
})

app.get('*', (c, next) => {
  // Runtime check for env.ASSETS
  if (!('ASSETS' in c.env) || typeof c.env.ASSETS?.fetch !== 'function') {
    return c.text('Static asset serving is not available: env.ASSETS is not bound.\nAre you running outside Cloudflare Pages or wrangler pages dev?', 501)
  }
  return serveStatic()(c, next)
})

export default app

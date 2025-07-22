import app from './index'
import { describe, expect, it, vi } from 'vitest'
import type { Hono, Next } from 'hono'

vi.mock('hono/cloudflare-pages', () => {
  return {
    serveStatic: vi.fn(() => (_c: Hono, next: Next) => next()),
  }
})

describe('Hono app', () => {
  it('should return a "hello" message for the /api/hello route', async () => {
    const res = await app.request('/api/hello')
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json).toEqual({ ok: true, message: 'Hello from Hono!' })
  })

  it('should return 404 for an unknown route', async () => {
    const res = await app.request('/foo')
    expect(res.status).toBe(404)
  })
})
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { admin } from '@/lib/client';

const stub = (status: number, body: unknown = {}) => {
  const fn = vi.fn(async () => ({ ok: status < 400, status, json: async () => body }));
  vi.stubGlobal('fetch', fn);
  return fn;
};

beforeEach(() => { localStorage.clear(); });
afterEach(() => vi.unstubAllGlobals());

describe('admin() fetch wrapper', () => {
  it('sends a credentialed cookie request with JSON body', async () => {
    const f = stub(200, { ok: true });
    await admin('/categories', { method: 'POST', body: { name: 'Career' } });
    const [url, init] = (f.mock.calls as unknown as Array<[string, RequestInit]>)[0]!;
    expect(url).toMatch(/\/admin\/categories$/);
    expect(init.method).toBe('POST');
    expect(init.headers).toMatchObject({ 'X-Admin-Request': '1', 'Content-Type': 'application/json' });
    expect(init.credentials).toBe('include');
    expect(init.body).toBe('{"name":"Career"}');
  });
  it('returns null for 204', async () => {
    stub(204);
    expect(await admin('/x', { method: 'DELETE' })).toBeNull();
  });
  it('throws the API error message', async () => {
    stub(400, { error: 'That category already exists.' });
    await expect(admin('/categories', { method: 'POST', body: {} })).rejects.toThrow('That category already exists.');
  });
  it('on 401 redirects to /login', async () => {
    stub(401);
    const loc = { href: '' };
    vi.stubGlobal('location', loc);
    Object.defineProperty(window, 'location', { value: loc, writable: true });
    await expect(admin('/posts')).rejects.toThrow('Please sign in again.');
    expect(loc.href).toBe('/login');
  });
});

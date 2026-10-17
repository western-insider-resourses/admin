import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { checkSession, clearLegacyToken, inviteCodeRequired, login, logout, signup } from '@/lib/auth';

const mockFetch = (status: number, body: unknown) => {
  const fn = vi.fn(async () => ({ ok: status < 400, status, json: async () => body }));
  vi.stubGlobal('fetch', fn);
  return fn;
};
const lastCall = (fn: ReturnType<typeof mockFetch>) =>
  (fn.mock.calls as unknown as Array<[string, RequestInit]>).at(-1)!;

beforeEach(() => localStorage.clear());
afterEach(() => vi.unstubAllGlobals());

describe('cookie auth', () => {
  it('removes a token left by the previous localStorage version', () => {
    localStorage.setItem('admin_token', 'old-token');
    clearLegacyToken();
    expect(localStorage.getItem('admin_token')).toBeNull();
  });

  it('posts credentials with cookies enabled and does not expose a token', async () => {
    const f = mockFetch(200, { email: 'a@b.co' });
    await login('a@b.co', 'pw');
    const [url, init] = lastCall(f);
    expect(url).toMatch(/\/auth\/login$/);
    expect(JSON.parse(init.body as string)).toEqual({ email: 'a@b.co', password: 'pw' });
    expect(init.credentials).toBe('include');
  });

  it('throws the API error without storing a token', async () => {
    mockFetch(401, { error: 'Email or password is incorrect.' });
    await expect(login('a@b.co', 'bad')).rejects.toThrow('Email or password is incorrect.');
    expect(localStorage.getItem('admin_token')).toBeNull();
  });

  it('checks the session with credentials and an admin-request header', async () => {
    const f = mockFetch(200, { email: 'a@b.co' });
    expect(await checkSession()).toBe(true);
    const [url, init] = lastCall(f);
    expect(url).toMatch(/\/auth\/session$/);
    expect(init.credentials).toBe('include');
    expect(init.headers).toEqual({ 'X-Admin-Request': '1' });
  });

  it('logs out by asking the API to clear the cookie', async () => {
    const f = mockFetch(204, {});
    await logout();
    expect(lastCall(f)[1]).toMatchObject({ method: 'POST', credentials: 'include' });
  });
});

describe('signup', () => {
  it('sends the invite code only when given', async () => {
    const f = mockFetch(201, { email: 'a@b.co' });
    await signup('a@b.co', 'longenough1');
    expect(JSON.parse(lastCall(f)[1].body as string)).toEqual({ email: 'a@b.co', password: 'longenough1' });
    await signup('a@b.co', 'longenough1', 'code');
    expect(JSON.parse(lastCall(f)[1].body as string)).toMatchObject({ inviteCode: 'code' });
  });
  it('surfaces "already exists"', async () => {
    mockFetch(409, { error: 'An account with that email already exists.' });
    await expect(signup('a@b.co', 'longenough1')).rejects.toThrow(/already exists/);
  });
});

describe('inviteCodeRequired', () => {
  it('reads the server flag and defaults to false on failure', async () => {
    mockFetch(200, { inviteCodeRequired: true });
    expect(await inviteCodeRequired()).toBe(true);
    vi.stubGlobal('fetch', vi.fn(async () => { throw new Error('down'); }));
    expect(await inviteCodeRequired()).toBe(false);
  });
});

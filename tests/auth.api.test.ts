import { beforeEach, describe, expect, it, vi } from 'vitest';
import { api } from '@/services/Client';
import {
  checkSessionApi,
  loginApi,
  logoutApi,
  signupApi,
  signupConfigApi,
} from '@/services/api/auth.api';

vi.mock('@/services/Client', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

const get = vi.mocked(api.get);
const post = vi.mocked(api.post);
beforeEach(() => vi.clearAllMocks());

describe('admin auth API endpoints', () => {
  it('posts login credentials to the login endpoint', async () => {
    post.mockResolvedValue({ data: { email: 'admin@example.com' } } as never);

    await expect(loginApi({ email: 'admin@example.com', password: 'secret' }))
      .resolves.toEqual({ email: 'admin@example.com' });
    expect(post).toHaveBeenCalledWith('/v1/auth/login', {
      email: 'admin@example.com',
      password: 'secret',
    });
  });

  it('posts signup credentials and optional invite code', async () => {
    post.mockResolvedValue({ data: { email: 'admin@example.com' } } as never);

    await signupApi({ email: 'admin@example.com', password: 'secret123', inviteCode: 'invite' });
    expect(post).toHaveBeenCalledWith('/v1/auth/signup', {
      email: 'admin@example.com',
      password: 'secret123',
      inviteCode: 'invite',
    });
  });

  it('checks the admin session with the required request header', async () => {
    get.mockResolvedValue({ data: { email: 'admin@example.com' } } as never);

    await expect(checkSessionApi()).resolves.toEqual({ email: 'admin@example.com' });
    expect(get).toHaveBeenCalledWith('/v1/auth/session', {
      headers: { 'X-Admin-Request': '1' },
    });
  });

  it('posts to logout and gets signup configuration', async () => {
    post.mockResolvedValue({ data: undefined } as never);
    get.mockResolvedValue({ data: { inviteCodeRequired: true } } as never);

    await expect(logoutApi()).resolves.toBeUndefined();
    await expect(signupConfigApi()).resolves.toEqual({ inviteCodeRequired: true });
    expect(post).toHaveBeenCalledWith('/v1/auth/logout');
    expect(get).toHaveBeenCalledWith('/v1/auth/signup-config');
  });
});

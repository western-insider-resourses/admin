import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import axios from 'axios';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import {
  checkSessionApi,
  loginApi,
  logoutApi,
  signupApi,
  signupConfigApi,
} from '@/services/api/auth.api';
import {
  authSessionKey,
  clearLegacyToken,
  useAuthSession,
  useLogin,
  useLogout,
  useSignup,
  useSignupConfig,
} from '@/hooks/api/useAuth';

vi.mock('@/services/api/auth.api', () => ({
  checkSessionApi: vi.fn(),
  loginApi: vi.fn(),
  logoutApi: vi.fn(),
  signupApi: vi.fn(),
  signupConfigApi: vi.fn(),
}));

let queryClient: QueryClient;
const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
  queryClient = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });
});

describe('admin auth hooks', () => {
  it('clears the legacy token', () => {
    localStorage.setItem('admin_token', 'old-token');
    clearLegacyToken();
    expect(localStorage.getItem('admin_token')).toBeNull();
  });

  it('uses the login and signup endpoints and updates the session cache', async () => {
    vi.mocked(loginApi).mockResolvedValue({ email: 'admin@example.com' });
    vi.mocked(signupApi).mockResolvedValue({ email: 'new@example.com' });
    const login = renderHook(() => useLogin(), { wrapper });
    const signup = renderHook(() => useSignup(), { wrapper });

    await act(async () => {
      await login.result.current.mutateAsync({ email: 'admin@example.com', password: 'secret' });
    });
    expect(loginApi).toHaveBeenCalledWith({ email: 'admin@example.com', password: 'secret' });
    expect(queryClient.getQueryData(authSessionKey)).toEqual({ email: 'admin@example.com' });

    await act(async () => {
      await signup.result.current.mutateAsync({ email: 'new@example.com', password: 'secret123', inviteCode: 'invite' });
    });
    expect(signupApi).toHaveBeenCalledWith({ email: 'new@example.com', password: 'secret123', inviteCode: 'invite' });
  });

  it('loads signup configuration', async () => {
    vi.mocked(signupConfigApi).mockResolvedValue({ inviteCodeRequired: true });
    const { result } = renderHook(() => useSignupConfig(), { wrapper });
    await waitFor(() => expect(result.current.data?.inviteCodeRequired).toBe(true));
    expect(signupConfigApi).toHaveBeenCalledOnce();
  });

  it('checks session and treats only unauthorized responses as signed out', async () => {
    vi.mocked(checkSessionApi).mockResolvedValue({ email: 'admin@example.com' });
    const session = renderHook(() => useAuthSession(), { wrapper });
    await waitFor(() => expect(session.result.current.data).toEqual({ email: 'admin@example.com' }));
    expect(checkSessionApi).toHaveBeenCalledOnce();

    queryClient.removeQueries({ queryKey: authSessionKey });
    vi.mocked(checkSessionApi).mockRejectedValue(new axios.AxiosError('Unauthorized', undefined, undefined, undefined, {
      status: 401,
      statusText: 'Unauthorized',
      headers: {},
      config: { headers: new axios.AxiosHeaders() },
      data: { error: 'Please sign in again.' },
    }));
    session.rerender();
    await waitFor(() => expect(session.result.current.data).toBeNull());
  });

  it('surfaces unexpected session errors and clears the cache after logout', async () => {
    const failure = new Error('Network unavailable');
    vi.mocked(checkSessionApi).mockRejectedValue(failure);
    const session = renderHook(() => useAuthSession(), { wrapper });
    await waitFor(() => expect(session.result.current.error).toBe(failure));

    queryClient.setQueryData(authSessionKey, { email: 'admin@example.com' });
    vi.mocked(logoutApi).mockResolvedValue();
    const logout = renderHook(() => useLogout(), { wrapper });
    await act(async () => { await logout.result.current.mutateAsync(); });
    expect(logoutApi).toHaveBeenCalledOnce();
    expect(queryClient.getQueryData(authSessionKey)).toBeNull();
  });
});

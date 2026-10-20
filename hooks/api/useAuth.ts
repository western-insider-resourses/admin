'use client';
import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  checkSessionApi,
  loginApi,
  logoutApi,
  signupApi,
  signupConfigApi,
} from '@/services/api/auth.api';
import type { AuthResponse, LoginPayload, SignupPayload } from '@/services/api/types';

export const authSessionKey = ['auth', 'session'] as const;
export const signupConfigKey = ['auth', 'signup-config'] as const;

export function clearLegacyToken(): void {
  try {
    localStorage.removeItem('admin_token');
  } catch {
    // Authentication uses the HttpOnly cookie; legacy storage may be unavailable.
  }
}

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: LoginPayload) => {
      clearLegacyToken();
      return loginApi(payload);
    },
    onSuccess: (session) => queryClient.setQueryData(authSessionKey, session),
  });
}

export function useSignup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: SignupPayload) => {
      clearLegacyToken();
      return signupApi(payload);
    },
    onSuccess: (session) => queryClient.setQueryData(authSessionKey, session),
  });
}

export function useAuthSession() {
  return useQuery({
    queryKey: authSessionKey,
    queryFn: async () => {
      clearLegacyToken();
      try {
        return await checkSessionApi();
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) return null;
        throw error;
      }
    },
    staleTime: 30_000,
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: logoutApi,
    onSuccess: async () => {
      queryClient.setQueryData<AuthResponse | null>(authSessionKey, null);
      await queryClient.invalidateQueries({ queryKey: ['auth'] });
    },
  });
}

export function useSignupConfig() {
  return useQuery({
    queryKey: signupConfigKey,
    queryFn: signupConfigApi,
    staleTime: 5 * 60_000,
  });
}
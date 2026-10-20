import { api } from '../Client';
import type {
  AuthResponse,
  LoginPayload,
  SignupConfigResponse,
  SignupPayload,
} from './types';

const AUTH_ENDPOINT = '/v1/auth';

export async function loginApi(payload: LoginPayload): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>(`${AUTH_ENDPOINT}/login`, payload);
  return data;
}

export async function signupApi(payload: SignupPayload): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>(`${AUTH_ENDPOINT}/signup`, payload);
  return data;
}

export async function checkSessionApi(): Promise<AuthResponse> {
  const { data } = await api.get<AuthResponse>(`${AUTH_ENDPOINT}/session`, {
    headers: { 'X-Admin-Request': '1' },
  });
  return data;
}

export async function logoutApi(): Promise<void> {
  await api.post<void>(`${AUTH_ENDPOINT}/logout`);
}

export async function signupConfigApi(): Promise<SignupConfigResponse> {
  const { data } = await api.get<SignupConfigResponse>(`${AUTH_ENDPOINT}/signup-config`);
  return data;
}

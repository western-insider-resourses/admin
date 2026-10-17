import { API_URL } from "./api";

interface AuthResponse {
  email?: string;
  error?: string;
}

export function clearLegacyToken(): void {
  try {
    localStorage.removeItem("admin_token");
  } catch {
    // Ignore unavailable storage; authentication is cookie-based.
  }
}

async function post(
  path: string,
  body: Record<string, unknown>,
): Promise<string> {
  clearLegacyToken();
  const res = await fetch(`${API_URL}/auth/${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(body),
  });
  const data = (await res.json().catch(() => ({}))) as AuthResponse;
  if (!res.ok)
    throw new Error(data.error || "Something went wrong. Try again.");
  return data.email || "";
}

export const login = (email: string, password: string) =>
  post("login", { email, password });
export const signup = (email: string, password: string, inviteCode?: string) =>
  post("signup", { email, password, ...(inviteCode ? { inviteCode } : {}) });

export async function inviteCodeRequired(): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/auth/signup-config`);
    return res.ok
      ? !!((await res.json()) as { inviteCodeRequired?: boolean })
          .inviteCodeRequired
      : false;
  } catch {
    return false;
  }
}

export async function checkSession(): Promise<boolean> {
  clearLegacyToken();
  try {
    const res = await fetch(`${API_URL}/auth/session`, {
      headers: { "X-Admin-Request": "1" },
      credentials: "include",
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function logout(): Promise<void> {
  await fetch(`${API_URL}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
}

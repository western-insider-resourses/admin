import { API_URL } from "./api";

interface Options {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  form?: FormData;
}

// Admin requests rely on the API's HttpOnly session cookie.
export async function admin<T = unknown>(
  path: string,
  { method = "GET", body, form }: Options = {},
): Promise<T> {
  const headers: Record<string, string> = { "X-Admin-Request": "1" };
  if (body) headers["Content-Type"] = "application/json";
  const res = await fetch(`${API_URL}/admin${path}`, {
    method,
    headers,
    credentials: "include",
    body: body ? JSON.stringify(body) : form,
  });
  if (res.status === 401) {
    window.location.href = "/login";
    throw new Error("Please sign in again.");
  }
  if (res.status === 204) return null as T;
  const data = await res.json().catch(() => ({}));
  if (!res.ok)
    throw new Error(
      (data as { error?: string }).error || "Something went wrong.",
    );
  return data as T;
}

export interface UploadedImage {
  url: string;
  public_id: string;
}

export function uploadImages(
  files: File[] | FileList,
): Promise<UploadedImage[]> {
  const form = new FormData();
  Array.from(files).forEach((f) => form.append("images", f));
  return admin<UploadedImage[]>("/upload", { method: "POST", form });
}

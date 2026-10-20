import { BASE_API } from "@/lib/api";
import axios, {AxiosError} from "axios";

export const api = axios.create({
  baseURL: BASE_API,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});
export interface ApiErrorBody {
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
}

export type ApiError = AxiosError<ApiErrorBody>;

/** Pulls a readable message out of any thrown error. */
export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError<ApiErrorBody>(error)) {
    return error.response?.data?.error ?? error.response?.data?.message ?? error.message;
  }
  if (error instanceof Error) return error.message;
  return "Something went wrong";
}

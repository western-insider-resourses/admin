import { api } from '../Client';
import { ADMIN_ENDPOINT, ADMIN_REQUEST_CONFIG } from './admin.api';
import type { AdminCommentsResponse, CommentStatusPayload } from './types';

const COMMENTS_ENDPOINT = `${ADMIN_ENDPOINT}/comments`;

export async function listCommentsApi(): Promise<AdminCommentsResponse> {
  const { data } = await api.get<AdminCommentsResponse>(COMMENTS_ENDPOINT, ADMIN_REQUEST_CONFIG);
  return data;
}

export async function updateCommentApi(id: number, payload: CommentStatusPayload): Promise<{ ok: boolean }> {
  const { data } = await api.patch<{ ok: boolean }>(
    `${COMMENTS_ENDPOINT}/${id}`,
    payload,
    ADMIN_REQUEST_CONFIG,
  );
  return data;
}

export async function deleteCommentApi(id: number): Promise<void> {
  await api.delete(`${COMMENTS_ENDPOINT}/${id}`, ADMIN_REQUEST_CONFIG);
}

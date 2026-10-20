import { api } from '../Client';
import { ADMIN_ENDPOINT, ADMIN_REQUEST_CONFIG } from './admin.api';
import type {
  AdminPostPayload,
  AdminPostResponse,
  AdminPostsResponse,
} from './types';
import type { AdminPostRow } from '@/lib/types';

const POSTS_ENDPOINT = `${ADMIN_ENDPOINT}/posts`;

export async function listPostsApi(): Promise<AdminPostsResponse> {
  const { data } = await api.get<AdminPostsResponse>(POSTS_ENDPOINT, ADMIN_REQUEST_CONFIG);
  return data;
}

export async function getPostApi(id: string): Promise<AdminPostResponse> {
  const { data } = await api.get<AdminPostResponse>(
    `${POSTS_ENDPOINT}/${encodeURIComponent(id)}`,
    ADMIN_REQUEST_CONFIG,
  );
  return data;
}

export async function createPostApi(payload: AdminPostPayload): Promise<Pick<AdminPostRow, 'id' | 'slug'>> {
  const { data } = await api.post<Pick<AdminPostRow, 'id' | 'slug'>>(
    POSTS_ENDPOINT,
    payload,
    ADMIN_REQUEST_CONFIG,
  );
  return data;
}

export async function updatePostApi(id: string, payload: AdminPostPayload): Promise<{ ok: boolean }> {
  const { data } = await api.put<{ ok: boolean }>(
    `${POSTS_ENDPOINT}/${encodeURIComponent(id)}`,
    payload,
    ADMIN_REQUEST_CONFIG,
  );
  return data;
}

export async function deletePostApi(id: string): Promise<void> {
  await api.delete(`${POSTS_ENDPOINT}/${encodeURIComponent(id)}`, ADMIN_REQUEST_CONFIG);
}

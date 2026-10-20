import { api } from '../Client';
import { ADMIN_ENDPOINT, ADMIN_REQUEST_CONFIG } from './admin.api';
import type { AdminCategoriesResponse, CategoryPayload } from './types';
import type { AdminCategory } from '@/lib/types';

const CATEGORIES_ENDPOINT = `${ADMIN_ENDPOINT}/categories`;

export async function listCategoriesApi(): Promise<AdminCategoriesResponse> {
  const { data } = await api.get<AdminCategoriesResponse>(CATEGORIES_ENDPOINT, ADMIN_REQUEST_CONFIG);
  return data;
}

export async function createCategoryApi(payload: CategoryPayload): Promise<AdminCategory> {
  const { data } = await api.post<AdminCategory>(CATEGORIES_ENDPOINT, payload, ADMIN_REQUEST_CONFIG);
  return data;
}

export async function updateCategoryApi(id: number, payload: CategoryPayload): Promise<{ ok: boolean }> {
  const { data } = await api.put<{ ok: boolean }>(
    `${CATEGORIES_ENDPOINT}/${id}`,
    payload,
    ADMIN_REQUEST_CONFIG,
  );
  return data;
}

export async function deleteCategoryApi(id: number): Promise<void> {
  await api.delete(`${CATEGORIES_ENDPOINT}/${id}`, ADMIN_REQUEST_CONFIG);
}

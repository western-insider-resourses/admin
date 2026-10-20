'use client';

import { useQuery } from '@tanstack/react-query';
import { useAdminMutation, adminQueryKeys } from './adminQuery';
import {
  createCategoryApi,
  deleteCategoryApi,
  listCategoriesApi,
  updateCategoryApi,
} from '@/services/api/categories.api';
import type { CategoryPayload } from '@/services/api/types';

export function useCategories() {
  return useQuery({ queryKey: adminQueryKeys.categories(), queryFn: listCategoriesApi });
}

export function useCreateCategory() {
  return useAdminMutation((payload: CategoryPayload) => createCategoryApi(payload));
}

export function useUpdateCategory() {
  return useAdminMutation(({ id, payload }: { id: number; payload: CategoryPayload }) => updateCategoryApi(id, payload));
}

export function useDeleteCategory() {
  return useAdminMutation((id: number) => deleteCategoryApi(id));
}

'use client';

import { useQuery } from '@tanstack/react-query';
import { useAdminMutation, adminQueryKeys } from './adminQuery';
import {
  createPostApi,
  deletePostApi,
  getPostApi,
  listPostsApi,
  updatePostApi,
} from '@/services/api/posts.api';
import type { AdminPostPayload } from '@/services/api/types';

export function usePosts() {
  return useQuery({ queryKey: adminQueryKeys.posts(), queryFn: listPostsApi });
}

export function usePost(id: string) {
  return useQuery({
    queryKey: adminQueryKeys.post(id),
    queryFn: () => getPostApi(id),
    enabled: Boolean(id),
  });
}

export function useCreatePost() {
  return useAdminMutation((payload: AdminPostPayload) => createPostApi(payload));
}

export function useUpdatePost() {
  return useAdminMutation(({ id, payload }: { id: string; payload: AdminPostPayload }) => updatePostApi(id, payload));
}

export function useDeletePost() {
  return useAdminMutation((id: string) => deletePostApi(id));
}

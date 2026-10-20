'use client';

import { useQuery } from '@tanstack/react-query';
import { useAdminMutation, adminQueryKeys } from './adminQuery';
import {
  deleteCommentApi,
  listCommentsApi,
  updateCommentApi,
} from '@/services/api/comments.api';
import type { CommentStatusPayload } from '@/services/api/types';

export function useComments() {
  return useQuery({ queryKey: adminQueryKeys.comments(), queryFn: listCommentsApi });
}

export function useUpdateComment() {
  return useAdminMutation(({ id, payload }: { id: number; payload: CommentStatusPayload }) => updateCommentApi(id, payload));
}

export function useDeleteComment() {
  return useAdminMutation((id: number) => deleteCommentApi(id));
}

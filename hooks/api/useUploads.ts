'use client';

import { useMutation } from '@tanstack/react-query';
import { useAdminMutation } from './adminQuery';
import { removeUploadApi, uploadImagesApi } from '@/services/api/upload.api';
import type { RemoveUploadPayload } from '@/services/api/types';

export function useUploadImages() {
  return useMutation({ mutationFn: uploadImagesApi });
}

export function useRemoveUpload() {
  return useAdminMutation((payload: RemoveUploadPayload) => removeUploadApi(payload));
}

import { api } from '../Client';
import { ADMIN_ENDPOINT, ADMIN_REQUEST_CONFIG } from './admin.api';
import type { RemoveUploadPayload } from './types';

const UPLOAD_ENDPOINT = `${ADMIN_ENDPOINT}/upload`;

export async function uploadImagesApi(files: File[] | FileList): Promise<Array<{ url: string; public_id: string }>> {
  const form = new FormData();
  Array.from(files).forEach((file) => form.append('images', file));
  const { data } = await api.post<Array<{ url: string; public_id: string }>>(
    UPLOAD_ENDPOINT,
    form,
    {
      headers: {
        ...ADMIN_REQUEST_CONFIG.headers,
        'Content-Type': 'multipart/form-data',
      },
    },
  );
  return data;
}

export async function removeUploadApi(payload: RemoveUploadPayload): Promise<void> {
  await api.post<void>(`${UPLOAD_ENDPOINT}/remove`, payload, ADMIN_REQUEST_CONFIG);
}

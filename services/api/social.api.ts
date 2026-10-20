import { api } from '../Client';
import { ADMIN_ENDPOINT, ADMIN_REQUEST_CONFIG } from './admin.api';
import type {
  AdminSocialLinksResponse,
  SocialLinkPayload,
  SocialLinkStatusPayload,
} from './types';
import type { SocialLink } from '@/lib/types';

const SOCIAL_ENDPOINT = `${ADMIN_ENDPOINT}/social`;

export async function listSocialLinksApi(): Promise<AdminSocialLinksResponse> {
  const { data } = await api.get<AdminSocialLinksResponse>(SOCIAL_ENDPOINT, ADMIN_REQUEST_CONFIG);
  return data;
}

export async function createSocialLinkApi(payload: SocialLinkPayload): Promise<SocialLink> {
  const { data } = await api.post<SocialLink>(SOCIAL_ENDPOINT, payload, ADMIN_REQUEST_CONFIG);
  return data;
}

export async function updateSocialLinkStatusApi(
  id: number,
  payload: SocialLinkStatusPayload,
): Promise<{ ok: boolean }> {
  const { data } = await api.patch<{ ok: boolean }>(
    `${SOCIAL_ENDPOINT}/${id}`,
    payload,
    ADMIN_REQUEST_CONFIG,
  );
  return data;
}

export async function deleteSocialLinkApi(id: number): Promise<void> {
  await api.delete(`${SOCIAL_ENDPOINT}/${id}`, ADMIN_REQUEST_CONFIG);
}

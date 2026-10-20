import { api } from '../Client';
import { ADMIN_ENDPOINT, ADMIN_REQUEST_CONFIG } from './admin.api';
import type { AdminAdsResponse, AdPayload, AdStatusPayload } from './types';
import type { AdminAd } from '@/lib/types';

const ADS_ENDPOINT = `${ADMIN_ENDPOINT}/ads`;

export async function listAdsApi(): Promise<AdminAdsResponse> {
  const { data } = await api.get<AdminAdsResponse>(ADS_ENDPOINT, ADMIN_REQUEST_CONFIG);
  return data;
}

export async function createAdApi(payload: AdPayload): Promise<AdminAd> {
  const { data } = await api.post<AdminAd>(ADS_ENDPOINT, payload, ADMIN_REQUEST_CONFIG);
  return data;
}

export async function updateAdApi(id: number, payload: AdPayload): Promise<{ ok: boolean }> {
  const { data } = await api.put<{ ok: boolean }>(
    `${ADS_ENDPOINT}/${id}`,
    payload,
    ADMIN_REQUEST_CONFIG,
  );
  return data;
}

export async function updateAdStatusApi(id: number, payload: AdStatusPayload): Promise<{ ok: boolean }> {
  const { data } = await api.patch<{ ok: boolean }>(
    `${ADS_ENDPOINT}/${id}`,
    payload,
    ADMIN_REQUEST_CONFIG,
  );
  return data;
}

export async function deleteAdApi(id: number): Promise<void> {
  await api.delete(`${ADS_ENDPOINT}/${id}`, ADMIN_REQUEST_CONFIG);
}

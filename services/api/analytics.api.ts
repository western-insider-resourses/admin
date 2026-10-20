import { api } from '../Client';
import { ADMIN_ENDPOINT, ADMIN_REQUEST_CONFIG } from './admin.api';
import type {
  AdminAdsenseResponse,
  AdminAnalyticsResponse,
  AdsenseQuery,
  AnalyticsQuery,
} from './types';

export async function getAnalyticsApi({ days = 30 }: AnalyticsQuery = {}): Promise<AdminAnalyticsResponse> {
  const { data } = await api.get<AdminAnalyticsResponse>(`${ADMIN_ENDPOINT}/analytics`, {
    ...ADMIN_REQUEST_CONFIG,
    params: { days },
  });
  return data;
}

export async function getAdsenseApi({ range = '30d' }: AdsenseQuery = {}): Promise<AdminAdsenseResponse> {
  const { data } = await api.get<AdminAdsenseResponse>(`${ADMIN_ENDPOINT}/adsense`, {
    ...ADMIN_REQUEST_CONFIG,
    params: { range },
  });
  return data;
}

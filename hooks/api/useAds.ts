'use client';

import { useQuery } from '@tanstack/react-query';
import { useAdminMutation, adminQueryKeys } from './adminQuery';
import {
  createAdApi,
  deleteAdApi,
  listAdsApi,
  updateAdApi,
  updateAdStatusApi,
} from '@/services/api/ads.api';
import type { AdPayload, AdStatusPayload } from '@/services/api/types';

export function useAds() {
  return useQuery({ queryKey: adminQueryKeys.ads(), queryFn: listAdsApi });
}

export function useCreateAd() {
  return useAdminMutation((payload: AdPayload) => createAdApi(payload));
}

export function useUpdateAd() {
  return useAdminMutation(({ id, payload }: { id: number; payload: AdPayload }) => updateAdApi(id, payload));
}

export function useUpdateAdStatus() {
  return useAdminMutation(({ id, payload }: { id: number; payload: AdStatusPayload }) => updateAdStatusApi(id, payload));
}

export function useDeleteAd() {
  return useAdminMutation((id: number) => deleteAdApi(id));
}

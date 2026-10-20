'use client';

import { useQuery } from '@tanstack/react-query';
import { adminQueryKeys } from './adminQuery';
import { getAdsenseApi, getAnalyticsApi } from '@/services/api/analytics.api';

export function useAnalytics(days: number) {
  return useQuery({
    queryKey: adminQueryKeys.analytics(days),
    queryFn: () => getAnalyticsApi({ days }),
  });
}

export function useAdsense(range: string) {
  return useQuery({
    queryKey: adminQueryKeys.adsense(range),
    queryFn: () => getAdsenseApi({ range }),
  });
}

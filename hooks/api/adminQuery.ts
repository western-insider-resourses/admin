'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

export const adminQueryRoot = ['admin'] as const;
export const adminQueryKeys = {
  posts: () => [...adminQueryRoot, 'posts'] as const,
  post: (id: string) => [...adminQueryRoot, 'posts', id] as const,
  categories: () => [...adminQueryRoot, 'categories'] as const,
  comments: () => [...adminQueryRoot, 'comments'] as const,
  ads: () => [...adminQueryRoot, 'ads'] as const,
  social: () => [...adminQueryRoot, 'social'] as const,
  analytics: (days: number) => [...adminQueryRoot, 'analytics', days] as const,
  adsense: (range: string) => [...adminQueryRoot, 'adsense', range] as const,
};

export function useAdminMutation<TVariables, TResult>(
  mutationFn: (variables: TVariables) => Promise<TResult>,
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: adminQueryRoot }),
  });
}

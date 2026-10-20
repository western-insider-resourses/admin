'use client';

import { useQuery } from '@tanstack/react-query';
import { useAdminMutation, adminQueryKeys } from './adminQuery';
import {
  createSocialLinkApi,
  deleteSocialLinkApi,
  listSocialLinksApi,
  updateSocialLinkStatusApi,
} from '@/services/api/social.api';
import type { SocialLinkPayload, SocialLinkStatusPayload } from '@/services/api/types';

export function useSocialLinks() {
  return useQuery({ queryKey: adminQueryKeys.social(), queryFn: listSocialLinksApi });
}

export function useCreateSocialLink() {
  return useAdminMutation((payload: SocialLinkPayload) => createSocialLinkApi(payload));
}

export function useUpdateSocialLinkStatus() {
  return useAdminMutation(({ id, payload }: { id: number; payload: SocialLinkStatusPayload }) => updateSocialLinkStatusApi(id, payload));
}

export function useDeleteSocialLink() {
  return useAdminMutation((id: number) => deleteSocialLinkApi(id));
}

import type {
  AdminAd,
  AdminCategory,
  AdminComment,
  AdminPostDetail,
  AdminPostRow,
  AdsenseData,
  Analytics,
  SocialLink,
} from '@/lib/types';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignupPayload extends LoginPayload {
  inviteCode?: string;
}

export interface AuthResponse {
  email: string;
}

export interface SignupConfigResponse {
  inviteCodeRequired: boolean;
}

export interface AdminPostPayload {
  title: string;
  excerpt: string;
  body: string;
  categoryId: number | null;
  status: 'draft' | 'published';
  featured: boolean;
  author: string;
  images: Array<{ url: string; public_id: string | null; caption: string }>;
}

export interface CategoryPayload {
  name: string;
  position?: number;
}

export interface CommentStatusPayload {
  status: 'visible' | 'hidden';
}

export interface AdPayload {
  name: string;
  placement: AdminAd['placement'];
  image_url: string | null;
  image_public_id: string | null;
  link_url: string | null;
  html_code: string | null;
  active: boolean;
}

export interface AdStatusPayload {
  active: boolean;
}

export interface SocialLinkPayload {
  platform: string;
  url: string;
}

export interface SocialLinkStatusPayload {
  active: boolean;
}

export interface RemoveUploadPayload {
  public_id: string;
}

export interface AnalyticsQuery {
  days?: number;
}

export interface AdsenseQuery {
  range?: string;
}

export type AdminPostsResponse = AdminPostRow[];
export type AdminPostResponse = AdminPostDetail;
export type AdminCategoriesResponse = AdminCategory[];
export type AdminCommentsResponse = AdminComment[];
export type AdminAdsResponse = AdminAd[];
export type AdminSocialLinksResponse = SocialLink[];
export type AdminAnalyticsResponse = Analytics;
export type AdminAdsenseResponse = AdsenseData;

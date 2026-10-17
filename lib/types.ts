export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface PostSummary {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featured: boolean;
  author: string;
  views: number;
  published_at: string;
  category_name: string | null;
  category_slug: string | null;
  cover: string | null;
  likes: number;
  comments: number;
}

export interface PostImage {
  url: string;
  caption: string;
  position?: number;
  public_id?: string | null;
}

export interface PostDetail extends PostSummary {
  body: string;
  category_id: number | null;
  images: PostImage[];
  related: PostSummary[];
}

export interface PostsPage {
  posts: PostSummary[];
  page: number;
  pages: number;
  total: number;
}

export interface CommentNode {
  id: number;
  parent_id: number | null;
  name: string;
  body: string;
  created_at: string;
  replies: CommentNode[];
}

export type AdPlacement = "header" | "sidebar" | "in_article" | "footer";

export interface Ad {
  id: number;
  name: string;
  placement: AdPlacement;
  image_url: string | null;
  link_url: string | null;
  html_code: string | null;
}
export interface AdminAd extends Ad {
  image_public_id: string | null;
  active: boolean;
  clicks: number;
}

export interface SocialLink {
  id: number;
  platform: string;
  url: string;
  active?: boolean;
}

// ---- admin ----
export interface AdminPostRow {
  id: string;
  title: string;
  slug: string;
  status: "draft" | "published";
  featured: boolean;
  views: number;
  published_at: string | null;
  created_at: string;
  category_name: string | null;
  cover: string | null;
  likes: number;
  comments: number;
}
export interface AdminCategory extends Category {
  position: number;
  posts: number;
}
export interface AdminComment {
  id: number;
  name: string;
  body: string;
  status: "visible" | "hidden";
  parent_id: number | null;
  created_at: string;
  post_title: string;
  post_slug: string;
}
export interface Analytics {
  days: number;
  totals: { views: number; visitors: number; clicks: number };
  daily: Array<{ day: string; views: number; clicks: number }>;
  topPosts: Array<{ title: string; slug: string; views: number }>;
  topClicks: Array<{ target: string; clicks: number }>;
  sources: Array<{ source: string; views: number }>;
  topPages: Array<{ path: string; views: number }>;
  counts: { posts: number; comments: number; likes: number };
}
export interface AdsenseData {
  configured: boolean;
  currency?: string;
  totals?: {
    earnings: number;
    pageViews: number;
    impressions: number;
    clicks: number;
  };
  days?: Array<{
    date: string;
    earnings: number;
    pageViews: number;
    impressions: number;
    clicks: number;
  }>;
}

export interface AdminPostDetail {
  id: string;
  title: string;
  excerpt: string;
  body: string;
  category_id: number | null;
  status: "draft" | "published";
  featured: boolean;
  author: string;
  images: Array<{ url: string; public_id: string | null; caption: string }>;
}

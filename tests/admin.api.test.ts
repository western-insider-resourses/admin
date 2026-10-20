import { beforeEach, describe, expect, it, vi } from 'vitest';
import { api } from '@/services/Client';
import {
  createAdApi,
  deleteAdApi,
  listAdsApi,
  updateAdApi,
  updateAdStatusApi,
} from '@/services/api/ads.api';
import {
  getAdsenseApi,
  getAnalyticsApi,
} from '@/services/api/analytics.api';
import {
  createCategoryApi,
  deleteCategoryApi,
  listCategoriesApi,
  updateCategoryApi,
} from '@/services/api/categories.api';
import {
  deleteCommentApi,
  listCommentsApi,
  updateCommentApi,
} from '@/services/api/comments.api';
import {
  createPostApi,
  deletePostApi,
  getPostApi,
  listPostsApi,
  updatePostApi,
} from '@/services/api/posts.api';
import {
  createSocialLinkApi,
  deleteSocialLinkApi,
  listSocialLinksApi,
  updateSocialLinkStatusApi,
} from '@/services/api/social.api';
import {
  removeUploadApi,
  uploadImagesApi,
} from '@/services/api/upload.api';

vi.mock('@/services/Client', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

const get = vi.mocked(api.get);
const post = vi.mocked(api.post);
const put = vi.mocked(api.put);
const patch = vi.mocked(api.patch);
const del = vi.mocked(api.delete);
const adminHeaders = { headers: { 'X-Admin-Request': '1' } };

beforeEach(() => {
  vi.clearAllMocks();
  get.mockResolvedValue({ data: [] } as never);
  post.mockResolvedValue({ data: { ok: true } } as never);
  put.mockResolvedValue({ data: { ok: true } } as never);
  patch.mockResolvedValue({ data: { ok: true } } as never);
  del.mockResolvedValue({ data: undefined } as never);
});

describe('admin API endpoints', () => {
  it('fetches each admin data resource and passes query parameters', async () => {
    await listPostsApi();
    await getPostApi('post/1');
    await listCategoriesApi();
    await listCommentsApi();
    await listAdsApi();
    await listSocialLinksApi();
    await getAnalyticsApi({ days: 7 });
    await getAdsenseApi({ range: 'month' });

    expect(get.mock.calls).toEqual([
      ['/v1/admin/posts', adminHeaders],
      ['/v1/admin/posts/post%2F1', adminHeaders],
      ['/v1/admin/categories', adminHeaders],
      ['/v1/admin/comments', adminHeaders],
      ['/v1/admin/ads', adminHeaders],
      ['/v1/admin/social', adminHeaders],
      ['/v1/admin/analytics', { params: { days: 7 }, ...adminHeaders }],
      ['/v1/admin/adsense', { params: { range: 'month' }, ...adminHeaders }],
    ]);
  });

  it('creates, updates, and deletes posts with the correct methods', async () => {
    const payload = {
      title: 'Story',
      excerpt: '',
      body: 'Content',
      categoryId: null,
      status: 'draft' as const,
      featured: false,
      author: 'Editor',
      images: [{ url: 'https://example.com/image.jpg', public_id: 'image-1', caption: '' }],
    };
    await createPostApi(payload);
    await updatePostApi('post-1', payload);
    await deletePostApi('post-1');

    expect(post).toHaveBeenCalledWith('/v1/admin/posts', payload, adminHeaders);
    expect(put).toHaveBeenCalledWith('/v1/admin/posts/post-1', payload, adminHeaders);
    expect(del).toHaveBeenCalledWith('/v1/admin/posts/post-1', adminHeaders);
  });

  it('covers category and comment mutations', async () => {
    await createCategoryApi({ name: 'Technology' });
    await updateCategoryApi(4, { name: 'Tech' });
    await deleteCategoryApi(4);
    await updateCommentApi(9, { status: 'hidden' });
    await deleteCommentApi(9);

    expect(post).toHaveBeenCalledWith('/v1/admin/categories', { name: 'Technology' }, adminHeaders);
    expect(put).toHaveBeenCalledWith('/v1/admin/categories/4', { name: 'Tech' }, adminHeaders);
    expect(del).toHaveBeenCalledWith('/v1/admin/categories/4', adminHeaders);
    expect(patch).toHaveBeenCalledWith('/v1/admin/comments/9', { status: 'hidden' }, adminHeaders);
    expect(del).toHaveBeenCalledWith('/v1/admin/comments/9', adminHeaders);
  });

  it('covers ad and social link mutations', async () => {
    const ad = {
      name: 'Banner',
      placement: 'sidebar' as const,
      image_url: null,
      image_public_id: null,
      link_url: null,
      html_code: '<div>Ad</div>',
      active: true,
    };
    await createAdApi(ad);
    await updateAdApi(5, ad);
    await updateAdStatusApi(5, { active: false });
    await deleteAdApi(5);
    await createSocialLinkApi({ platform: 'X', url: 'https://x.com/example' });
    await updateSocialLinkStatusApi(2, { active: false });
    await deleteSocialLinkApi(2);

    expect(post).toHaveBeenCalledWith('/v1/admin/ads', ad, adminHeaders);
    expect(put).toHaveBeenCalledWith('/v1/admin/ads/5', ad, adminHeaders);
    expect(patch).toHaveBeenCalledWith('/v1/admin/ads/5', { active: false }, adminHeaders);
    expect(del).toHaveBeenCalledWith('/v1/admin/ads/5', adminHeaders);
    expect(post).toHaveBeenCalledWith('/v1/admin/social', { platform: 'X', url: 'https://x.com/example' }, adminHeaders);
    expect(patch).toHaveBeenCalledWith('/v1/admin/social/2', { active: false }, adminHeaders);
    expect(del).toHaveBeenCalledWith('/v1/admin/social/2', adminHeaders);
  });

  it('uploads image files as multipart data and removes uploads by public ID', async () => {
    const file = new File(['image'], 'banner.png', { type: 'image/png' });
    post.mockResolvedValueOnce({ data: [{ url: 'https://example.com/banner.png', public_id: 'banner-1' }] } as never);

    await uploadImagesApi([file]);
    const [url, form, config] = post.mock.calls[0]!;
    expect(url).toBe('/v1/admin/upload');
    expect(form).toBeInstanceOf(FormData);
    expect((form as FormData).getAll('images')).toEqual([file]);
    expect(config).toEqual({
      headers: { 'Content-Type': 'multipart/form-data', 'X-Admin-Request': '1' },
    });

    await removeUploadApi({ public_id: 'banner-1' });
    expect(post).toHaveBeenLastCalledWith('/v1/admin/upload/remove', { public_id: 'banner-1' }, adminHeaders);
  });
});

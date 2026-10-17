'use client';
import { admin } from '@/lib/client';
import { SITE_URL } from '@/lib/api';
import { cl, fmtDate } from '@/lib/utils';
import { useAdminData } from '@/hooks/useAdminData';
import { useAction } from '@/hooks/useAction';
import { Badge, Button, Card, Notice, PageTitle } from '@/components/ui';
import type { AdminPostRow } from '@/lib/types';

export default function Posts() {
  const { data, error, reload } = useAdminData<AdminPostRow[]>('/posts');
  const { run, message } = useAction(reload);

  async function remove(p: AdminPostRow) {
    if (!confirm(`Delete "${p.title}"? Its images, comments and likes are deleted too.`)) return;
    await run(() => admin(`/posts/${p.id}`, { method: 'DELETE' }));
  }

  return (
    <>
      <PageTitle action={<Button href="/posts/new" variant="primary">Write a story</Button>}>Stories</PageTitle>
      <Notice error={error || message} />
      <Card className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 text-mute">
            <tr><th className="p-3">Story</th><th>Niche</th><th>Status</th><th>Reads</th><th>Likes</th><th>Comments</th><th>Date</th><th></th></tr>
          </thead>
          <tbody>
            {data?.map((p) => (
              <tr key={p.id} className="border-b border-slate-100 last:border-0">
                <td className="max-w-xs p-3">
                  <div className="flex items-center gap-3">
                    {p.cover && <img src={cl(p.cover, 120)} alt="" className="h-10 w-14 rounded object-cover" />}
                    <span className="font-semibold">{p.title}{p.featured && <span className="ml-2"><Badge>Featured</Badge></span>}</span>
                  </div>
                </td>
                <td>{p.category_name || '-'}</td>
                <td><span className={p.status === 'published' ? 'text-green-700' : 'text-amber-700'}>{p.status === 'published' ? 'Published' : 'Draft'}</span></td>
                <td>{p.views}</td><td>{p.likes}</td><td>{p.comments}</td><td>{fmtDate(p.published_at || p.created_at)}</td>
                <td className="space-x-2 whitespace-nowrap p-3 text-right">
                  {p.status === 'published' && <a className="btn" href={`${SITE_URL}/post/${p.slug}`} target="_blank" rel="noopener noreferrer">View</a>}
                  <Button href={`/posts/${p.id}`}>Edit</Button>
                  <Button variant="danger" onClick={() => void remove(p)}>Delete</Button>
                </td>
              </tr>
            ))}
            {data?.length === 0 && <tr><td colSpan={8} className="p-8 text-center text-mute">No stories yet. Write your first one.</td></tr>}
          </tbody>
        </table>
      </Card>
    </>
  );
}

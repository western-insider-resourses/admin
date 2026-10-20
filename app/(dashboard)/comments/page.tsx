'use client';
import { SITE_URL } from '@/lib/api';
import { errorMessage, timeAgo } from '@/lib/utils';
import { useAction } from '@/hooks/useAction';
import { useComments, useDeleteComment, useUpdateComment } from '@/hooks/api/useComments';
import { Button, Card, Notice, PageTitle } from '@/components/ui';

export default function Comments() {
  const { data, error } = useComments();
  const updateComment = useUpdateComment();
  const deleteComment = useDeleteComment();
  const { run, message } = useAction();
  return (
    <>
      <PageTitle>Comments</PageTitle>
      <Notice error={(error ? errorMessage(error) : '') || message} />
      <Card className="divide-y divide-slate-100">
        {data?.map((c) => (
          <div key={c.id} className="flex flex-wrap items-start gap-3 p-4">
            <div className="min-w-0 flex-1">
              <p className="text-sm"><b>{c.name}</b> <span className="text-mute">on </span>
                <a className="font-semibold hover:text-crimson" target="_blank" rel="noopener noreferrer" href={`${SITE_URL}/post/${c.post_slug}`}>{c.post_title}</a>
                <span className="text-mute"> &middot; {timeAgo(c.created_at)}{c.parent_id ? ' · reply' : ''}</span></p>
              <p className={`mt-1 whitespace-pre-line break-words ${c.status === 'hidden' ? 'text-slate-400 line-through' : ''}`}>{c.body}</p>
            </div>
            <Button onClick={() => void run(() => updateComment.mutateAsync({ id: c.id, payload: { status: c.status === 'hidden' ? 'visible' : 'hidden' } }))}>
              {c.status === 'hidden' ? 'Show' : 'Hide'}</Button>
            <Button variant="danger" onClick={() => confirm('Delete this comment and its replies?') && void run(() => deleteComment.mutateAsync(c.id))}>Delete</Button>
          </div>
        ))}
        {data?.length === 0 && <p className="p-8 text-center text-mute">No comments yet.</p>}
      </Card>
    </>
  );
}

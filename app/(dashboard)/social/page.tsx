'use client';
import { useState, type FormEvent } from 'react';
import { errorMessage, PLATFORMS } from '@/lib/utils';
import { useAction } from '@/hooks/useAction';
import { useCreateSocialLink, useDeleteSocialLink, useSocialLinks, useUpdateSocialLinkStatus } from '@/hooks/api/useSocial';
import { Button, Card, Notice, PageTitle } from '@/components/ui';

export default function Social() {
  const { data, error } = useSocialLinks();
  const createSocialLink = useCreateSocialLink();
  const deleteSocialLink = useDeleteSocialLink();
  const updateSocialLinkStatus = useUpdateSocialLinkStatus();
  const { run, message } = useAction();
  const [platform, setPlatform] = useState(PLATFORMS[0]);
  const [url, setUrl] = useState('');

  const add = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    void run(async () => { await createSocialLink.mutateAsync({ platform, url }); setUrl(''); });
  };

  return (
    <>
      <PageTitle>Social links</PageTitle>
      <p className="mb-4 text-mute">These appear in the sidebar and footer of the site.</p>
      <Notice error={(error ? errorMessage(error) : '') || message} />
      <form onSubmit={add} className="my-4 flex max-w-2xl flex-wrap gap-2">
        <select className="input w-40" value={platform} onChange={(e) => setPlatform(e.target.value)} aria-label="Platform">{PLATFORMS.map((p) => <option key={p}>{p}</option>)}</select>
        <input className="input min-w-0 flex-1" placeholder="https://instagram.com/yourpage" value={url} onChange={(e) => setUrl(e.target.value)} aria-label="Link" />
        <Button type="submit" variant="primary">Add link</Button>
      </form>
      <Card className="max-w-2xl divide-y divide-slate-100">
        {data?.map((l) => (
          <div key={l.id} className="flex items-center gap-3 p-3">
            <div className="min-w-0 flex-1"><p className="font-semibold">{l.platform}</p><p className="truncate text-sm text-mute">{l.url}</p></div>
            <Button onClick={() => void run(() => updateSocialLinkStatus.mutateAsync({ id: l.id, payload: { active: !l.active } }))}>{l.active ? 'Hide' : 'Show'}</Button>
            <Button variant="danger" onClick={() => void run(() => deleteSocialLink.mutateAsync(l.id))}>Delete</Button>
          </div>
        ))}
        {data?.length === 0 && <p className="p-6 text-center text-mute">No links yet.</p>}
      </Card>
    </>
  );
}

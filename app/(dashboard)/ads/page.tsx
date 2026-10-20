'use client';
import { useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { cl, errorMessage } from '@/lib/utils';
import type { AdPlacement } from '@/lib/types';
import { useAction } from '@/hooks/useAction';
import {
  useAds,
  useCreateAd,
  useDeleteAd,
  useUpdateAdStatus,
} from '@/hooks/api/useAds';
import { useUploadImages } from '@/hooks/api/useUploads';
import { Button, Card, EmptyState, Notice, PageTitle, SelectField, TextArea, TextField } from '@/components/ui';

const PLACEMENTS: Array<[AdPlacement, string]> = [['header', 'Top of every page'], ['sidebar', 'Sidebar'], ['in_article', 'Inside stories'], ['footer', 'Footer']];
interface AdForm {
  name: string; placement: AdPlacement; link_url: string; html_code: string;
  image_url: string; image_public_id: string; active: boolean;
}

const blank: AdForm = { name: '', placement: 'sidebar', link_url: '', html_code: '', image_url: '', image_public_id: '', active: true };

export default function Ads() {
  const { data, error } = useAds();
  const createAd = useCreateAd();
  const deleteAd = useDeleteAd();
  const updateAdStatus = useUpdateAdStatus();
  const uploadMutation = useUploadImages();
  const { run, message } = useAction();
  const [f, setF] = useState<AdForm>(blank);
  const [busy, setBusy] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);
  const set = (k: keyof AdForm) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setF({ ...f, [k]: e.target.value });

  async function pick(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    try { const [u] = await uploadMutation.mutateAsync([file]); setF((s) => ({ ...s, image_url: u.url, image_public_id: u.public_id })); }
    catch (err) { setUploadError(errorMessage(err)); } finally { setBusy(false); }
  }

  async function save(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await run(async () => { await createAd.mutateAsync({
      ...f,
      image_url: f.image_url || null,
      image_public_id: f.image_public_id || null,
      link_url: f.link_url || null,
      html_code: f.html_code || null,
    }); setF(blank); });
  }

  return (
    <>
      <PageTitle>Ads</PageTitle>
      <Notice error={(error ? errorMessage(error) : '') || message || uploadError} />
      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <Card as="section" className="space-y-3 p-4"><form onSubmit={save} className="space-y-3">
          <h2 className="font-bold">Add an ad</h2>
          <TextField label="Name" value={f.name} onChange={set('name')} />
          <SelectField label="Where it shows" value={f.placement} onChange={set('placement')}>{PLACEMENTS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</SelectField>
          <div>
            <label className="label">Banner image</label>
            <Button disabled={busy} onClick={() => fileRef.current?.click()}>{busy ? 'Uploading...' : f.image_url ? 'Replace image' : 'Upload banner'}</Button>
            <input ref={fileRef} type="file" accept="image/*" hidden onChange={pick} />
            {f.image_url && <img src={cl(f.image_url, 400)} alt="" className="mt-2 rounded" />}
          </div>
          <TextField label="Link when clicked" placeholder="https://advertiser.com" value={f.link_url} onChange={set('link_url')} />
          <TextArea label="Or paste ad code" hint="(AdSense, etc.)" className="font-mono text-xs" value={f.html_code} onChange={set('html_code')} />
          <Button type="submit" variant="primary" className="w-full">Publish ad</Button>
        </form></Card>

        <div className="space-y-3">
          {data?.map((a) => (
            <Card key={a.id} className="flex flex-wrap items-center gap-4 p-4">
              {a.image_url ? <img src={cl(a.image_url, 240)} alt="" className="h-16 w-28 rounded object-cover" /> : <code className="w-28 text-xs text-mute">Ad code</code>}
              <div className="min-w-0 flex-1">
                <p className="font-bold">{a.name}</p>
                <p className="text-sm text-mute">{PLACEMENTS.find(([v]) => v === a.placement)?.[1]} &middot; {a.clicks} click{a.clicks === 1 ? '' : 's'}</p>
              </div>
              <Button onClick={() => void run(() => updateAdStatus.mutateAsync({ id: a.id, payload: { active: !a.active } }))}>{a.active ? 'Pause' : 'Resume'}</Button>
              <Button variant="danger" onClick={() => confirm(`Delete "${a.name}"?`) && void run(() => deleteAd.mutateAsync(a.id))}>Delete</Button>
            </Card>
          ))}
          {data?.length === 0 && <EmptyState>No ads yet. Add one and it appears on the site straight away.</EmptyState>}
        </div>
      </div>
    </>
  );
}

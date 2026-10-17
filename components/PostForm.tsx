'use client';
import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { admin, uploadImages } from '@/lib/client';
import { cl, errorMessage } from '@/lib/utils';
import type { AdminCategory, AdminPostDetail } from '@/lib/types';
import { Button, Card, Notice, SelectField, TextArea, TextField } from '@/components/ui';

interface FormImage { url: string; public_id: string | null; caption: string }

interface FormState {
  title: string; excerpt: string; body: string; categoryId: number | ''; status: 'draft' | 'published';
  featured: boolean; author: string; images: FormImage[];
}

const empty: FormState = { title: '', excerpt: '', body: '', categoryId: '', status: 'draft', featured: false, author: 'Editorial Team', images: [] };

export default function PostForm({ id }: { id?: string }) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [f, setF] = useState<FormState>(empty);
  const [cats, setCats] = useState<AdminCategory[]>([]);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    admin<AdminCategory[]>('/categories').then(setCats).catch((e: unknown) => setError(errorMessage(e)));
    if (id) {
      admin<AdminPostDetail>(`/posts/${id}`).then((p) => setF({
        title: p.title, excerpt: p.excerpt, body: p.body, categoryId: p.category_id || '',
        status: p.status, featured: p.featured, author: p.author, images: p.images,
      })).catch((e: unknown) => setError(errorMessage(e)));
    }
  }, [id]);

  const set = (k: keyof FormState) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setF({ ...f, [k]: e.target instanceof HTMLInputElement && e.target.type === 'checkbox' ? e.target.checked : e.target.value });

  async function addImages(e: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    e.target.value = '';
    if (!files.length) return;
    const room = 3 - f.images.length;
    if (files.length > room) { setError(`A story can have at most 3 images. You can add ${room} more.`); return; }
    setUploading(true); setError('');
    try {
      const uploaded = await uploadImages(files);
      setF((s) => ({ ...s, images: [...s.images, ...uploaded.map((u) => ({ ...u, caption: '' }))] }));
    } catch (err) { setError(errorMessage(err)); } finally { setUploading(false); }
  }

  const move = (i: number, d: number) => setF((s) => {
    const imgs = [...s.images]; const j = i + d;
    const a = imgs[i]; const b = imgs[j];
    if (!a || !b) return s;
    imgs[i] = b; imgs[j] = a;
    return { ...s, images: imgs };
  });
  const caption = (i: number, v: string) => setF((s) => ({ ...s, images: s.images.map((im, k) => (k === i ? { ...im, caption: v } : im)) }));
  const removeImg = (i: number) => setF((s) => ({ ...s, images: s.images.filter((_, k) => k !== i) }));

  async function save(status?: 'draft' | 'published') {
    setError('');
    if (!f.title.trim()) return setError('Add a title.');
    if (f.images.length < 1) return setError('Add at least 1 image (up to 3).');
    setBusy(true);
    try {
      const body = { ...f, status: status || f.status };
      if (id) await admin(`/posts/${id}`, { method: 'PUT', body });
      else await admin('/posts', { method: 'POST', body });
      router.push('/posts');
    } catch (err) { setError(errorMessage(err)); setBusy(false); }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="space-y-4">
        <Notice error={error} />
        <TextField label="Title" className="[&_input]:text-lg" value={f.title} onChange={set('title')} />
        <TextArea label="Summary" hint="(shown on cards and in link previews)" maxLength={400} value={f.excerpt} onChange={set('excerpt')} />
        <TextArea label="Story" className="[&_textarea]:min-h-96 [&_textarea]:leading-relaxed" value={f.body} onChange={set('body')}
          placeholder="Leave a blank line between paragraphs. Image 2 appears after paragraph 2 and image 3 after paragraph 5." />
      </div>

      <div className="space-y-4">
        <Card as="section" className="space-y-3 p-4">
          <SelectField label="Niche" value={f.categoryId} onChange={set('categoryId')}>
            <option value="">No niche</option>{cats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </SelectField>
          <TextField label="Author" value={f.author} onChange={set('author')} />
          <label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={f.featured} onChange={set('featured')} /> Feature on the homepage</label>
          <div className="flex flex-wrap gap-2 pt-1">
            <Button variant="primary" disabled={busy} onClick={() => save('published')}>{f.status === 'published' && id ? 'Update story' : 'Publish'}</Button>
            <Button disabled={busy} onClick={() => save('draft')}>Save as draft</Button>
          </div>
        </Card>

        <Card as="section" className="space-y-3 p-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold">Images ({f.images.length}/3)</h2>
            <Button disabled={uploading || f.images.length >= 3} onClick={() => fileRef.current?.click()}>{uploading ? 'Uploading...' : 'Add images'}</Button>
          </div>
          <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={addImages} />
          <p className="text-xs text-mute">1 to 3 images. The first one is the cover.</p>
          {f.images.map((im, i) => (
            <div key={im.url} className="rounded-lg border border-slate-200 p-2">
              <img src={cl(im.url, 400)} alt="" className="h-32 w-full rounded object-cover" />
              <input className="input mt-2" placeholder="Caption (optional)" value={im.caption} onChange={(e) => caption(i, e.target.value)} />
              <div className="mt-2 flex gap-2">
                <Button disabled={i === 0} onClick={() => move(i, -1)}>Move up</Button>
                <Button disabled={i === f.images.length - 1} onClick={() => move(i, 1)}>Move down</Button>
                <Button variant="danger" className="ml-auto" onClick={() => removeImg(i)}>Remove</Button>
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

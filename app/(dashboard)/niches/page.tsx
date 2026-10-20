'use client';
import { useState } from 'react';
import { missingNiches } from '@/lib/niches';
import { errorMessage } from '@/lib/utils';
import { useAction } from '@/hooks/useAction';
import {
  useCategories,
  useCreateCategory,
  useDeleteCategory,
  useUpdateCategory,
} from '@/hooks/api/useCategories';
import { Button, Card, Notice, PageTitle } from '@/components/ui';

// Niches are the categories: each one becomes a tab on the public site.
export default function Niches() {
  const { data, error } = useCategories();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();
  const { run, message } = useAction();
  const [name, setName] = useState('');
  const missing = data ? missingNiches(data) : [];

  return (
    <>
      <PageTitle>Niches</PageTitle>
      <p className="mb-4 text-mute">Each niche becomes a tab in the site header.</p>
      <Notice error={(error ? errorMessage(error) : '') || message} />
      <form className="my-4 flex max-w-md gap-2" onSubmit={(e) => { e.preventDefault(); void run(async () => { await createCategory.mutateAsync({ name }); setName(''); }); }}>
        <input className="input" placeholder="New niche, e.g. Health" value={name} onChange={(e) => setName(e.target.value)} aria-label="Niche name" />
        <Button type="submit" variant="primary">Add</Button>
      </form>
      {missing.length > 0 && (
        <p className="mb-4 text-sm text-mute">
          Missing default niches: {missing.join(', ')}.{' '}
          <button className="font-semibold text-crimson" onClick={() => void run(async () => { for (const n of missing) await createCategory.mutateAsync({ name: n }); })}>Add them</button>
        </p>
      )}
      <Card className="max-w-xl divide-y divide-slate-100">
        {data?.map((c) => (
          <div key={c.id} className="flex items-center gap-3 p-3">
            <span className="flex-1 font-semibold">{c.name} <span className="font-normal text-mute">({c.posts} stories)</span></span>
            <Button onClick={() => { const n = prompt('Rename niche', c.name); if (n) void run(() => updateCategory.mutateAsync({ id: c.id, payload: { name: n } })); }}>Rename</Button>
            <Button variant="danger" onClick={() => confirm(`Delete "${c.name}"? Its stories stay but lose their niche.`) && void run(() => deleteCategory.mutateAsync(c.id))}>Delete</Button>
          </div>
        ))}
        {data?.length === 0 && <p className="p-6 text-center text-mute">No niches yet.</p>}
      </Card>
    </>
  );
}

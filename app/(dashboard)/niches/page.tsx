'use client';
import { useState } from 'react';
import { admin } from '@/lib/client';
import { missingNiches } from '@/lib/niches';
import type { AdminCategory } from '@/lib/types';
import { useAdminData } from '@/hooks/useAdminData';
import { useAction } from '@/hooks/useAction';
import { Button, Card, Notice, PageTitle } from '@/components/ui';

// Niches are the categories: each one becomes a tab on the public site.
export default function Niches() {
  const { data, error, reload } = useAdminData<AdminCategory[]>('/categories');
  const { run, message } = useAction(reload);
  const [name, setName] = useState('');
  const missing = data ? missingNiches(data) : [];

  return (
    <>
      <PageTitle>Niches</PageTitle>
      <p className="mb-4 text-mute">Each niche becomes a tab in the site header.</p>
      <Notice error={error || message} />
      <form className="my-4 flex max-w-md gap-2" onSubmit={(e) => { e.preventDefault(); void run(async () => { await admin('/categories', { method: 'POST', body: { name } }); setName(''); }); }}>
        <input className="input" placeholder="New niche, e.g. Health" value={name} onChange={(e) => setName(e.target.value)} aria-label="Niche name" />
        <Button type="submit" variant="primary">Add</Button>
      </form>
      {missing.length > 0 && (
        <p className="mb-4 text-sm text-mute">
          Missing default niches: {missing.join(', ')}.{' '}
          <button className="font-semibold text-crimson" onClick={() => void run(async () => { for (const n of missing) await admin('/categories', { method: 'POST', body: { name: n } }); })}>Add them</button>
        </p>
      )}
      <Card className="max-w-xl divide-y divide-slate-100">
        {data?.map((c) => (
          <div key={c.id} className="flex items-center gap-3 p-3">
            <span className="flex-1 font-semibold">{c.name} <span className="font-normal text-mute">({c.posts} stories)</span></span>
            <Button onClick={() => { const n = prompt('Rename niche', c.name); if (n) void run(() => admin(`/categories/${c.id}`, { method: 'PUT', body: { name: n } })); }}>Rename</Button>
            <Button variant="danger" onClick={() => confirm(`Delete "${c.name}"? Its stories stay but lose their niche.`) && void run(() => admin(`/categories/${c.id}`, { method: 'DELETE' }))}>Delete</Button>
          </div>
        ))}
        {data?.length === 0 && <p className="p-6 text-center text-mute">No niches yet.</p>}
      </Card>
    </>
  );
}

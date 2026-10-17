'use client';
import { useState } from 'react';
import { SITE_URL } from '@/lib/api';
import type { Analytics } from '@/lib/types';
import { useAdminData } from '@/hooks/useAdminData';
import BarChart from '@/components/BarChart';
import RankedList from '@/components/RankedList';
import { Card, Notice, PageTitle, Stat } from '@/components/ui';

export default function Dashboard() {
  const [days, setDays] = useState(30);
  const { data, error } = useAdminData<Analytics>(`/analytics?days=${days}`);

  return (
    <>
      <PageTitle action={
        <select className="input w-auto" value={days} onChange={(e) => setDays(Number(e.target.value))} aria-label="Date range">
          <option value={7}>Last 7 days</option><option value={30}>Last 30 days</option><option value={90}>Last 90 days</option>
        </select>}>Traffic</PageTitle>
      <Notice error={error} />
      {data && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
            <Stat label="Page views" value={data.totals.views.toLocaleString()} />
            <Stat label="Unique visitors" value={data.totals.visitors.toLocaleString()} />
            <Stat label="Clicks" value={data.totals.clicks.toLocaleString()} sub="stories, ads, shares, tabs" />
            <Stat label="Published stories" value={data.counts.posts} />
            <Stat label="Likes / comments" value={`${data.counts.likes} / ${data.counts.comments}`} sub="all time" />
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <Card as="section" className="p-5"><h2 className="mb-3 font-serif text-xl font-bold">Views per day</h2><BarChart rows={data.daily} field="views" color="bg-ink" /></Card>
            <Card as="section" className="p-5"><h2 className="mb-3 font-serif text-xl font-bold">Clicks per day</h2><BarChart rows={data.daily} field="clicks" color="bg-crimson" /></Card>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <RankedList title="Most read stories" rows={data.topPosts} label="title" value="views" href={(r) => `${SITE_URL}/post/${r.slug}`} />
            <RankedList title="What people click" rows={data.topClicks} label="target" value="clicks" />
            <RankedList title="Where visitors come from" rows={data.sources} label="source" value="views" />
            <RankedList title="Top pages" rows={data.topPages} label="path" value="views" />
          </div>
          <p className="text-sm text-mute">Click names: <code>post:</code> story opened, <code>ad:</code> ad clicked, <code>share:</code> share button, <code>nav:</code> niche tab, <code>social:</code> follow link.</p>
        </div>
      )}
    </>
  );
}

'use client';
import { useState } from 'react';
import { errorMessage } from '@/lib/utils';
import { useAdsense } from '@/hooks/api/useAnalytics';
import { Card, Notice, PageTitle, Stat } from '@/components/ui';

export default function AdSense() {
  const [range, setRange] = useState('30d');
  const { data, error } = useAdsense(range);
  const money = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: data?.currency || 'USD' }).format(n);

  return (
    <>
      <PageTitle action={
        <select className="input w-auto" value={range} onChange={(e) => setRange(e.target.value)} aria-label="Date range">
          <option value="7d">Last 7 days</option><option value="30d">Last 30 days</option><option value="month">This month</option>
        </select>}>AdSense earnings</PageTitle>
      <Notice error={error ? errorMessage(error) : ''} />
      {data && !data.configured && (
        <Card className="max-w-2xl p-6">
          <h2 className="font-serif text-xl font-bold">Connect your AdSense account</h2>
          <p className="mt-2 text-mute">Add your AdSense account ID and Google credentials to the server <code>.env</code> file, then restart the server. The README has the step-by-step guide under "Connect AdSense".</p>
        </Card>
      )}
      {data?.configured && data.totals && data.days && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <Stat label="Estimated earnings" value={money(data.totals.earnings)} />
            <Stat label="Page views" value={data.totals.pageViews.toLocaleString()} />
            <Stat label="Ad impressions" value={data.totals.impressions.toLocaleString()} />
            <Stat label="Ad clicks" value={data.totals.clicks.toLocaleString()} />
          </div>
          <Card className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 text-mute"><tr><th className="p-3">Date</th><th>Earnings</th><th>Page views</th><th>Impressions</th><th>Clicks</th></tr></thead>
              <tbody>{[...data.days].reverse().map((d) => (
                <tr key={d.date} className="border-b border-slate-100 last:border-0">
                  <td className="p-3">{d.date}</td><td>{money(d.earnings)}</td><td>{d.pageViews}</td><td>{d.impressions}</td><td>{d.clicks}</td></tr>))}</tbody>
            </table>
          </Card>
        </div>
      )}
    </>
  );
}

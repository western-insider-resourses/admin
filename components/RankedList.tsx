import { Card } from '@/components/ui';

interface Props<R> { title: string; rows: R[]; label: keyof R & string; value: keyof R & string; href?: (r: R) => string }

// "Most read stories", "Top pages"... a titled list of label + number
export default function RankedList<R extends object>({ title, rows, label, value, href }: Props<R>) {
  return (
    <Card as="section" className="p-5">
      <h2 className="mb-3 font-serif text-xl font-bold">{title}</h2>
      {rows.length === 0 ? <p className="text-sm text-mute">No data yet.</p> : (
        <ul className="divide-y divide-slate-100">
          {rows.map((r, i) => (
            <li key={i} className="flex items-center justify-between gap-3 py-2 text-sm">
              {href
                ? <a href={href(r)} target="_blank" rel="noopener noreferrer" className="truncate font-semibold hover:text-crimson">{String(r[label])}</a>
                : <span className="truncate font-semibold">{String(r[label])}</span>}
              <span className="shrink-0 text-mute">{Number(r[value]).toLocaleString()}</span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

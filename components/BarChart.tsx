import type { Analytics } from '@/lib/types';

interface Props { rows: Analytics['daily']; field: 'views' | 'clicks'; color: string }

// Tiny dependency-free bar chart for the per-day numbers
export default function BarChart({ rows, field, color }: Props) {
  const max = Math.max(1, ...rows.map((r) => r[field]));
  return (
    <div className="flex h-40 items-end gap-1" role="img" aria-label={`Daily ${field}`}>
      {rows.map((r) => (
        <div key={r.day} className="group relative flex-1">
          <div className={`${color} min-h-[2px] w-full rounded-t`} style={{ height: `${(r[field] / max) * 100}%` }} />
          <span className="pointer-events-none absolute -top-7 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded bg-ink px-2 py-1 text-xs text-white group-hover:block">
            {r.day.slice(5)}: {r[field]}
          </span>
        </div>
      ))}
    </div>
  );
}

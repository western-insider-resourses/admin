import type { ReactNode } from 'react';
import Card from './Card';

export default function Stat({ label, value, sub }: { label: string; value: ReactNode; sub?: string }) {
  return (
    <Card className="p-4">
      <p className="text-sm font-semibold text-mute">{label}</p>
      <p className="mt-1 text-3xl font-extrabold">{value}</p>
      {sub && <p className="text-xs text-mute">{sub}</p>}
    </Card>
  );
}

import type { ReactNode } from 'react';
import Card from './Card';

export default function EmptyState({ children }: { children: ReactNode }) {
  return <Card className="p-10 text-center text-mute">{children}</Card>;
}

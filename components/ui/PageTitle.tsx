import type { ReactNode } from 'react';

export default function PageTitle({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <h1 className="font-serif text-3xl font-extrabold">{children}</h1>{action}
    </div>
  );
}

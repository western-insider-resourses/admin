import type { ReactNode } from 'react';
import AuthGuard from '@/components/AuthGuard';
import Shell from '@/components/Shell';

// Everything inside (dashboard) needs a signed-in admin
export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <AuthGuard><Shell>{children}</Shell></AuthGuard>;
}

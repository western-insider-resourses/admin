'use client';
import { useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthSession } from '@/hooks/api/useAuth';
import { getErrorMessage } from '@/services/Client';
import { Notice } from '@/components/ui';

export default function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { data: authenticated, error } = useAuthSession();

  useEffect(() => {
    if (authenticated === null) router.replace('/login');
  }, [authenticated, router]);

  if (error) return <div className="p-6"><Notice error={getErrorMessage(error)} /></div>;
  return authenticated ? <>{children}</> : null;
}

'use client';
import { useEffect, useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { checkSession } from '@/lib/auth';

// Renders its children only when the API confirms the HttpOnly session cookie.
export default function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let active = true;
    void checkSession().then((authenticated) => {
      if (!active) return;
      if (authenticated) setReady(true);
      else router.replace('/login');
    });
    return () => { active = false; };
  }, [router]);
  return ready ? <>{children}</> : null;
}

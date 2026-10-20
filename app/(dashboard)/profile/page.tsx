'use client';

import { useAuthSession } from '@/hooks/api/useAuth';
import { getProfileInitials, getProfileName } from '@/lib/profile';
import { Card, PageTitle } from '@/components/ui';

export default function ProfilePage() {
  const { data: session } = useAuthSession();
  const email = session?.email ?? 'Admin account';

  return (
    <>
      <PageTitle>Profile</PageTitle>
      <p className="mb-6 max-w-2xl text-sm leading-6 text-slate-600">
        Your administrator account details for Western Insider Resources.
      </p>
      <Card className="max-w-2xl overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-ink via-slate-700 to-slate-500" />
        <div className="px-6 pb-6">
          <div className="-mt-10 flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-white bg-gradient-to-br from-amber-200 to-orange-400 text-2xl font-bold text-ink shadow-md">
            {getProfileInitials(session?.email)}
          </div>
          <h2 className="mt-4 text-xl font-bold text-ink">{getProfileName(session?.email)}</h2>
          <p className="mt-1 text-sm text-slate-500">{email}</p>
          <div className="mt-6 grid gap-4 border-t border-slate-100 pt-5 sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Account type</p>
              <p className="mt-1 text-sm font-semibold text-ink">Administrator</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Sign-in method</p>
              <p className="mt-1 text-sm font-semibold text-ink">Secure admin session</p>
            </div>
          </div>
        </div>
      </Card>
    </>
  );
}

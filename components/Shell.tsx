'use client';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthSession, useLogout } from '@/hooks/api/useAuth';
import { SITE_NAME, SITE_URL } from '@/lib/api';
import { getProfileInitials, getProfileName } from '@/lib/profile';
import whiteLogo from '@/assets/white_logo_transparent.png';

export const NAV: Array<[href: string, label: string]> = [
  ['/', 'Dashboard'], ['/posts', 'Stories'], ['/niches', 'Niches'],
  ['/comments', 'Comments'], ['/ads', 'Ads'], ['/social', 'Social links'], ['/adsense', 'AdSense earnings'],
];

export const isActive = (href: string, pathname: string): boolean => (href === '/' ? pathname === '/' : pathname.startsWith(href));

const itemClass = 'block w-full whitespace-nowrap rounded-lg px-3 py-2 text-left text-sm';

// Sidebar + content frame for every signed-in page
export default function Shell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const { data: session } = useAuthSession();
  const logoutMutation = useLogout();
  const email = session?.email ?? 'Admin account';
  const initials = getProfileInitials(session?.email);

  // Close the profile menu whenever the route changes (adjusting state during render, not in an effect)
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setProfileMenuOpen(false);
  }

  useEffect(() => {
    if (!profileMenuOpen) return;
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!profileMenuRef.current?.contains(event.target as Node)) setProfileMenuOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setProfileMenuOpen(false);
    };
    document.addEventListener('mousedown', closeOnOutsideClick);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('mousedown', closeOnOutsideClick);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [profileMenuOpen]);

  function signOut() {
    setProfileMenuOpen(false);
    logoutMutation.mutate(undefined, {
      onSettled: () => router.replace('/login'),
    });
  }

  return (
    <div className="min-h-screen bg-paper md:flex">
      <aside className="bg-ink text-white md:flex md:min-h-screen md:w-64 md:shrink-0 md:flex-col">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 md:block md:px-4 md:py-5">
          <Link href="/" aria-label={`${SITE_NAME} admin dashboard`} className="inline-flex items-center">
            <Image src={whiteLogo} alt="" width={147} height={111} priority className="h-12 w-auto object-contain" />
            <span className="ml-2 max-w-28 font-serif text-sm font-extrabold leading-tight tracking-wide text-white">
              {SITE_NAME}
            </span>
          </Link>
          <p className="mt-1 hidden pl-1 text-[11px] font-medium uppercase tracking-[0.16em] text-white/45 md:block">Admin workspace</p>
        </div>
        <nav aria-label="Admin" className="flex gap-1 overflow-x-auto px-3 py-3 md:block md:flex-1 md:space-y-1 md:overflow-visible md:px-3">
          {NAV.map(([href, label]) => (
            <Link key={href} href={href} aria-current={isActive(href, pathname) ? 'page' : undefined}
              className={`${itemClass} font-medium transition-colors ${isActive(href, pathname) ? 'bg-white text-ink shadow-sm' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}>
              {label}
            </Link>
          ))}
          <a href={SITE_URL} target="_blank" rel="noopener noreferrer" className={`${itemClass} mt-2 text-white/55 transition-colors hover:bg-white/10 hover:text-white`}>
            View site
            <svg aria-hidden="true" viewBox="0 0 16 16" fill="none" className="ml-1 inline h-3.5 w-3.5">
              <path d="M5 3.5h7.5V11M12.25 3.75 4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </nav>
        <div ref={profileMenuRef} className="relative border-t border-white/10 p-3 md:mt-auto">
          {profileMenuOpen && (
            <div id="admin-profile-menu" role="menu" aria-label="Account menu"
              className="absolute bottom-full left-3 right-3 z-20 mb-2 overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 text-ink shadow-xl shadow-black/20">
              <div className="border-b border-slate-100 px-3 py-2.5">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Signed in as</p>
                <p className="mt-0.5 truncate text-sm font-semibold">{email}</p>
              </div>
              <Link role="menuitem" href="/profile" onClick={() => setProfileMenuOpen(false)}
                className="block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-slate-50 focus:bg-slate-50 focus:outline-none">Profile</Link>

              <div className="my-1 border-t border-slate-100" />
              <button role="menuitem" type="button" disabled={logoutMutation.isPending} onClick={signOut}
                className="block w-full rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-rose-700 transition-colors hover:bg-rose-50 focus:bg-rose-50 focus:outline-none disabled:opacity-60">
                {logoutMutation.isPending ? 'Signing out...' : 'Log out'}
              </button>
            </div>
          )}
          <button type="button" aria-label={`Open profile menu for ${email}`} aria-haspopup="menu"
            aria-expanded={profileMenuOpen} aria-controls="admin-profile-menu"
            onClick={() => setProfileMenuOpen((open) => !open)}
            className="flex w-full items-center gap-3 rounded-xl p-2 text-left transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60">
            <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-200 to-orange-400 text-sm font-bold text-ink ring-2 ring-white/15">
              {initials}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold text-white">{getProfileName(session?.email)}</span>
              <span className="block truncate text-xs text-white/55">{email}</span>
            </span>
            <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className={`h-4 w-4 shrink-0 text-white/55 transition-transform ${profileMenuOpen ? 'rotate-180' : ''}`}>
              <path fillRule="evenodd" d="M5.22 7.47a.75.75 0 0 1 1.06 0L10 11.19l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 8.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </aside>
      <main className="min-w-0 flex-1 p-4 md:p-8">{children}</main>
    </div>
  );
}
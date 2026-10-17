'use client';
import type { ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { logout } from '@/lib/auth';
import { SITE_NAME, SITE_URL } from '@/lib/api';
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
  return (
    <div className="min-h-screen bg-paper md:flex">
      <aside className="bg-ink text-white md:w-60 md:shrink-0">
        <div className="flex items-center justify-between px-5 py-4 md:block">
          <Link href="/" aria-label={`${SITE_NAME} admin dashboard`} className="inline-flex items-center">
            <Image src={whiteLogo} alt="" width={147} height={111} priority className="h-14 w-auto object-contain" />
            <span className="ml-2 max-w-28 font-serif text-sm font-extrabold leading-tight text-white">
              {SITE_NAME}
            </span>
          </Link>
          <p className="text-xs text-white/60">Admin</p>
        </div>
        <nav aria-label="Admin" className="flex gap-1 overflow-x-auto px-3 pb-3 md:block md:space-y-1">
          {NAV.map(([href, label]) => (
            <Link key={href} href={href} aria-current={isActive(href, pathname) ? 'page' : undefined}
              className={`${itemClass} font-semibold ${isActive(href, pathname) ? 'bg-white text-ink' : 'text-white/80 hover:bg-white/10'}`}>
              {label}
            </Link>
          ))}
          <a href={SITE_URL} target="_blank" rel="noopener noreferrer" className={`${itemClass} text-white/70 hover:bg-white/10`}>View site</a>
          <button className={`${itemClass} text-white/70 hover:bg-white/10`} onClick={() => { void logout().then(() => router.replace('/login'), () => router.replace('/login')); }}>Sign out</button>
        </nav>
      </aside>
      <main className="min-w-0 flex-1 p-4 md:p-8">{children}</main>
    </div>
  );
}

import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Playfair_Display, Inter } from 'next/font/google';
import './globals.css';
import { SITE_NAME } from '@/lib/api';
import QueryProvider from '@/components/QueryProvider';

const serif = Playfair_Display({ subsets: ['latin'], variable: '--font-serif', weight: ['600', '700', '800'] });
const sans = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: { default: `${SITE_NAME} Admin`, template: `%s | ${SITE_NAME} Admin` },
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body><QueryProvider>{children}</QueryProvider></body>
    </html>
  );
}

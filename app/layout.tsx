import type { Metadata } from "next";
import type { ReactNode } from "react";
import localFont from "next/font/local";
import "./globals.css";
import { SITE_NAME } from "@/lib/api";
import QueryProvider from "@/components/QueryProvider";

const serif = localFont({
  src: "../node_modules/@fontsource-variable/playfair-display/files/playfair-display-latin-wght-normal.woff2",
  variable: "--font-serif",
  weight: "400 900",
  display: "swap",
});

const sans = localFont({
  src: "../node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2",
  variable: "--font-sans",
  weight: "100 900",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: `${SITE_NAME} Admin`, template: `%s | ${SITE_NAME} Admin` },
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}

import React from 'react';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import '@/app/globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

export const metadata = {
  title: {
    default: 'Miaouflix : des films pour dodo',
    template: '%s | Miaouflix',
  },
  description: "Le site parfait pour regarder un film avant de s'endormir !",
  robots: {
    index: false,
    follow: false,
  },
  colorScheme: 'dark',
  generator: 'Next.js',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={inter.variable}>
      {process.env.NODE_ENV === 'production' && (
        <Script
          data-website-id="92cc1168-863c-45f6-a0ec-ab13c9543099"
          src="https://umami.gregory-gerard.dev:81/630abdb504d2a.js"
        />
      )}

      <body className="min-h-full overflow-x-hidden bg-neutral-950 text-neutral-50">
        <main>{children}</main>
      </body>
    </html>
  );
}

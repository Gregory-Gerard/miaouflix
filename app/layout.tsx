import React from 'react';
import { Inter } from 'next/font/google';
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
      <body className="min-h-full overflow-x-hidden bg-neutral-950 text-neutral-50">
        <main>{children}</main>
      </body>
    </html>
  );
}

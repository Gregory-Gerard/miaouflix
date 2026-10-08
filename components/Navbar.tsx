'use client';

import Image from 'next/image';
import logo from '@/public/miaouflix.png';
import React, { useSyncExternalStore } from 'react';
import Link from 'next/link';
import { ClockIcon } from '@heroicons/react/20/solid';

const subscribe = (onScroll: () => void) => {
  document.addEventListener('scroll', onScroll);

  return () => document.removeEventListener('scroll', onScroll);
};

const getHasScrolled = () => (document.scrollingElement?.scrollTop ?? 0) > 20;
const getServerHasScrolled = () => false;

export default function Navbar() {
  const hasScrolled = useSyncExternalStore(subscribe, getHasScrolled, getServerHasScrolled);

  return (
    <nav
      className={`fixed z-20 w-full bg-linear-to-b from-neutral-950/70 py-4 ${
        hasScrolled ? 'bg-neutral-900' : ''
      } transition-colors duration-500`}
    >
      <div className="container flex items-center justify-between">
        <Link href="/">
          <Image src={logo} alt="Logo Miaouflix" className="w-32" />
        </Link>

        <Link href={'/history'} className="text-white/60 transition-colors hover:text-white" title="Historique">
          <ClockIcon className="h-6 w-6" />
        </Link>
      </div>
    </nav>
  );
}

'use client';

import Image from 'next/image';
import logo from '@/public/miaouflix.png';
import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { ClockIcon } from '@heroicons/react/20/solid';

export default function Navbar() {
  const [hasScrolled, setHasScrolled] = useState<boolean>(false);
  const onScroll = useCallback(() => {
    if (
      document.scrollingElement?.scrollTop &&
      // if scrolled more than 20px (arbitrary value)
      document.scrollingElement?.scrollTop > 20
    ) {
      setHasScrolled(true);
    } else {
      setHasScrolled(false);
    }
  }, []);

  // Side effect to check if user has scrolled
  useEffect(() => {
    document.addEventListener('scroll', onScroll);

    return () => document.removeEventListener('scroll', onScroll);
  }, [onScroll]);

  // Execute side effect once on render
  useEffect(() => {
    onScroll();
  }, [onScroll]);

  return (
    <nav
      className={`fixed z-20 w-full bg-gradient-to-b from-neutral-900/70 py-4 ${
        hasScrolled ? 'bg-neutral-800' : ''
      } transition-colors duration-500`}
    >
      <div className="container flex items-center justify-between">
        <Image src={logo} alt="Logo Miaouflix" className="w-32" />
        <Link
          href={'/history'}
          className="text-white/60 transition-colors hover:text-white"
          title="Historique"
        >
          <ClockIcon className="h-6 w-6" />
        </Link>
      </div>
    </nav>
  );
}

'use client';

import { useEffect } from 'react';

import { useTheme } from 'next-themes';

import { CHARTER } from '@/lib/brand/charter';

// the browser's own chrome follows the appearance zeboo is in and not the device's, the two disagreeing by design: a phone set to dark still gets the ivory page until somebody picks otherwise
export function ThemeColour() {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const meta = document.querySelector('meta[name="theme-color"]');

    meta?.setAttribute(
      'content',
      resolvedTheme === 'dark' ? CHARTER.night : CHARTER.ivory,
    );
  }, [resolvedTheme]);

  return null;
}

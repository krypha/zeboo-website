'use client';

import type { ReactNode } from 'react';

import { ThemeProvider } from 'next-themes';

import { ThemeColour } from '@/components/theme-colour';

// the appearance is the only state this site keeps, light until somebody picks otherwise; storage is per origin, so the site and the app each remember their own under the same key
export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
      storageKey="zeboo.appearance"
    >
      {children}
      <ThemeColour />
    </ThemeProvider>
  );
}

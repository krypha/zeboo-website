'use client';

import { useTranslations } from 'next-intl';

// the header holds sixteen stops, so a keyboard reaches the page itself in one; it shows only once focused, which is the one state it exists for
export function SkipLink() {
  const t = useTranslations('nav');

  return (
    <a
      href="#contenu"
      className="bg-primary text-primary-foreground focus-visible:ring-ring sr-only font-sans text-sm font-medium focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-xl focus:px-4 focus:py-2.5 focus-visible:ring-2 focus-visible:outline-none"
    >
      {t('skip')}
    </a>
  );
}

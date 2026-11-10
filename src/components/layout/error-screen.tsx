'use client';

import { useEffect } from 'react';

import { useTranslations } from 'next-intl';

import { ZebooIcon } from '@/components/icons/zeboo-icons';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';

// the one screen a traveller sees when a render gave way; without it next shows its own, which in production is the bare words application error
export function ErrorScreen({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations('error');

  // the digest is what ties this screen to a line in the server log, and nothing else here can reach it
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col items-start gap-5 px-4 py-20">
      <ZebooIcon name="warning" className="text-itinerary size-8" />

      <h1 className="font-heading text-2xl font-semibold tracking-tight">
        {t('title')}
      </h1>

      <p className="text-muted-foreground font-sans text-sm leading-relaxed">
        {t('body')}
      </p>

      <div className="flex flex-wrap gap-3">
        <Button onClick={reset}>{t('retry')}</Button>

        <Button variant="outline" asChild>
          <Link href="/">{t('home')}</Link>
        </Button>
      </div>

      {error.digest && (
        <p className="text-muted-foreground font-sans text-xs">
          {t('reference', { digest: error.digest })}
        </p>
      )}
    </div>
  );
}

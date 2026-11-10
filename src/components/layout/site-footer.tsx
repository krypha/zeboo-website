import { getLocale, getTranslations } from 'next-intl/server';

import { Link } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { cn } from '@/lib/utils';

import { Brand } from './brand';

export async function SiteFooter() {
  const t = await getTranslations('footer');
  const tLocale = await getTranslations('locale');
  const current = await getLocale();

  // the switcher in the header is a menu a crawler never opens, so each language is also a plain link here, which is what lets a robot reach the other version from this one
  return (
    <footer className="border-border bg-secondary/40 border-t">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2">
          <Brand />
          <p className="text-muted-foreground font-sans text-sm">
            {t('mantra')}
          </p>
        </div>

        <div className="flex flex-col items-start gap-3 sm:items-end">
          <nav aria-label={t('languages')} className="flex items-center gap-4">
            {routing.locales.map((locale) => (
              <Link
                key={locale}
                href="/"
                locale={locale}
                hrefLang={locale}
                lang={locale}
                aria-current={locale === current ? 'page' : undefined}
                className={cn(
                  'font-sans text-xs font-medium transition-colors',
                  locale === current
                    ? 'text-foreground'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {tLocale(locale)}
              </Link>
            ))}
          </nav>

          <p className="text-muted-foreground font-sans text-xs">
            {t('rights')}
          </p>
        </div>
      </div>
    </footer>
  );
}

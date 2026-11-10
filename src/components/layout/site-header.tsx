import { getLocale, getTranslations } from 'next-intl/server';

import { AppearanceToggle } from '@/components/appearance-toggle';
import { Button } from '@/components/ui/button';
import { appLink } from '@/lib/app-link';

import { Brand } from './brand';
import { LocaleSwitcher } from './locale-switcher';

const ANCHORS = ['budget', 'compose', 'discover', 'questions'] as const;

// the public header, which carries the two doors the landing exists to open; the session lives in an httponly cookie on the app's own origin, out of this site's reach, so both doors are always drawn and the app decides what an account already signed in sees
export async function SiteHeader() {
  const t = await getTranslations('nav');
  const locale = await getLocale();

  return (
    <header className="border-border bg-background/85 sticky top-0 z-40 border-b backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Brand wordClassName="hidden sm:inline" />

        <nav className="hidden items-center gap-6 md:flex">
          {ANCHORS.map((anchor) => (
            <a
              key={anchor}
              href={`#${anchor}`}
              className="text-muted-foreground hover:text-foreground font-sans text-sm font-medium transition-colors"
            >
              {t(anchor)}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          <LocaleSwitcher />
          <AppearanceToggle />

          {/* under three hundred and ninety points the four controls and the two doors do not fit together, and signing up is the door a visitor needs; signing in stays one tap away from there */}
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="max-[389px]:hidden"
          >
            <a href={appLink(locale, '/login')}>{t('login')}</a>
          </Button>

          <Button size="sm" asChild>
            <a href={appLink(locale, '/register')}>{t('register')}</a>
          </Button>
        </div>
      </div>
    </header>
  );
}

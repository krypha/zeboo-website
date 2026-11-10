import type { Metadata, Viewport } from 'next';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { Bricolage_Grotesque, Figtree } from 'next/font/google';
import { notFound } from 'next/navigation';

import { SiteFooter } from '@/components/layout/site-footer';
import { SiteHeader } from '@/components/layout/site-header';
import { SkipLink } from '@/components/layout/skip-link';
import { Providers } from '@/components/providers';
import { env } from '@/config/env';
import { routing } from '@/i18n/routing';
import { CHARTER } from '@/lib/brand/charter';
import { cn } from '@/lib/utils';

import '../globals.css';

// next/font downloads both families at build time and serves them from this origin, so a visit asks google for nothing
const headingFont = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-bricolage',
  weight: ['600', '800'],
});

const bodyFont = Figtree({
  subsets: ['latin'],
  variable: '--font-figtree',
  weight: ['400', '500'],
});

// what every page shares; the landing adds its own title, description, alternates and cards, and the shallow merge keeps the rest
export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
  title: { default: 'Zeboo', template: '%s · Zeboo' },
  applicationName: 'Zeboo',
  creator: 'Krypha LTD',
  category: 'travel',
  // safari on a phone reads 615 936 as a telephone number and turns the budget into a link to dial
  formatDetection: { telephone: false, email: false, address: false },
  ...(env.GOOGLE_SITE_VERIFICATION && {
    verification: { google: env.GOOGLE_SITE_VERIFICATION },
  }),
};

// the ivory of the default appearance, which ThemeColour then follows when a visitor picks the dark one
export const viewport: Viewport = { themeColor: CHARTER.ivory };

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<'/[locale]'>) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // without this next-intl reads the locale off the request headers, which opts every page under here into dynamic rendering
  setRequestLocale(locale);

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={cn('font-sans', headingFont.variable, bodyFont.variable)}
    >
      <body className="bg-background text-foreground antialiased">
        <NextIntlClientProvider>
          <Providers>
            <div className="flex min-h-dvh flex-col">
              <SkipLink />
              <SiteHeader />
              <main id="contenu" className="flex-1">
                {children}
              </main>
              <SiteFooter />
            </div>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

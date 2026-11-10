import { routing, type Locale } from '@/i18n/routing';

// each language version names every other one and a default, which is what hreflang asks for; the head and the sitemap both read this, so the two can never disagree
export function languageAlternates(base = ''): Record<string, string> {
  return {
    ...Object.fromEntries(
      routing.locales.map((locale) => [locale, `${base}/${locale}`]),
    ),
    'x-default': `${base}/${routing.defaultLocale}`,
  };
}

// open graph spells a locale with a territory and an underscore, and the facebook list it is checked against has no malagasy french
export const OPEN_GRAPH_LOCALE: Record<Locale, string> = {
  fr: 'fr_FR',
  en: 'en_US',
};

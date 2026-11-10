import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['fr', 'en'],
  defaultLocale: 'fr',
  // every url carries its locale, so the url is the only thing that decides which one
  localePrefix: 'always',
  // french for everybody who arrives without saying otherwise: neither accept-language nor a stored cookie gets to choose, and the switcher in the header is how a traveller changes it
  localeDetection: false,
});

export type Locale = (typeof routing.locales)[number];

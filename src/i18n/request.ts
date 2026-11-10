import { hasLocale } from 'next-intl';
import { getRequestConfig } from 'next-intl/server';

import { routing } from './routing';

// a locale handed over explicitly wins, and must: the shared image's metadata is computed at build time, where reading the segment off the request headers is refused outright
export default getRequestConfig(async ({ locale: explicit, requestLocale }) => {
  const requested = explicit ?? (await requestLocale);
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    messages: (
      (await import(`../messages/${locale}.json`)) as {
        default: Record<string, unknown>;
      }
    ).default,
  };
});

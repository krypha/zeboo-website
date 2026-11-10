import type { MetadataRoute } from 'next';

import { env } from '@/config/env';
import { routing } from '@/i18n/routing';
import { languageAlternates } from '@/lib/seo/alternates';

// the landing in each language is the whole site; the sitemap is built with the pages, so its date is the build's and moves only when the site does
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return routing.locales.map((locale) => ({
    url: `${env.NEXT_PUBLIC_SITE_URL}/${locale}`,
    lastModified,
    alternates: {
      languages: languageAlternates(env.NEXT_PUBLIC_SITE_URL),
    },
  }));
}

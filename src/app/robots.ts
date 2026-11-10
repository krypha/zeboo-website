import type { MetadataRoute } from 'next';

import { env } from '@/config/env';

// every page of this site is public and meant to be found, so nothing is kept from a crawler; the app, which is the private side, answers for itself on its own origin
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${env.NEXT_PUBLIC_SITE_URL}/sitemap.xml`,
    host: env.NEXT_PUBLIC_SITE_URL,
  };
}

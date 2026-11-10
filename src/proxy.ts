import createMiddleware from 'next-intl/middleware';

import { routing } from '@/i18n/routing';

// next 16 renamed middleware.ts to proxy.ts; nothing on this site is guarded, so the only thing it does is send a bare path to its french version
export default createMiddleware(routing);

export const config = {
  // a path with a dot is a file (the apk, the sitemap, an icon) and is served as it is, never prefixed with a locale
  matcher: ['/((?!_next|_vercel|.*\\..*).*)'],
};

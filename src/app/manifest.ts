import type { MetadataRoute } from 'next';

import { CHARTER } from '@/lib/brand/charter';

// what a browser reads when the site is kept on a home screen; it opens as a page and not as an app, the app being app.zeboo.mg and the phone build, and the locale is always in the url, so the start is the default one rather than a root that only redirects
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Zeboo',
    short_name: 'Zeboo',
    description:
      'Composez votre voyage à Madagascar et voyez le budget suivre, au total et par personne.',
    lang: 'fr',
    start_url: '/fr',
    display: 'browser',
    background_color: CHARTER.ivory,
    theme_color: CHARTER.green,
    icons: [
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' },
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  };
}

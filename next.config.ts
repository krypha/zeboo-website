import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

// imported for its side effect: a missing env variable fails the build here
import './src/config/env';

// every response carries these: a public site is read by anybody, so it says what it may be framed by, sniffed as and sent to; https is required of this host alone, extending it to every subdomain or to the browsers' preload list binding app, api and wip for two years, which is the team's call
const SECURITY_HEADERS = [
  { key: 'Strict-Transport-Security', value: 'max-age=63072000' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
];

const nextConfig: NextConfig = {
  typedRoutes: true,
  poweredByHeader: false,
  // the docker image runs the traced server alone, without the project's node_modules; only its build asks for that, next start warning that it does not serve a standalone build
  output: process.env.BUILD_STANDALONE === '1' ? 'standalone' : undefined,

  headers() {
    return Promise.resolve([
      { source: '/:path*', headers: SECURITY_HEADERS },
      // an apk is not something a browser can render, and naming its type plainly is what makes every browser save it rather than guess
      {
        source: '/app/zeboo.apk',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/vnd.android.package-archive',
          },
          {
            key: 'Content-Disposition',
            value: 'attachment; filename="zeboo.apk"',
          },
        ],
      },
    ]);
  },
};

// auto-detects src/i18n/request.ts
const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);

import { defineConfig, devices } from '@playwright/test';

import { APP_URL, PORT, SITE_URL } from './test/support/origins';

const baseURL = SITE_URL;

export default defineConfig({
  testDir: './test',
  testMatch: '**/*.e2e-spec.ts',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI
    ? [['list'], ['junit', { outputFile: 'junit-e2e.xml' }]]
    : 'list',

  use: {
    baseURL,
    trace: 'on-first-retry',
  },

  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],

  // a production build, since what a crawler reads is the prerendered page and not the dev server's
  webServer: {
    command: `pnpm build && pnpm exec next start -p ${PORT}`,
    url: baseURL,
    reuseExistingServer: false,
    timeout: 180_000,
    env: {
      NEXT_PUBLIC_SITE_URL: SITE_URL,
      NEXT_PUBLIC_APP_URL: APP_URL,
    },
  },
});

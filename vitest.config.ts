import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],

  // vite 8 resolves tsconfig paths natively, the @/* alias included
  resolve: { tsconfigPaths: true },
  test: {
    globals: true,
    environment: 'jsdom',
    root: './',
    setupFiles: ['./src/test/setup.ts'],
    // src/ only, so the playwright specs in test/ are never collected here
    include: ['src/**/*.spec.{ts,tsx}'],

    // vitest does not read next's .env files, so pass the variables here
    env: {
      NEXT_PUBLIC_SITE_URL: 'http://localhost:3003',
      NEXT_PUBLIC_APP_URL: 'http://localhost:3001',
    },
  },
});

import { z } from 'zod';

// both are joined to a path by the code, so a trailing slash or a path segment would double one: a bare origin is the only acceptable form; zod runs the refine even after the url check failed, and new url throws on what it cannot parse, hence url.canparse first
const bareOrigin = z
  .url()
  .refine((value) => URL.canParse(value) && new URL(value).pathname === '/', {
    message: 'must be a bare origin, without a path',
  })
  .transform((value) => value.replace(/\/$/, ''));

export const envSchema = z.object({
  // where this site is served, which every canonical url, hreflang and sitemap entry is built on
  NEXT_PUBLIC_SITE_URL: bareOrigin,
  // the web app the doors open onto: signing in, signing up
  NEXT_PUBLIC_APP_URL: bareOrigin,
  // the token search console asks to find in the head, absent until somebody claims the domain; an empty line in .env says the same as no line at all
  GOOGLE_SITE_VERIFICATION: z
    .string()
    .optional()
    .transform((value) => (value === '' ? undefined : value)),
});

export type Env = z.infer<typeof envSchema>;

// next only inlines literal process.env reads, so pass the keys explicitly
export const env: Env = envSchema.parse({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  GOOGLE_SITE_VERIFICATION: process.env.GOOGLE_SITE_VERIFICATION,
});

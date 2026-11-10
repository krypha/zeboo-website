import { env } from '@/config/env';

// the doors open onto the web app, which is another origin, so they are plain urls carrying the visitor's locale rather than routes of this site
export type AppDoor = '/login' | '/register';

export function appLink(locale: string, door: AppDoor): string {
  return `${env.NEXT_PUBLIC_APP_URL}/${locale}${door}`;
}

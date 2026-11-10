import { envSchema } from './env';

const APP_URL = 'https://app.zeboo.mg';

function parseSiteUrl(value: string) {
  return envSchema.safeParse({
    NEXT_PUBLIC_SITE_URL: value,
    NEXT_PUBLIC_APP_URL: APP_URL,
  });
}

describe('envSchema', () => {
  it('accepts a bare origin', () => {
    const result = parseSiteUrl('https://zeboo.mg');

    expect(result.success).toBe(true);
    expect(result.data?.NEXT_PUBLIC_SITE_URL).toBe('https://zeboo.mg');
  });

  it('normalises a trailing slash away', () => {
    const result = parseSiteUrl('https://zeboo.mg/');

    expect(result.data?.NEXT_PUBLIC_SITE_URL).toBe('https://zeboo.mg');
  });

  // a canonical url built on a base with a path would point every crawler at a page that does not exist
  it('rejects a base carrying a path', () => {
    const result = parseSiteUrl('https://zeboo.mg/fr');

    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe(
      'must be a bare origin, without a path',
    );
  });

  it('rejects a value that is not a url', () => {
    expect(parseSiteUrl('zeboo.mg').success).toBe(false);
  });

  it('holds the doors to a bare origin as well', () => {
    const result = envSchema.safeParse({
      NEXT_PUBLIC_SITE_URL: 'https://zeboo.mg',
      NEXT_PUBLIC_APP_URL: 'https://app.zeboo.mg/fr',
    });

    expect(result.success).toBe(false);
  });

  it('leaves the search console token optional', () => {
    expect(
      parseSiteUrl('https://zeboo.mg').data?.GOOGLE_SITE_VERIFICATION,
    ).toBe(undefined);
  });

  // .env.example ships the key with nothing after it, and an empty verification tag in the head would be worse than none
  it('reads an empty token as no token', () => {
    const result = envSchema.safeParse({
      NEXT_PUBLIC_SITE_URL: 'https://zeboo.mg',
      NEXT_PUBLIC_APP_URL: APP_URL,
      GOOGLE_SITE_VERIFICATION: '',
    });

    expect(result.success).toBe(true);
    expect(result.data?.GOOGLE_SITE_VERIFICATION).toBe(undefined);
  });
});

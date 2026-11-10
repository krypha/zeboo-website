import { appLink } from './app-link';

describe('appLink', () => {
  // vitest.config.ts sets the app origin, the same bare form env.ts enforces
  it('opens the door on the web app, in the visitor’s locale', () => {
    expect(appLink('fr', '/register')).toBe(
      'http://localhost:3001/fr/register',
    );
    expect(appLink('en', '/login')).toBe('http://localhost:3001/en/login');
  });
});

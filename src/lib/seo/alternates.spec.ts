import { languageAlternates } from './alternates';

describe('languageAlternates', () => {
  it('names both languages and sends the default to french', () => {
    expect(languageAlternates()).toEqual({
      fr: '/fr',
      en: '/en',
      'x-default': '/fr',
    });
  });

  it('builds absolute urls for the sitemap', () => {
    expect(languageAlternates('https://zeboo.mg')).toEqual({
      fr: 'https://zeboo.mg/fr',
      en: 'https://zeboo.mg/en',
      'x-default': 'https://zeboo.mg/fr',
    });
  });
});

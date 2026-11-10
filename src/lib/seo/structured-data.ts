import { routing } from '@/i18n/routing';

export interface Faq {
  question: string;
  answer: string;
}

interface LandingFacts {
  site: string;
  locale: string;
  title: string;
  description: string;
  faq: readonly Faq[];
}

// one graph per page, every node naming the others by @id, so a crawler reads one organisation behind one site rather than five strangers; nothing here states a price, the page itself never giving a firm one
export function landingGraph({
  site,
  locale,
  title,
  description,
  faq,
}: LandingFacts) {
  const page = `${site}/${locale}`;
  const organisation = `${site}/#organisation`;
  const website = `${site}/#website`;
  const application = `${site}/#application`;

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': organisation,
        name: 'Zeboo',
        url: site,
        logo: {
          '@type': 'ImageObject',
          url: `${site}/brand/logo/icon.png`,
          width: 1024,
          height: 1024,
        },
      },
      {
        '@type': 'WebSite',
        '@id': website,
        name: 'Zeboo',
        url: site,
        inLanguage: [...routing.locales],
        publisher: { '@id': organisation },
      },
      {
        '@type': 'WebPage',
        '@id': `${page}#page`,
        url: page,
        name: title,
        description,
        inLanguage: locale,
        isPartOf: { '@id': website },
        about: { '@id': application },
      },
      {
        '@type': 'SoftwareApplication',
        '@id': application,
        name: 'Zeboo',
        description,
        applicationCategory: 'TravelApplication',
        operatingSystem: 'Web, Android',
        inLanguage: [...routing.locales],
        publisher: { '@id': organisation },
        // the platform was designed and built by its technology partner, which is what creator says and all it says
        creator: { '@type': 'Organization', name: 'Krypha LTD' },
      },
      {
        '@type': 'FAQPage',
        '@id': `${page}#questions`,
        inLanguage: locale,
        mainEntity: faq.map(({ question, answer }) => ({
          '@type': 'Question',
          name: question,
          acceptedAnswer: { '@type': 'Answer', text: answer },
        })),
      },
    ],
  };
}

// json.stringify leaves a closing script tag intact, so every angle bracket is escaped the way the next guide on json-ld asks
export function serialiseGraph(graph: object): string {
  return JSON.stringify(graph).replace(/</g, '\\u003c');
}

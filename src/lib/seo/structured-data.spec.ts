import { landingGraph, serialiseGraph } from './structured-data';

const FACTS = {
  site: 'https://zeboo.mg',
  locale: 'fr',
  title: 'Composez votre voyage à Madagascar, le budget suit',
  description: 'Le budget se recalcule à chaque choix.',
  faq: [
    { question: 'Les prix affichés sont-ils fermes ?', answer: 'Non.' },
    { question: 'Et sur iPhone ?', answer: 'L’iPhone suit.' },
  ],
};

type Node = Record<string, unknown> & { '@type': string; '@id'?: string };

function nodes(): Node[] {
  return landingGraph(FACTS)['@graph'];
}

function node(type: string): Node {
  const found = nodes().find((one) => one['@type'] === type);
  if (!found) throw new Error(`no ${type} in the graph`);

  return found;
}

describe('landingGraph', () => {
  it('describes the organisation, the site, the page, the application and the questions', () => {
    expect(nodes().map((one) => one['@type'])).toEqual([
      'Organization',
      'WebSite',
      'WebPage',
      'SoftwareApplication',
      'FAQPage',
    ]);
  });

  // a reference that resolves to nothing is a graph of strangers
  it('names every node it points at', () => {
    const ids = new Set(nodes().map((one) => one['@id']));
    const references = JSON.stringify(landingGraph(FACTS)).match(
      /\{"@id":"[^"]+"\}/g,
    );

    expect(references?.length).toBeGreaterThan(0);
    for (const reference of references ?? []) {
      expect(ids).toContain(
        (JSON.parse(reference) as { '@id': string })['@id'],
      );
    }
  });

  it('places the page at its own locale', () => {
    expect(node('WebPage')).toMatchObject({
      url: 'https://zeboo.mg/fr',
      inLanguage: 'fr',
      name: FACTS.title,
    });
  });

  it('turns every visible question into a question with its answer', () => {
    expect(node('FAQPage').mainEntity).toEqual([
      {
        '@type': 'Question',
        name: 'Les prix affichés sont-ils fermes ?',
        acceptedAnswer: { '@type': 'Answer', text: 'Non.' },
      },
      {
        '@type': 'Question',
        name: 'Et sur iPhone ?',
        acceptedAnswer: { '@type': 'Answer', text: 'L’iPhone suit.' },
      },
    ]);
  });

  // prices are indicative brackets, so the graph must never be the one place a firm amount appears
  it('states no price anywhere', () => {
    expect(JSON.stringify(landingGraph(FACTS))).not.toMatch(/"offers"|"price"/);
  });
});

describe('serialiseGraph', () => {
  it('cannot close the script tag it is written into', () => {
    const written = serialiseGraph({
      text: '</script><script>alert(1)</script>',
    });

    expect(written).not.toContain('<');
    expect(JSON.parse(written)).toEqual({
      text: '</script><script>alert(1)</script>',
    });
  });
});

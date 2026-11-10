import { expect, test, type Page } from '@playwright/test';

import { SITE_URL } from './support/origins';

const PAGES = [
  {
    locale: 'fr',
    title: 'Composez votre voyage à Madagascar, le budget suit · Zeboo',
    description: /^Composez votre itinéraire à Madagascar, étape par étape/,
    ogLocale: 'fr_FR',
    ogAlternate: 'en_US',
  },
  {
    locale: 'en',
    title: 'Plan your trip to Madagascar, the budget follows · Zeboo',
    description: /^Build your Madagascar itinerary stop by stop/,
    ogLocale: 'en_US',
    ogAlternate: 'fr_FR',
  },
] as const;

async function meta(page: Page, selector: string): Promise<string | null> {
  return page.locator(selector).first().getAttribute('content');
}

// the width and height a png declares in its first chunk, which is what a network reads before laying the card out
function pngSize(bytes: Buffer): { width: number; height: number } {
  return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
}

for (const one of PAGES) {
  test.describe(`la page /${one.locale}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`/${one.locale}`);
    });

    test('porte un seul titre de premier niveau et sa langue', async ({
      page,
    }) => {
      await expect(page.locator('h1')).toHaveCount(1);
      await expect(page.locator('html')).toHaveAttribute('lang', one.locale);
    });

    test('se présente par son titre et sa description', async ({ page }) => {
      await expect(page).toHaveTitle(one.title);
      expect(await meta(page, 'meta[name="description"]')).toMatch(
        one.description,
      );
    });

    // one canonical per language, each naming the other and a default, so the two versions are read as one page in two languages and not as duplicates
    test('nomme sa canonique et ses autres langues', async ({ page }) => {
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        'href',
        `${SITE_URL}/${one.locale}`,
      );

      for (const [hreflang, path] of [
        ['fr', '/fr'],
        ['en', '/en'],
        ['x-default', '/fr'],
      ]) {
        await expect(
          page.locator(`link[rel="alternate"][hreflang="${hreflang}"]`),
        ).toHaveAttribute('href', `${SITE_URL}${path}`);
      }
    });

    test('se laisse indexer, image comprise', async ({ page }) => {
      expect(await meta(page, 'meta[name="robots"]')).toBe('index, follow');
      expect(await meta(page, 'meta[name="googlebot"]')).toContain(
        'max-image-preview:large',
      );
    });

    // the card a link becomes once it is pasted into a message or a post
    test('décrit sa carte de partage', async ({ page }) => {
      const image = `${SITE_URL}/${one.locale}/og.png`;

      expect(await meta(page, 'meta[property="og:type"]')).toBe('website');
      expect(await meta(page, 'meta[property="og:site_name"]')).toBe('Zeboo');
      expect(await meta(page, 'meta[property="og:url"]')).toBe(
        `${SITE_URL}/${one.locale}`,
      );
      expect(await meta(page, 'meta[property="og:locale"]')).toBe(one.ogLocale);
      expect(await meta(page, 'meta[property="og:locale:alternate"]')).toBe(
        one.ogAlternate,
      );
      expect(await meta(page, 'meta[property="og:title"]')).toBe(
        one.title.replace(' · Zeboo', ''),
      );
      expect(await meta(page, 'meta[property="og:image"]')).toBe(image);
      expect(await meta(page, 'meta[property="og:image:width"]')).toBe('1200');
      expect(await meta(page, 'meta[property="og:image:height"]')).toBe('630');
      expect(await meta(page, 'meta[property="og:image:alt"]')).toMatch(
        /^Zeboo\. /,
      );
      expect(await meta(page, 'meta[name="twitter:card"]')).toBe(
        'summary_large_image',
      );
      expect(await meta(page, 'meta[name="twitter:image"]')).toBe(image);
    });

    test('sert une image de partage de 1200 sur 630', async ({ page }) => {
      const answer = await page.request.get(`/${one.locale}/og.png`);

      expect(answer.status()).toBe(200);
      expect(answer.headers()['content-type']).toBe('image/png');
      expect(pngSize(await answer.body())).toEqual({
        width: 1200,
        height: 630,
      });
    });

    // the structured answers must be the visible ones word for word, or a search engine would be told something the page does not say
    test('décrit le produit et ses questions en données structurées', async ({
      page,
    }) => {
      const raw = await page
        .locator('script[type="application/ld+json"]')
        .textContent();
      const graph = JSON.parse(raw ?? '{}') as {
        '@graph': {
          '@type': string;
          mainEntity?: {
            name: string;
            acceptedAnswer: { text: string };
          }[];
        }[];
      };

      expect(graph['@graph'].map((node) => node['@type'])).toEqual([
        'Organization',
        'WebSite',
        'WebPage',
        'SoftwareApplication',
        'FAQPage',
      ]);
      expect(raw).not.toMatch(/"offers"|"price"/);

      const faq = graph['@graph'].find((node) => node['@type'] === 'FAQPage');
      const band = page.locator('#questions');

      expect(faq?.mainEntity?.map((entry) => entry.name)).toEqual(
        await band.locator('dt').allTextContents(),
      );
      expect(
        faq?.mainEntity?.map((entry) => entry.acceptedAnswer.text),
      ).toEqual(await band.locator('dd').allTextContents());
    });

    // what a crawler or a social network reads is the server's html, so the page has to say everything before any script runs
    test('dit tout sans javascript', async ({ browser }) => {
      const context = await browser.newContext({ javaScriptEnabled: false });
      const bare = await context.newPage();
      await bare.goto(`/${one.locale}`);

      await expect(bare.locator('h1')).toHaveCount(1);
      await expect(bare.locator('#questions dt')).toHaveCount(5);
      await expect(
        bare.locator('script[type="application/ld+json"]'),
      ).toHaveCount(1);

      await context.close();
    });
  });
}

test('dit la vérité sur la quatrième question', async ({ page }) => {
  await page.goto('/fr');

  await expect(
    page.getByText(
      'Le badge vérifié est accordé par un administrateur, jamais auto-déclaré.',
    ),
  ).toBeVisible();
});

test('ouvre tout aux robots et leur donne le plan', async ({ request }) => {
  const answer = await request.get('/robots.txt');
  const body = await answer.text();

  expect(answer.headers()['content-type']).toContain('text/plain');
  expect(body).toContain('Allow: /');
  expect(body).not.toContain('Disallow');
  expect(body).toContain(`Sitemap: ${SITE_URL}/sitemap.xml`);
});

test('liste les deux langues dans le plan, chacune avec ses alternatives', async ({
  request,
}) => {
  const answer = await request.get('/sitemap.xml');
  const body = await answer.text();

  expect(answer.headers()['content-type']).toContain('application/xml');
  for (const locale of ['fr', 'en']) {
    expect(body).toContain(`<loc>${SITE_URL}/${locale}</loc>`);
    expect(body).toContain(
      `<xhtml:link rel="alternate" hreflang="${locale}" href="${SITE_URL}/${locale}" />`,
    );
  }
  expect(body).toContain(
    `<xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}/fr" />`,
  );
  expect(body.match(/<url>/g)).toHaveLength(2);
});

test('sert un manifeste dont chaque icône existe', async ({ request }) => {
  const answer = await request.get('/manifest.webmanifest');
  const manifest = (await answer.json()) as {
    start_url: string;
    icons: { src: string; type: string }[];
  };

  expect(answer.headers()['content-type']).toContain(
    'application/manifest+json',
  );
  expect(manifest.start_url).toBe('/fr');

  for (const icon of manifest.icons) {
    const file = await request.get(icon.src);

    expect(file.status(), icon.src).toBe(200);
    expect(file.headers()['content-type'], icon.src).toBe(icon.type);
  }

  for (const path of ['/favicon.ico', '/icon.svg', '/apple-icon.png']) {
    expect((await request.get(path)).status(), path).toBe(200);
  }
});

test('protège chaque réponse par ses en-têtes', async ({ request }) => {
  const headers = (await request.get('/fr')).headers();

  expect(headers['strict-transport-security']).toContain('max-age=63072000');
  expect(headers['x-content-type-options']).toBe('nosniff');
  expect(headers['x-frame-options']).toBe('DENY');
  expect(headers['referrer-policy']).toBe('strict-origin-when-cross-origin');
  expect(headers['permissions-policy']).toContain('camera=()');
  expect(headers['x-powered-by']).toBeUndefined();
});

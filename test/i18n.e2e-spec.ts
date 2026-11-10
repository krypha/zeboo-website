import { expect, test } from '@playwright/test';

// the root never renders: it redirects, and always to french, whatever the browser asks for
for (const browserLocale of ['fr-FR', 'en-US', 'de-DE']) {
  test.describe(`navigateur en ${browserLocale}`, () => {
    test.use({ locale: browserLocale });

    test('redirige la racine vers /fr', async ({ page }) => {
      await page.goto('/');

      await expect(page).toHaveURL(/\/fr$/);
      await expect(page.locator('html')).toHaveAttribute('lang', 'fr');
    });
  });
}

// a temporary redirect, so a crawler keeps the root as the address and the french page as what it leads to
test('répond à la racine par une redirection temporaire', async ({
  request,
}) => {
  const answer = await request.get('/', {
    headers: { 'accept-language': 'en-US,en;q=0.9' },
    maxRedirects: 0,
  });

  expect(answer.status()).toBe(307);
  expect(answer.headers().location).toBe('/fr');
});

// the language chooser is a door, so it sits in the header at every width
test('change de langue depuis l’en-tête', async ({ page }) => {
  await page.goto('/fr');

  await expect(page.getByRole('button', { name: 'Langue' })).toHaveText(/FR/);

  await page.getByRole('button', { name: 'Langue' }).click();
  await page.getByRole('menuitemradio', { name: 'English' }).click();

  await expect(page).toHaveURL(/\/en$/);
  await expect(page.getByRole('button', { name: 'Language' })).toHaveText(/EN/);
});

// the menu is a button a crawler never presses, so the footer carries each language as a link it can follow
test('relie chaque langue par un vrai lien dans le pied de page', async ({
  page,
}) => {
  await page.goto('/fr');

  const languages = page.locator('footer nav');

  await expect(languages.locator('a[hreflang="fr"]')).toHaveAttribute(
    'href',
    '/fr',
  );
  await expect(languages.locator('a[hreflang="fr"]')).toHaveAttribute(
    'aria-current',
    'page',
  );
  await expect(languages.locator('a[hreflang="en"]')).toHaveAttribute(
    'href',
    '/en',
  );

  await languages.getByRole('link', { name: 'English' }).click();

  await expect(page).toHaveURL(/\/en$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
});

// light unless the visitor says otherwise, even on a device set to dark
test.describe('appareil en mode sombre', () => {
  test.use({ colorScheme: 'dark' });

  test('sert la page en clair tant que rien n’a été choisi', async ({
    page,
  }) => {
    await page.goto('/fr');

    await expect(page.locator('html')).not.toHaveClass(/dark/);
  });
});

test('sert les libellés anglais sur /en', async ({ page }) => {
  await page.goto('/en');

  await expect(
    page.getByRole('heading', { level: 1, name: /Compose your trip/ }),
  ).toBeVisible();
  await expect(
    page.locator('header').getByRole('link', { name: 'Sign up' }),
  ).toBeVisible();
  await expect(page.getByText('coming to the Play Store')).toBeVisible();
});

// a page that does not exist says so in the visitor's language, with a 404 and nothing for a crawler to file; next draws it in the browser from its error payload, so the heading is read after the page has run
for (const [path, title] of [
  ['/fr/route-inexistante', 'Page introuvable'],
  ['/en/missing-route', 'Page not found'],
] as const) {
  test(`sert une 404 traduite pour ${path}`, async ({ page }) => {
    const response = await page.goto(path);

    expect(response?.status()).toBe(404);
    expect(await response?.text()).toContain(
      '<meta name="robots" content="noindex"/>',
    );
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(title);
    await expect(page.locator('header')).toBeVisible();
  });
}

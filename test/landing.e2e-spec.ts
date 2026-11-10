import { expect, test } from '@playwright/test';

import { APP_URL, SITE_URL } from './support/origins';

// every door opens onto the web app, another origin, and carries the visitor's language there; the app is not running here, so each door is read rather than followed
for (const [locale, login, register, start, pro, webAction, webSignIn] of [
  [
    'fr',
    'Se connecter',
    "S'inscrire",
    'Commencer sur le web',
    'Créer un compte professionnel',
    'Créer un compte',
    'J’ai déjà un compte',
  ],
  [
    'en',
    'Sign in',
    'Sign up',
    'Start on the web',
    'Create a professional account',
    'Create an account',
    'I already have an account',
  ],
] as const) {
  test(`ouvre chaque porte sur l’application, en ${locale}`, async ({
    page,
  }) => {
    await page.goto(`/${locale}`);

    const signIn = `${APP_URL}/${locale}/login`;
    const signUp = `${APP_URL}/${locale}/register`;
    const header = page.locator('header');

    await expect(
      header.getByRole('link', { name: login, exact: true }),
    ).toHaveAttribute('href', signIn);
    await expect(
      header.getByRole('link', { name: register, exact: true }),
    ).toHaveAttribute('href', signUp);
    await expect(
      page.getByRole('link', { name: start, exact: true }),
    ).toHaveAttribute('href', signUp);
    await expect(
      page.getByRole('link', { name: pro, exact: true }),
    ).toHaveAttribute('href', signUp);

    const band = page.locator('#download');
    await expect(
      band.getByRole('link', { name: webAction, exact: true }),
    ).toHaveAttribute('href', signUp);
    await expect(
      band.getByRole('link', { name: webSignIn, exact: true }),
    ).toHaveAttribute('href', signIn);
  });
}

// the band has two states and only two: it hands out a file that is really there, or it says the build is coming; what it must never do is offer a button that leads nowhere
test('dit la vérité sur le téléchargement', async ({ page }) => {
  await page.goto('/fr');

  const band = page.locator('#download');
  const apk = band.locator('a[href="/app/zeboo.apk"]');
  const posted = (await apk.count()) > 0;

  if (posted) {
    await expect(apk).toHaveAttribute('download', 'zeboo.apk');
    await expect(band.getByText(/Mo$/)).toBeVisible();
    // an apk from here and not from the store needs a permission, and the band warns before android refuses
    await expect(band.getByText(/Play Store/)).toBeVisible();

    const answer = await page.request.head('/app/zeboo.apk');
    expect(answer.status()).toBe(200);
    expect(answer.headers()['content-type']).toBe(
      'application/vnd.android.package-archive',
    );
  } else {
    await expect(band.getByText('bientôt sur le Play Store')).toBeVisible();

    const answer = await page.request.head('/app/zeboo.apk');
    expect(answer.status()).toBe(404);
  }

  // the iphone has no build either way, and no store link is invented for either platform
  await expect(band.getByText('bientôt disponible')).toBeVisible();
  await expect(band.locator('a[href*="play.google"]')).toHaveCount(0);
  await expect(band.locator('a[href*="apps.apple"]')).toHaveCount(0);
});

// the figures come from the product's own budget engine, so pressing the stepper has to move both of them
test('recompte le budget quand la troupe change', async ({ page }) => {
  await page.goto('/fr');

  const band = page.locator('#budget');
  await expect(band.getByText('699 736 Ar')).toBeVisible();
  await expect(band.getByText('349 868 Ar')).toBeVisible();

  await band.getByRole('button', { name: 'Un voyageur de plus' }).click();
  await band.getByRole('button', { name: 'Un voyageur de plus' }).click();

  await expect(band.getByText('867 336 Ar')).toBeVisible();
  await expect(band.getByText('216 834 Ar')).toBeVisible();

  await band.getByRole('button', { name: 'Un voyageur de moins' }).click();
  await band.getByRole('button', { name: 'Un voyageur de moins' }).click();
  await band.getByRole('button', { name: 'Un voyageur de moins' }).click();

  // at one traveller the total and the share are the same figure, which is the arithmetic being right rather than a duplicate
  await expect(band.getByText('615 936 Ar')).toHaveCount(2);
});

// the hero's ground is one svg and three css keyframes: no image, no video, and nothing a screen reader has to read out
test('porte un fond dessiné plutôt qu’une vidéo', async ({ page }) => {
  await page.goto('/fr');

  const hero = page.locator('section').first();

  await expect(hero.locator('video')).toHaveCount(0);
  await expect(hero.locator('img')).toHaveCount(0);
  await expect(hero.locator('[aria-hidden="true"] > svg')).toHaveCount(1);
});

test.describe('visiteur qui a demandé moins de mouvement', () => {
  // playwright exposes this through the context options rather than as a test option of its own
  test.use({ contextOptions: { reducedMotion: 'reduce' } });

  test('reçoit la même scène, immobile', async ({ page }) => {
    await page.goto('/fr');

    for (const held of ['.zeboo-drift', '.zeboo-glow', '.zeboo-road']) {
      await expect(page.locator(held).first()).toHaveCSS(
        'animation-name',
        'none',
      );
    }
  });
});

// the header holds a dozen stops, so a keyboard reaches the page itself in one
test('donne un lien d’évitement au premier tab', async ({ page }) => {
  await page.goto('/fr');
  await page.keyboard.press('Tab');

  const skip = page.getByRole('link', { name: 'Aller au contenu' });

  await expect(skip).toBeVisible();
  await expect(skip).toHaveAttribute('href', '#contenu');
  await expect(page.locator('#contenu')).toBeAttached();
});

// the site never calls the api, and its fonts are its own: a visit asks nothing of any other origin
test('ne demande rien à une autre origine', async ({ page }) => {
  const elsewhere: string[] = [];
  page.on('request', (request) => {
    const url = request.url();
    if (!url.startsWith(SITE_URL) && !url.startsWith('data:')) {
      elsewhere.push(url);
    }
  });

  await page.goto('/fr');
  await page.locator('#budget').scrollIntoViewIfNeeded();
  await page
    .locator('#budget')
    .getByRole('button', { name: 'Un voyageur de plus' })
    .click();
  await page.waitForLoadState('networkidle');

  expect(elsewhere).toEqual([]);
});

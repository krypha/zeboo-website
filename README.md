# zeboo-site

The public site of Zeboo, served on **zeboo.mg**: one landing page in French and in English, built ahead of time with [Next.js](https://nextjs.org) 16 App Router, React 19 and [Tailwind CSS](https://tailwindcss.com) 4. The planner itself is `zeboo-frontend`, on app.zeboo.mg: every "sign in" and "sign up" here is a plain link to it.

The site calls no API. Its one piece of arithmetic, the budget counter, runs the product's own engine in the browser on a fixed RN7 scenario.

## Prerequisites

| Tool    | Version          | Notes                                                                                                                           |
| ------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Node.js | 22.22.2 or newer | `jsdom` 30, used by the test runner, declares `^22.22.2 \|\| ^24.15.0 \|\| >=26.0.0`, the binding constraint, as on the web app |
| pnpm    | 10.33.0          | Pinned by `packageManager`, so `corepack enable` is enough                                                                      |

Nothing else needs to run: neither the backend nor the web app.

## Quick start

> **Copy the env file first.** `src/config/env.ts` validates the environment with [zod](https://zod.dev) when it is imported, and `next.config.ts` imports it for that side effect alone, so `pnpm start:dev` and `pnpm build` stop with a `ZodError` naming the missing variable.

```bash
cp .env.example .env
pnpm install
pnpm start:dev
```

Then open <http://localhost:3003>. The root never renders: it redirects to French, whatever the browser asks for.

```bash
curl -I localhost:3003
# HTTP/1.1 307 Temporary Redirect
# location: /fr
```

| Port | Service                                                           |
| ---- | ----------------------------------------------------------------- |
| 3003 | This site (`next dev` / `next start`)                             |
| 3004 | The production build the end-to-end suite runs against            |
| 3001 | `zeboo-frontend`, which the doors open onto with the local `.env` |
| 3000 | `zeboo-backend`, which this site never calls                      |

## What the page carries

Twelve bands, every one a server component except the budget counter: the hero with its drawn Madagascar (one SVG and three CSS keyframes, held still under `prefers-reduced-motion`), the figures, the three steps, the living budget, composing a trip, discovering places, transport, the driving mode, the two doors for agencies and providers, the promises, the questions and the download band.

The budget counter calls `budgetOf` from `src/features/itineraries/budget.ts`, the engine the web app and the phone use, and gives back 615 936 Ar for one traveller, 699 736 for two (349 868 each) and 867 336 for four (216 834 each): 689 km of road at 8 L/100 km and 5 300 Ar a litre, shared, five nights shared, meals and the Isalo entry paid per head. `src/features/landing/budget-scenario.spec.ts` holds those figures.

The header is the same at every visit. The session lives in an httpOnly cookie on app.zeboo.mg, which this origin cannot read, so both doors are always drawn and the app decides what an account already signed in sees.

## Search engines and sharing

Everything is decided at build time: `/fr`, `/en`, both share images, the sitemap, `robots.txt` and the manifest are prerendered, and `next start` serves them with the root redirect and the headers.

| What                   | Where                                                                           | Emitted                                                                                          |
| ---------------------- | ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| Title and description  | `seo` in `src/messages/*.json`                                                  | `<title>… · Zeboo</title>`, `meta description`, one per language                                 |
| Canonical and hreflang | `src/lib/seo/alternates.ts`                                                     | `canonical` to the page itself, `alternate` for `fr`, `en` and `x-default` (French)              |
| Open Graph and X cards | `src/app/[locale]/page.tsx`                                                     | `og:*` with `fr_FR` / `en_US` and the other as alternate, `summary_large_image`                  |
| Share image            | `src/app/[locale]/og.png/route.tsx`                                             | `/fr/og.png` and `/en/og.png`, 1200 by 630, with a translated alt                                |
| Indexing               | `src/app/[locale]/page.tsx`, `robots.ts`                                        | `index, follow`, `max-image-preview:large`; `robots.txt` allows everything and names the sitemap |
| Sitemap                | `src/app/sitemap.ts`                                                            | both pages, each with its `xhtml:link` alternates, dated by the build                            |
| Structured data        | `src/lib/seo/structured-data.ts`                                                | one JSON-LD graph: `Organization`, `WebSite`, `WebPage`, `SoftwareApplication`, `FAQPage`        |
| Icons and manifest     | `src/app/{favicon.ico,icon.svg,apple-icon.png}`, `manifest.ts`, `public/icons/` | 16 to 512 pixels, all from the brand mark                                                        |
| Search console         | `GOOGLE_SITE_VERIFICATION`                                                      | `google-site-verification`, only when the variable is set                                        |

The FAQ in the structured data is read from the same catalogue entries the questions band draws, so what a crawler is told is what a visitor reads, word for word; an end-to-end test compares the two. The graph states no price anywhere, the page itself never giving a firm one. `SoftwareApplication` names Krypha LTD as its `creator`, the technology partner that designed and built the platform, and Zeboo as its publisher.

Two limits that come from Google and not from the markup: FAQ rich results have been shown only for well-known government and health sites since August 2023, and a software rich result asks for a price and a rating, which this page deliberately does not state. The markup still describes the page; it will not turn into a rich snippet.

Four things were measured rather than assumed, each of which cost time:

- **The layout's title template does not reach this page.** A template applies to the segments below the layout, and the landing shares the `[locale]` segment with it, so the page sets an absolute title with the brand appended.
- **The `opengraph-image` convention never prerenders here.** Its handler is a route handler, which does not inherit the layout's `generateStaticParams`, so it was drawn on the first request instead; and its `generateImageMetadata` is called with empty params while the build lists the images, where next-intl finds no request to read and the build stops. The card is therefore an ordinary route, `og.png/route.tsx`, `force-static` with its own `generateStaticParams`, announced by `generateMetadata`, which also lets its alt follow the language. Drawing it at build time means a broken card fails the build instead of a share.
- **`src/i18n/request.ts` prefers the locale it is handed.** `getTranslations({ locale })` passes that locale to the request config, and reading the segment instead touches the request headers, which a build refuses.
- **A 404 is drawn in the browser.** For `notFound()` raised by the catch-all page, Next answers `404` with `noindex` and an empty `__next_error__` shell, then renders the translated page from its payload, and the title stays `Zeboo`. The web app behaves the same way, measured on its own build.

Lighthouse 12.8.2 on the production build, both languages: SEO 100, best practices 100, accessibility 96, performance 95. Two accessibility findings are left, both inherited from the landing as it was. Contrast: the charter's amber `oo` of the footer wordmark on sand (1.89 to 1), and three small notes set at 70 or 80 % opacity on the green bands, the road band's `Vers l’Isalo · environ 11 h` (3.84) and the download band's two `bientôt` lines (3.35). And the language button, whose accessible name `Langue` does not contain the `FR` it shows; the switcher is a copy shared with the web app, better fixed in both at once.

## Handing out the Android build

The site serves the APK itself at `/app/zeboo.apk`, since there is no Play Store listing yet. The binary is **not committed**: it weighs tens of megabytes and a new one lands at every release, so `public/app/` is gitignored except for its `.gitkeep`, and the file is posted before the build.

```bash
pnpm app:android ../zeboo-mobile/build/zeboo.apk      # version read from the sibling repo
pnpm app:android ./zeboo.apk --version=0.0.2          # or stated outright
```

The script copies the file to `public/app/zeboo.apk` and writes `public/app/zeboo.json` beside it with the version and the date. `src/features/landing/android-build.ts` reads both **while the page is built**, and the download band has exactly two states: a real button carrying the version and the size, with a line warning that Android will ask permission to install from this source; or the plain statement that the build is coming, with no link at all. What it never shows is a button leading nowhere, and `test/landing.e2e-spec.ts` asserts both states. Since the page is prerendered, **a newly posted APK appears only after the next build**.

`next.config.ts` answers the file with `Content-Type: application/vnd.android.package-archive` and `Content-Disposition: attachment`, so a browser saves it rather than guessing.

## Environment variables

`.env` is **not** committed; `.env.example` is, and lists every variable.

| Variable                   | Example                 | Purpose                                                                       |
| -------------------------- | ----------------------- | ----------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`     | `http://localhost:3003` | Public origin of this site: canonical urls, hreflang, sitemap, share cards    |
| `NEXT_PUBLIC_APP_URL`      | `http://localhost:3001` | The web app the doors open onto, followed by `/{locale}/login` or `/register` |
| `GOOGLE_SITE_VERIFICATION` | empty                   | The Search Console token, written in the head only when set                   |

Both origins must be **bare**: `env.ts` strips a trailing slash and refuses a path, since the code joins each one to a path of its own. Both `NEXT_PUBLIC_` variables are inlined at build time, so a change needs a new build, and nothing secret belongs in them. `src/config/env.ts` hands the schema an object built key by key, because Next only replaces literal `process.env.NEXT_PUBLIC_X` reads.

## Deploying

The site ships as the image the `Dockerfile` builds, which is what Dokploy runs. Three stages: dependencies installed with the pinned pnpm, then `next build` with `BUILD_STANDALONE=1`, which only the image asks for, since `next start` warns that it does not serve a standalone build; then a runner holding the traced server alone, `node server.js` as the `node` user on **3003**, with a healthcheck on `/robots.txt`.

**Every address is a build argument, not a runtime variable.** Next writes the `NEXT_PUBLIC_` values into the pages while it builds them, so setting them on the running container changes nothing; the container itself needs no variable at all. A build that lacks one stops on a `ZodError` naming it.

| Build argument             | Production               | Notes                                                                  |
| -------------------------- | ------------------------ | ---------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`     | `https://zeboo.mg`       | Required. The wip stack gives its own address                          |
| `NEXT_PUBLIC_APP_URL`      | `https://app.zeboo.mg`   | Required. The wip stack points at the wip web app                      |
| `GOOGLE_SITE_VERIFICATION` | the Search Console token | Optional                                                               |
| `ANDROID_APK_URL`          | a direct link to the apk | Optional. Downloaded during the build and posted with `app:android`    |
| `ANDROID_APK_VERSION`      | `0.0.2`                  | Required with the URL, since the image has no `zeboo-mobile` beside it |

In Dokploy, the application points at this repository (`main` for production, `develop` for wip), with **Dockerfile** as its build type, `Dockerfile` at the root and `.` as the context. The arguments above go in the build arguments of its environment, not in its runtime variables, and the domain `zeboo.mg` points at container port **3003**, with HTTPS from Let's Encrypt. A new APK means setting the two `ANDROID_APK_` arguments and redeploying, the band being decided at build time.

The same image, built and run by hand:

```bash
docker build -t zeboo-site \
  --build-arg NEXT_PUBLIC_SITE_URL=https://zeboo.mg \
  --build-arg NEXT_PUBLIC_APP_URL=https://app.zeboo.mg \
  .
docker run -p 3003:3003 zeboo-site
```

Measured on a local build (arm64, Docker Desktop) with a 3 MB stand-in APK fetched through `ANDROID_APK_URL`: built in 1 min 17, reported at 310 MB by `docker image ls`; the root answered `307` to `/fr`, the page carried the download button with its version and size, `/app/zeboo.apk` came back whole with its two headers, `/fr/og.png` as a 62 kB PNG, the security headers were there, the process ran as `node`, and the healthcheck read healthy. The VPS builds for its own architecture, which this machine did not test.

The build needs the network: corepack fetches pnpm, pnpm the packages, and `next/font` downloads both families, which the site then serves from its own origin. The share cards read `src/assets/fonts/`, the two OFL fonts with their licences beside them, and the trace copies them into the image.

## Scripts

| Script                     | Description                                    |
| -------------------------- | ---------------------------------------------- |
| `pnpm start:dev`           | Dev server with hot reload on port 3003        |
| `pnpm build`               | Production build, both languages prerendered   |
| `pnpm start`               | Serve the production build on port 3003        |
| `pnpm type-check`          | `next typegen && tsc --noEmit`                 |
| `pnpm lint` · `lint:fix`   | ESLint over the whole project, then with fixes |
| `pnpm format`              | Prettier, writing in place                     |
| `pnpm test` · `test:watch` | Vitest, the specs beside the code              |
| `pnpm test:e2e`            | Playwright against a production build on 3004  |
| `pnpm app:android <apk>`   | Post an Android build into `public/app/`       |

`next typegen` is not optional: `PageProps`, `LayoutProps` and `RouteContext` are globals Next generates into `.next/types`, and on a fresh clone `tsc` alone cannot find them.

## Project structure

```
src/
  app/
    [locale]/          layout (fonts, metadata base, header, footer), page, error, not-found, catch-all, og.png
    globals.css        the design tokens, the only place a colour is written
    manifest.ts  robots.ts  sitemap.ts  favicon.ico  icon.svg  apple-icon.png  global-error.tsx
  components/          header, footer, brand, locale and appearance menus, json-ld, the vendored ui primitives
  config/env.ts        the validated environment
  features/landing/    the twelve bands, the budget scenario, the android build reader
  features/itineraries/budget.ts   the budget engine, with the two contract shapes it reads
  i18n/                routing, request config, navigation
  lib/                 brand constants, colour, money, seo, app links
  messages/            fr.json and en.json
  proxy.ts             next-intl alone: nothing here is guarded
test/                  the Playwright specs
scripts/install-android.mjs
Dockerfile             the image Dokploy runs, with its .dockerignore
```

**Copies, not a shared package.** As everywhere in Zeboo, code that two repositories need is copied at the same path with its spec, so a `diff` across repositories says whether a copy has drifted: `budget.ts`, `money/format.ts`, `colour/colour.ts`, `zeboo-icons.tsx`, the `ui/` primitives, `brand`, `skip-link`, `locale-switcher`, `appearance-toggle`, `theme-colour`, `globals.css` and `dark-palette.spec.ts` come from `zeboo-frontend`. Three copies differ on purpose: `src/i18n/request.ts` (the explicit locale, above), `src/config/env.ts` (this site's variables) and `src/lib/brand/charter.ts`, which carries four more charter tones for the share card, each checked against `globals.css` by its spec. The contract shapes the engine reads, `features/itineraries/api/itineraries.types.ts` and `features/places/api/places.types.ts`, are transcribed by hand from the web app's generated `schema.d.ts`, since this site has no API contract of its own.

## Design system

Tailwind 4 is configured in CSS, with no `tailwind.config.js`: every token lives in `@theme` inside `src/app/globals.css`, and **no colour literal belongs anywhere else**. The values that must exist outside a stylesheet, for the manifest, the favicon and the share card, are in `src/lib/brand/charter.ts`, whose spec fails if any of them drifts from the tokens. The dark palette is derived from the charter green, never invented, and `src/app/dark-palette.spec.ts` replays that derivation. The appearance defaults to **light**, whatever the device says, under the key `zeboo.appearance`.

## Testing

`pnpm test` runs the specs beside the code: the budget engine and the RN7 scenario, the money format, the charter and the dark palette, the environment, the app links, the hreflang alternates, the structured data and the Android build reader.

`pnpm test:e2e` builds the site with `NEXT_PUBLIC_APP_URL=https://app.example.test`, so every door is asserted against an address no one could mistake for a real one, and serves it on 3004:

- `landing.e2e-spec.ts`: each door in both languages, the download band in its two states, the budget stepper, the drawn hero and its stillness under reduced motion, the skip link, and a visit that asks nothing of any other origin;
- `i18n.e2e-spec.ts`: the root redirect for French, English and German browsers and its `307`, the language menu and the footer links, light by default on a dark device, the English labels, and the translated 404 with its `noindex`;
- `seo.e2e-spec.ts`: per language, one `h1`, the title, the description, the canonical and the three alternates, the indexing directives, the share card and its PNG, the structured data against the visible questions, the page read with JavaScript off; then `robots.txt`, the sitemap, the manifest and its icons, and the security headers.

It runs on a production build, not `next dev`, because what a crawler reads is the prerendered page, and because the dev server answers a 404 with `200` once streaming has started. The build it leaves in `.next` carries the test addresses, so run `pnpm build` again before `pnpm start`.

## Code quality and commits

Husky runs `lint-staged` on `pre-commit` (ESLint then Prettier on the staged files) and `commitlint` on `commit-msg`: commits follow [Conventional Commits](https://www.conventionalcommits.org). ESLint is type-aware, so run `pnpm type-check` once on a fresh clone. `next dev` writes an `AGENTS.md` and a `CLAUDE.md` at the root on every run; both are gitignored.

## Troubleshooting

| Symptom                                      | Cause                                               | Fix                                     |
| -------------------------------------------- | --------------------------------------------------- | --------------------------------------- |
| `ZodError` at startup or during `pnpm build` | No `.env`, or a variable missing or carrying a path | `cp .env.example .env`                  |
| `Cannot find name 'LayoutProps'`             | Route types were never generated                    | `pnpm type-check`                       |
| A posted APK does not show on the page       | The page was built before the file was posted       | `pnpm build` again                      |
| `pnpm test:e2e` cannot launch a browser      | Playwright's Chromium is not installed              | `pnpm exec playwright install chromium` |

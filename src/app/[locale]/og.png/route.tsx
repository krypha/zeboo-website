import { hasLocale } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { ImageResponse } from 'next/og';

import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import { routing } from '@/i18n/routing';
import { CHARTER } from '@/lib/brand/charter';
import { SHARE_IMAGE } from '@/lib/seo/share-image';

// the card a network shows when the landing is shared, drawn once per locale at build time; a route of its own and not the opengraph-image convention, whose handler never sees the layout's locales, so it is drawn on the first request instead and its alt cannot follow the language
export const dynamic = 'force-static';
export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const FONTS = join(process.cwd(), 'src/assets/fonts');

// four towns of the rn7, from the capital down to the isalo where the landing's budget ends, placed where they sit on the trail drawn below
const STOPS = [
  { name: 'Antananarivo', x: 250, y: 40 },
  { name: 'Antsirabe', x: 196, y: 168 },
  { name: 'Fianarantsoa', x: 244, y: 310 },
  { name: 'Ranohira', x: 150, y: 446 },
] as const;

// the panel the trail is drawn in, narrow enough that the english title holds on two lines beside it
const PANEL = { width: 300, height: 486 };

const TRAIL =
  'M250 40 C 218 82 184 120 196 168 S 274 262 244 310 S 164 400 150 446';

// satori reads no stylesheet, which is why every colour comes from the charter constants and every box says display flex
export async function GET(
  _request: Request,
  { params }: RouteContext<'/[locale]/og.png'>,
) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    return new Response(null, { status: 404 });
  }

  const t = await getTranslations({ locale, namespace: 'landing.hero' });
  const [heading, body] = await Promise.all([
    readFile(join(FONTS, 'BricolageGrotesque_800ExtraBold.ttf')),
    readFile(join(FONTS, 'Figtree_500Medium.ttf')),
  ]);

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        background: CHARTER.ivory,
        padding: 72,
        fontFamily: 'Figtree',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          flex: 1,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <svg width="64" height="64" viewBox="0 0 120 120">
            <rect
              x="4"
              y="4"
              width="112"
              height="112"
              rx="30"
              fill={CHARTER.green}
            />
            <path
              d="M46 40 C35 30 26 24 19 22 C25 32 33 40 44 49 Z"
              fill={CHARTER.amber}
            />
            <path
              d="M74 40 C85 30 94 24 101 22 C95 32 87 40 76 49 Z"
              fill={CHARTER.amber}
            />
            <circle cx="46" cy="64" r="6.4" fill={CHARTER.ivory} />
            <circle cx="74" cy="64" r="6.4" fill={CHARTER.ivory} />
            <rect
              x="40"
              y="82"
              width="40"
              height="24"
              rx="12"
              fill={CHARTER.ivory}
            />
            <circle cx="52" cy="94" r="3.4" fill={CHARTER.green} />
            <circle cx="68" cy="94" r="3.4" fill={CHARTER.green} />
          </svg>
          <div
            style={{
              display: 'flex',
              fontFamily: 'Bricolage Grotesque',
              fontSize: 46,
              letterSpacing: -1.4,
              color: CHARTER.green,
            }}
          >
            Zeb<span style={{ color: CHARTER.amber }}>oo</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 26 }}>
          <div
            style={{
              display: 'flex',
              alignSelf: 'flex-start',
              background: CHARTER.sable,
              color: CHARTER.green,
              borderRadius: 999,
              padding: '10px 22px',
              fontSize: 24,
            }}
          >
            {t('mantra')}
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              fontFamily: 'Bricolage Grotesque',
              fontSize: 64,
              lineHeight: 1.04,
              letterSpacing: -2.1,
            }}
          >
            <span style={{ color: CHARTER.espresso }}>{t('title')}</span>
            <span style={{ color: CHARTER.green }}>{t('titleSecond')}</span>
          </div>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          position: 'relative',
          width: PANEL.width,
          marginLeft: 32,
          background: CHARTER.sable,
          borderRadius: 36,
        }}
      >
        <svg
          width={PANEL.width}
          height={PANEL.height}
          viewBox={`0 0 ${PANEL.width} ${PANEL.height}`}
        >
          <path
            d={TRAIL}
            fill="none"
            stroke={CHARTER.laterite}
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray="1 17"
          />
          {STOPS.map((stop, index) => (
            <circle
              key={stop.name}
              cx={stop.x}
              cy={stop.y}
              r="12"
              fill={
                index === STOPS.length - 1 ? CHARTER.laterite : CHARTER.ivory
              }
              stroke={CHARTER.laterite}
              strokeWidth="6"
            />
          ))}
        </svg>

        {STOPS.map((stop) => (
          <div
            key={stop.name}
            style={{
              display: 'flex',
              position: 'absolute',
              right: PANEL.width - stop.x + 26,
              top: stop.y - 16,
              fontSize: 24,
              color: CHARTER.espresso,
            }}
          >
            {stop.name}
          </div>
        ))}
      </div>
    </div>,
    {
      width: SHARE_IMAGE.width,
      height: SHARE_IMAGE.height,
      fonts: [
        {
          name: 'Bricolage Grotesque',
          data: heading,
          weight: 800,
          style: 'normal',
        },
        { name: 'Figtree', data: body, weight: 500, style: 'normal' },
      ],
    },
  );
}

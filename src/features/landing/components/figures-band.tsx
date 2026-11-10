import { getTranslations } from 'next-intl/server';

import { Band } from './band';

// the four counts, measured against the api's own facets and not rounded up; the first one drifts as the catalogue grows, so it is checked rather than assumed
const FIGURES = [
  { value: '3 676', key: 'places' },
  { value: '40', key: 'towns' },
  { value: '6', key: 'regions' },
  { value: 'RN7', key: 'circuit' },
] as const;

export async function FiguresBand() {
  const t = await getTranslations('landing.figures');

  return (
    <Band ground="sand">
      <dl className="grid grid-cols-2 gap-8 sm:grid-cols-4">
        {FIGURES.map(({ value, key }) => (
          <div key={key} className="flex flex-col gap-1">
            <dt className="font-heading text-primary text-3xl font-extrabold tracking-[-0.03em] sm:text-4xl">
              {value}
            </dt>
            <dd className="text-muted-foreground font-sans text-sm">
              {t(key)}
            </dd>
          </div>
        ))}
      </dl>
    </Band>
  );
}

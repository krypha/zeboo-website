import { getTranslations } from 'next-intl/server';

import { ZebooIcon, type ZebooIconName } from '@/components/icons/zeboo-icons';

import { Band, BandLead, BandTitle, Eyebrow } from './band';

// the same three stops the design draws, and the days counted from the nights rather than written down
const STOPS: {
  town: string;
  nights: number;
  items: { name: string; icon: ZebooIconName }[];
}[] = [
  {
    town: 'Antsirabe',
    nights: 2,
    items: [
      { name: 'Couleur Café', icon: 'bed' },
      { name: 'Chez Mariette', icon: 'food' },
    ],
  },
  {
    town: 'Fianarantsoa',
    nights: 2,
    items: [
      { name: 'Tsara Guest House', icon: 'bed' },
      { name: 'Le train de la côte est', icon: 'hike' },
    ],
  },
  {
    town: 'Ranohira',
    nights: 1,
    items: [
      { name: "Parc national de l'Isalo", icon: 'nature' },
      { name: 'Guide du parc', icon: 'guide' },
    ],
  },
];

// the days are counted from the nights before anything is drawn, since a running total mutated inside a map is a side effect in render
const DAYS = STOPS.reduce<{ from: number; to: number }[]>((days, stop) => {
  const from = (days.at(-1)?.to ?? 0) + 1;

  return [...days, { from, to: from + stop.nights - 1 }];
}, []);

export async function ComposeBand() {
  const t = await getTranslations('landing.compose');

  return (
    <Band id="compose">
      <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
        <div>
          <Eyebrow>{t('eyebrow')}</Eyebrow>
          <BandTitle second={t('titleSecond')}>{t('title')}</BandTitle>
          <BandLead>{t('lead')}</BandLead>
        </div>

        <ol className="flex flex-col gap-4">
          {STOPS.map((stop, at) => {
            const { from, to } = DAYS[at];

            return (
              <li
                key={stop.town}
                className="border-itinerary/35 relative border-l-2 pl-6"
              >
                {/* the trail keeps its laterite in both modes, like the map it is drawn on */}
                <span className="bg-itinerary absolute top-1.5 -left-[5px] size-2 rounded-full" />

                <p className="text-muted-foreground font-sans text-xs tracking-wide uppercase">
                  {stop.nights > 1
                    ? t('dayRange', { from, to })
                    : t('day', { from })}
                </p>

                <p className="font-heading mt-1 text-base font-semibold">
                  {stop.town}
                  <span className="text-muted-foreground font-sans text-sm font-normal">
                    {', '}
                    {t('nights', { count: stop.nights })}
                  </span>
                </p>

                <ul className="mt-3 flex flex-col gap-2">
                  {stop.items.map((item) => (
                    <li
                      key={item.name}
                      className="bg-card border-border flex items-center gap-2.5 rounded-xl border px-3 py-2"
                    >
                      <ZebooIcon
                        name={item.icon}
                        className="text-primary size-[18px] shrink-0"
                      />
                      <span className="font-sans text-sm">{item.name}</span>
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ol>
      </div>
    </Band>
  );
}

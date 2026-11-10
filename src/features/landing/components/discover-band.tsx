import { getTranslations } from 'next-intl/server';

import { ZebooIcon, type ZebooIconName } from '@/components/icons/zeboo-icons';
import { Chip } from '@/components/ui/chip';

import { Band, BandLead, BandTitle, Eyebrow } from './band';

// six listings of the catalogue, each with the bracket its own tariff is, never a firm amount
const LISTINGS: {
  name: string;
  kind: string;
  where: string;
  price: string;
  icon: ZebooIconName;
}[] = [
  {
    name: 'Couleur Café',
    kind: 'Hébergement',
    where: 'Antsirabe',
    price: 'environ 120 000 Ar la nuit',
    icon: 'bed',
  },
  {
    name: 'Chez Mariette',
    kind: 'Table',
    where: 'Antsirabe',
    price: 'environ 9 600 Ar le repas',
    icon: 'food',
  },
  {
    name: "Parc de l'Isalo",
    kind: 'Activité',
    where: 'Ranohira',
    price: 'environ 55 000 Ar l’entrée',
    icon: 'nature',
  },
  {
    name: 'Location 4x4',
    kind: 'Loueur',
    where: 'Antananarivo',
    price: 'de 288 000 à 650 000 Ar la journée',
    icon: 'car',
  },
  {
    name: 'Guide du parc',
    kind: 'Guide',
    where: 'Ranohira',
    price: 'fourchette à la journée',
    icon: 'guide',
  },
  {
    name: 'Camp Catta',
    kind: 'Camping',
    where: 'Andringitra',
    price: 'environ 35 000 Ar la nuit',
    icon: 'tent',
  },
];

export async function DiscoverBand() {
  const t = await getTranslations('landing.discover');

  const filters = [
    t('allTypes'),
    'Hautes terres',
    'Sud RN7',
    'Antsirabe',
    t('nearby'),
  ];

  return (
    <Band ground="sand" id="discover">
      <Eyebrow>{t('eyebrow')}</Eyebrow>
      <BandTitle second={t('titleSecond')}>{t('title')}</BandTitle>
      <BandLead>{t('lead')}</BandLead>

      <div className="mt-8 flex flex-wrap gap-2">
        {filters.map((filter, index) => (
          <Chip key={filter} variant={index === 0 ? 'on' : 'default'}>
            {filter}
          </Chip>
        ))}
      </div>

      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {LISTINGS.map((listing) => (
          <li
            key={listing.name}
            className="bg-card border-border flex flex-col gap-3 rounded-2xl border p-5"
          >
            <span className="bg-primary-soft text-primary flex size-10 items-center justify-center rounded-xl">
              <ZebooIcon name={listing.icon} className="size-5" />
            </span>

            <div>
              <p className="font-heading text-base font-semibold">
                {listing.name}
              </p>
              <p className="text-muted-foreground font-sans text-xs">
                {listing.kind} · {listing.where}
              </p>
            </div>

            {/* the tariff is a bracket for this kind of service in this region, which is why it is worded as about and not as a price */}
            <p className="text-accent-ink font-sans text-sm font-semibold">
              {listing.price}
            </p>
          </li>
        ))}
      </ul>
    </Band>
  );
}

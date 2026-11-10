import { getTranslations } from 'next-intl/server';

import { ZebooIcon, type ZebooIconName } from '@/components/icons/zeboo-icons';
import { Card } from '@/components/ui/card';

import { Band, BandTitle, Eyebrow } from './band';

const MODES: { icon: ZebooIconName; title: string; body: string }[] = [
  { icon: 'car', title: 'ownTitle', body: 'ownBody' },
  { icon: 'route', title: 'carrierTitle', body: 'carrierBody' },
  { icon: 'key', title: 'rentalTitle', body: 'rentalBody' },
];

export async function TransportBand() {
  const t = await getTranslations('landing.transport');

  return (
    <Band id="transport">
      <Eyebrow>{t('eyebrow')}</Eyebrow>
      <BandTitle second={t('titleSecond')}>{t('title')}</BandTitle>

      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {MODES.map(({ icon, title, body }) => (
          <Card key={title} className="flex flex-col gap-4 p-6">
            <span className="bg-primary-soft text-primary flex size-10 items-center justify-center rounded-xl">
              <ZebooIcon name={icon} className="size-5" />
            </span>

            <h3 className="font-heading text-lg font-semibold">{t(title)}</h3>

            <p className="text-muted-foreground font-sans text-sm leading-relaxed">
              {t(body)}
            </p>
          </Card>
        ))}
      </div>
    </Band>
  );
}

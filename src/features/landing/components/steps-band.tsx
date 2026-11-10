import { getTranslations } from 'next-intl/server';

import { ZebooIcon, type ZebooIconName } from '@/components/icons/zeboo-icons';
import { Card } from '@/components/ui/card';

import { Band, BandLead, BandTitle, Eyebrow } from './band';

const STEPS: { icon: ZebooIconName; title: string; body: string }[] = [
  { icon: 'search', title: 'oneTitle', body: 'oneBody' },
  { icon: 'route', title: 'twoTitle', body: 'twoBody' },
  { icon: 'compass', title: 'threeTitle', body: 'threeBody' },
];

export async function StepsBand() {
  const t = await getTranslations('landing.steps');

  // an ordered list holds list items and nothing else, so each card sits inside one and fills it
  return (
    <Band>
      <Eyebrow>{t('eyebrow')}</Eyebrow>
      <BandTitle second={t('titleSecond')}>{t('title')}</BandTitle>
      <BandLead>{t('lead')}</BandLead>

      <ol className="mt-12 grid gap-5 md:grid-cols-3">
        {STEPS.map(({ icon, title, body }, index) => (
          <li key={title} className="flex">
            <Card className="flex flex-1 flex-col gap-4 p-6">
              <div className="flex items-center gap-3">
                <span className="bg-primary-soft text-primary font-heading flex size-9 items-center justify-center rounded-xl text-sm font-bold">
                  {index + 1}
                </span>
                <ZebooIcon name={icon} className="text-primary size-5" />
              </div>

              <h3 className="font-heading text-lg font-semibold">{t(title)}</h3>

              <p className="text-muted-foreground font-sans text-sm leading-relaxed">
                {t(body)}
              </p>
            </Card>
          </li>
        ))}
      </ol>
    </Band>
  );
}

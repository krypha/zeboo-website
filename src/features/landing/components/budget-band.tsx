import { getTranslations } from 'next-intl/server';

import { ZebooIcon } from '@/components/icons/zeboo-icons';

import { Band, BandLead, BandTitle, Eyebrow } from './band';
import { BudgetCounter } from './budget-counter';

export async function BudgetBand() {
  const t = await getTranslations('landing.budget');

  return (
    <Band ground="sand" id="budget">
      <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
        <div>
          <Eyebrow>{t('eyebrow')}</Eyebrow>
          <BandTitle second={t('titleSecond')}>{t('title')}</BandTitle>
          <BandLead>{t('lead')}</BandLead>

          <p className="text-muted-foreground mt-4 max-w-2xl font-sans text-sm leading-relaxed">
            {t('once')}
          </p>

          <p className="text-accent-ink mt-6 flex items-center gap-2 font-sans text-sm font-semibold">
            <ZebooIcon name="wallet" className="size-[18px]" />
            {t('indicative')}
          </p>
        </div>

        <BudgetCounter />
      </div>
    </Band>
  );
}

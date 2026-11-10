import { getTranslations } from 'next-intl/server';

import { ZebooIcon } from '@/components/icons/zeboo-icons';

import { RN7_DISTANCE_KM } from '../budget-scenario';

import { Band } from './band';

export async function RoadBand() {
  const t = await getTranslations('landing.road');

  const points = [t('pointOne'), t('pointTwo'), t('pointThree')];

  return (
    <Band ground="green" id="road">
      <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="text-deep-accent font-sans text-xs font-semibold tracking-[0.18em] uppercase">
            {t('eyebrow')}
          </p>

          <h2 className="font-heading mt-3 text-3xl leading-[1.08] font-extrabold tracking-[-0.03em] text-balance sm:text-4xl">
            {t('title')}
            <br />
            <span className="opacity-70">{t('titleSecond')}</span>
          </h2>

          <p className="mt-5 max-w-2xl font-sans text-base leading-relaxed opacity-85">
            {t('lead')}
          </p>

          <ul className="mt-8 flex flex-col gap-3">
            {points.map((point) => (
              <li key={point} className="flex items-start gap-3">
                <ZebooIcon
                  name="check"
                  className="text-deep-accent mt-0.5 size-[18px] shrink-0"
                />
                <span className="font-sans text-sm opacity-90">{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* the driving banner says the distance and the verb and nothing else: the instruction is read in the half second before a junction */}
        <div className="flex flex-col gap-4">
          <div className="bg-background text-foreground flex items-center gap-4 rounded-2xl p-5">
            <ZebooIcon
              name="chevron"
              className="text-primary size-8 shrink-0"
            />

            <div className="flex flex-col">
              <span className="font-heading text-xl font-extrabold tracking-[-0.02em]">
                {t('manoeuvreDistance')}
              </span>
              <span className="font-heading text-xl font-extrabold tracking-[-0.02em]">
                {t('manoeuvre')}
              </span>
            </div>
          </div>

          <div className="bg-background/10 flex items-center justify-between rounded-2xl px-5 py-4">
            <span className="font-heading text-lg font-bold">
              {t('remaining', { km: RN7_DISTANCE_KM })}
            </span>
            <span className="font-sans text-sm opacity-80">{t('towards')}</span>
          </div>
        </div>
      </div>
    </Band>
  );
}

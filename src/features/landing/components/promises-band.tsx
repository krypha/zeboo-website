import { getTranslations } from 'next-intl/server';

import { ZebooIcon, type ZebooIconName } from '@/components/icons/zeboo-icons';

import { Band, BandTitle, Eyebrow } from './band';

const PROMISES: { icon: ZebooIconName; title: string; body: string }[] = [
  { icon: 'wallet', title: 'oneTitle', body: 'oneBody' },
  { icon: 'shield', title: 'twoTitle', body: 'twoBody' },
  { icon: 'key', title: 'threeTitle', body: 'threeBody' },
  { icon: 'bulb', title: 'fourTitle', body: 'fourBody' },
];

export async function PromisesBand() {
  const t = await getTranslations('landing.promises');

  // a group in a description list holds its term and its description and nothing else, so the icon rides inside the term, set in the gutter the padding leaves
  return (
    <Band ground="sand">
      <Eyebrow>{t('eyebrow')}</Eyebrow>
      <BandTitle second={t('titleSecond')}>{t('title')}</BandTitle>

      <dl className="mt-12 grid gap-8 sm:grid-cols-2">
        {PROMISES.map(({ icon, title, body }) => (
          <div key={title} className="relative pl-14">
            <dt className="font-heading text-base font-semibold">
              <span
                aria-hidden="true"
                className="bg-card text-primary border-border absolute top-0 left-0 flex size-10 items-center justify-center rounded-xl border"
              >
                <ZebooIcon name={icon} className="size-5" />
              </span>
              {t(title)}
            </dt>
            <dd className="text-muted-foreground mt-1.5 font-sans text-sm leading-relaxed">
              {t(body)}
            </dd>
          </div>
        ))}
      </dl>
    </Band>
  );
}

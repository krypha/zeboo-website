import { getTranslations } from 'next-intl/server';

import { Band, BandTitle, Eyebrow } from './band';

// the page reads the same pairs for its structured data, so what a crawler is told is what a visitor reads
export const QUESTIONS = [
  ['oneQ', 'oneA'],
  ['twoQ', 'twoA'],
  ['threeQ', 'threeA'],
  ['fourQ', 'fourA'],
  ['fiveQ', 'fiveA'],
] as const;

export async function QuestionsBand() {
  const t = await getTranslations('landing.questions');

  return (
    <Band id="questions">
      <Eyebrow>{t('eyebrow')}</Eyebrow>
      <BandTitle second={t('titleSecond')}>{t('title')}</BandTitle>

      <dl className="mt-12 flex max-w-3xl flex-col">
        {QUESTIONS.map(([question, answer]) => (
          <div
            key={question}
            className="border-border border-b py-6 last:border-b-0"
          >
            <dt className="font-heading text-base font-semibold">
              {t(question)}
            </dt>
            <dd className="text-muted-foreground mt-2 font-sans text-sm leading-relaxed">
              {t(answer)}
            </dd>
          </div>
        ))}
      </dl>
    </Band>
  );
}

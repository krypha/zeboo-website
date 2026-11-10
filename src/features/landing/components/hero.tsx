import { getLocale, getTranslations } from 'next-intl/server';

import { ZebooIcon } from '@/components/icons/zeboo-icons';
import { Button } from '@/components/ui/button';
import { appLink } from '@/lib/app-link';

import { HeroBackdrop } from './hero-backdrop';

export async function Hero() {
  const t = await getTranslations('landing.hero');
  const locale = await getLocale();

  return (
    <section className="relative isolate overflow-hidden px-4 pt-14 pb-56 sm:pt-20 sm:pb-64 lg:pb-72">
      <HeroBackdrop />

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-start">
        <span className="bg-primary-soft text-primary rounded-full px-3.5 py-1.5 font-sans text-xs font-semibold tracking-wide">
          {t('mantra')}
        </span>

        <h1 className="font-heading mt-6 max-w-3xl text-4xl leading-[1.04] font-extrabold tracking-[-0.035em] text-balance sm:text-5xl lg:text-6xl">
          {t('title')}
          <br />
          <span className="text-primary">{t('titleSecond')}</span>
        </h1>

        <p className="text-muted-foreground mt-6 max-w-xl font-sans text-base leading-relaxed sm:text-lg">
          {t('lead')}
        </p>

        <div className="mt-9 flex flex-wrap items-center gap-3">
          <Button size="lg" asChild>
            <a href={appLink(locale, '/register')}>
              <ZebooIcon name="compass" />
              {t('start')}
            </a>
          </Button>

          <Button variant="outline" size="lg" asChild>
            <a href="#download">
              <ZebooIcon name="download" />
              {t('download')}
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}

import { getLocale, getTranslations } from 'next-intl/server';

import { ZebooIcon } from '@/components/icons/zeboo-icons';
import { Button } from '@/components/ui/button';
import { appLink } from '@/lib/app-link';

import { androidBuild, megabytes } from '../android-build';

import { Band } from './band';

export async function DownloadBand() {
  const t = await getTranslations('landing.download');
  const locale = await getLocale();
  const build = await androidBuild();

  return (
    <Band ground="green" id="download">
      <div className="flex flex-col items-start gap-6">
        <p className="text-deep-accent font-sans text-xs font-semibold tracking-[0.18em] uppercase">
          {t('eyebrow')}
        </p>

        <h2 className="font-heading text-3xl leading-[1.08] font-extrabold tracking-[-0.03em] text-balance sm:text-4xl">
          {t('title')}
        </h2>

        <p className="max-w-2xl font-sans text-base leading-relaxed opacity-85">
          {t('lead')}
        </p>

        <div className="mt-2 flex flex-wrap items-stretch gap-3">
          {/* the file is handed out only when one has actually been posted; until then the button would lead nowhere, so it says so instead */}
          {build ? (
            <Button variant="amber" size="lg" asChild>
              <a href="/app/zeboo.apk" download="zeboo.apk">
                <ZebooIcon name="download" />
                {t('android')}
                <span className="font-sans text-xs font-normal opacity-80">
                  {t('androidBuild', {
                    version: build.version,
                    size: megabytes(build.bytes),
                  })}
                </span>
              </a>
            </Button>
          ) : (
            <div className="bg-background/10 flex flex-col gap-1 rounded-xl px-5 py-4">
              <span className="font-heading flex items-center gap-2 text-sm font-semibold">
                <ZebooIcon name="download" className="size-4" />
                {t('android')} {t('androidNote')}
              </span>
              <span className="font-sans text-xs opacity-70">
                {t('androidSoon')}
              </span>
            </div>
          )}

          <div className="bg-background/10 flex flex-col gap-1 rounded-xl px-5 py-4">
            <span className="font-heading text-sm font-semibold">
              {t('ios')}
            </span>
            <span className="font-sans text-xs opacity-70">{t('iosNote')}</span>
          </div>
        </div>

        {/* an apk that comes from here and not from the play store needs a permission the traveller has to grant, and saying so beforehand is kinder than letting android refuse */}
        {build && (
          <p className="flex max-w-xl items-start gap-2 font-sans text-xs leading-relaxed opacity-75">
            <ZebooIcon name="bulb" className="mt-0.5 size-4 shrink-0" />
            {t('androidUnknownSource')}
          </p>
        )}

        {/* the third door, and the one that needs nothing installed */}
        <div className="border-background/20 mt-4 flex flex-wrap items-center gap-4 border-t pt-8">
          <span className="font-sans text-sm opacity-85">{t('web')}</span>

          <Button variant="amber" asChild>
            <a href={appLink(locale, '/register')}>{t('webAction')}</a>
          </Button>

          <Button
            variant="outline"
            asChild
            className="border-background/40 text-deep-foreground"
          >
            <a href={appLink(locale, '/login')}>{t('webSignIn')}</a>
          </Button>
        </div>
      </div>
    </Band>
  );
}

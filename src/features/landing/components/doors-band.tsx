import { getLocale, getTranslations } from 'next-intl/server';

import { ZebooIcon } from '@/components/icons/zeboo-icons';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { appLink } from '@/lib/app-link';

import { Band } from './band';

export async function DoorsBand() {
  const t = await getTranslations('landing.doors');
  const locale = await getLocale();

  return (
    <Band>
      <div className="grid gap-5 md:grid-cols-2">
        <Card className="flex flex-col gap-4 p-7">
          <ZebooIcon name="briefcase" className="text-primary size-6" />

          <h3 className="font-heading text-xl font-semibold">
            {t('agencyTitle')}
          </h3>

          <p className="text-muted-foreground font-sans text-sm leading-relaxed">
            {t('agencyBody')}
          </p>
        </Card>

        <Card className="flex flex-col items-start gap-4 p-7">
          <ZebooIcon name="cards" className="text-primary size-6" />

          <h3 className="font-heading text-xl font-semibold">
            {t('providerTitle')}
          </h3>

          <p className="text-muted-foreground font-sans text-sm leading-relaxed">
            {t('providerBody')}
          </p>

          <Button variant="outline" size="sm" asChild>
            <a href={appLink(locale, '/register')}>{t('providerAction')}</a>
          </Button>
        </Card>
      </div>
    </Band>
  );
}

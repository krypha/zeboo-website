'use client';

import { useLocale, useTranslations } from 'next-intl';

import { ZebooIcon } from '@/components/icons/zeboo-icons';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { usePathname, useRouter } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';

// every url carries its locale, so switching is a navigation to the same path in the other one and never a stored preference
export function LocaleSwitcher() {
  const t = useTranslations('locale');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          aria-label={t('label')}
          className="gap-1.5 px-2.5"
        >
          <ZebooIcon name="globe" className="size-[18px]" />
          <span className="font-sans text-xs font-semibold">
            {locale.toUpperCase()}
          </span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuRadioGroup
          value={locale}
          onValueChange={(next) => router.replace(pathname, { locale: next })}
        >
          {routing.locales.map((one) => (
            <DropdownMenuRadioItem key={one} value={one}>
              {t(one)}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

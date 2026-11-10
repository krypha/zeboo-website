'use client';

import { useTranslations } from 'next-intl';

import { useTheme } from 'next-themes';

import { ZebooIcon, type ZebooIconName } from '@/components/icons/zeboo-icons';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type Scheme = 'light' | 'dark' | 'system';

const CHOICES: { value: Scheme; icon: ZebooIconName }[] = [
  { value: 'light', icon: 'sun' },
  { value: 'dark', icon: 'moon' },
  { value: 'system', icon: 'globe' },
];

// the charter names one palette and the dark one is derived from it, so there is nothing to choose here but when to use which
export function AppearanceToggle() {
  const t = useTranslations('appearance');
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon-sm" aria-label={t('label')}>
          {/* which glyph shows is left to css: next-themes knows the mode on its first client render and the server does not, and picking it in javascript is a hydration mismatch, measured */}
          <ZebooIcon name="sun" className="size-[18px] dark:hidden" />
          <ZebooIcon name="moon" className="hidden size-[18px] dark:block" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuRadioGroup
          value={theme ?? 'system'}
          onValueChange={(next) => setTheme(next)}
        >
          {CHOICES.map(({ value, icon }) => (
            <DropdownMenuRadioItem key={value} value={value}>
              <ZebooIcon name={icon} className="size-4" />
              {t(value)}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils';

import { BrandMark } from './brand-mark';

// the wordmark was written out three times, once per auth page and once more in the landing, so it lives here
export function Brand({
  className,
  markClassName,
  wordClassName,
  tone = 'ink',
}: {
  className?: string;
  markClassName?: string;
  wordClassName?: string;
  tone?: 'ink' | 'light';
}) {
  return (
    <Link
      href="/"
      className={cn('flex items-center gap-2.5', className)}
      aria-label="Zeboo"
    >
      <BrandMark className={cn('size-8 shrink-0', markClassName)} />

      <span
        className={cn(
          'font-heading text-xl font-bold tracking-[-0.03em]',
          tone === 'light' ? 'text-primary-foreground' : 'text-primary',
          wordClassName,
        )}
      >
        Zeb<span className="text-accent">oo</span>
      </span>
    </Link>
  );
}

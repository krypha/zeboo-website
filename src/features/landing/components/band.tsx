import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

// the three grounds the page alternates between: ivory, sand, and a green panel that carries its own ink
type Ground = 'ivory' | 'sand' | 'green';

const GROUNDS: Record<Ground, string> = {
  ivory: 'bg-background text-foreground',
  sand: 'bg-secondary/55 text-foreground',
  green: 'bg-deep text-deep-foreground',
};

export function Band({
  children,
  ground = 'ivory',
  id,
  className,
}: {
  children: ReactNode;
  ground?: Ground;
  id?: string;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={cn(
        'scroll-mt-16 px-4 py-20 sm:py-24',
        GROUNDS[ground],
        className,
      )}
    >
      <div className="mx-auto w-full max-w-6xl">{children}</div>
    </section>
  );
}

// the amber ink and not the amber itself: pure amber on the ivory ground measures two to one, which is why the palette carries a darkened one for text
export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="text-accent-ink font-sans text-xs font-semibold tracking-[0.18em] uppercase">
      {children}
    </p>
  );
}

export function BandTitle({
  children,
  second,
}: {
  children: ReactNode;
  second?: ReactNode;
}) {
  return (
    <h2 className="font-heading mt-3 text-3xl leading-[1.08] font-extrabold tracking-[-0.03em] text-balance sm:text-4xl">
      {children}
      {second ? (
        <>
          <br />
          <span className="text-muted-foreground">{second}</span>
        </>
      ) : null}
    </h2>
  );
}

export function BandLead({ children }: { children: ReactNode }) {
  return (
    <p className="text-muted-foreground mt-5 max-w-2xl font-sans text-base leading-relaxed">
      {children}
    </p>
  );
}

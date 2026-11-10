'use client';

import { useState } from 'react';

import { useTranslations } from 'next-intl';

import { ZebooIcon } from '@/components/icons/zeboo-icons';
import { Button } from '@/components/ui/button';
import { budgetOf } from '@/features/itineraries/budget';
import { money } from '@/lib/money/format';

import { RN7_DISTANCE_KM, RN7_STOPS, RN7_TRANSPORT } from '../budget-scenario';

const MIN = 1;
const MAX = 8;

// the figures come from the engine the product itself counts with, so the page and the app can never say two different things
export function BudgetCounter() {
  const t = useTranslations('landing.budget');
  const [travellers, setTravellers] = useState(2);

  const budget = budgetOf(RN7_STOPS, travellers, RN7_TRANSPORT);
  const line = (name: string) =>
    budget.lines.find((one) => one.name === name)?.low ?? 0;

  const posts = [
    {
      label: t('lodging'),
      note: t('lodgingNote', { nights: RN7_STOPS[0].nights }),
      amount: line('Hébergement'),
    },
    {
      label: t('meals'),
      note: t('mealsNote', { meals: 3 }),
      amount: line('Repas'),
    },
    {
      label: t('entry'),
      note: t('entryNote'),
      amount: line("Parc de l'Isalo"),
    },
    {
      label: t('fuel'),
      note: t('fuelNote', { km: RN7_DISTANCE_KM }),
      amount: budget.transport?.low ?? 0,
    },
  ];

  return (
    <div className="bg-card border-border flex flex-col gap-5 rounded-2xl border p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={t('fewer')}
            disabled={travellers <= MIN}
            onClick={() => setTravellers((count) => Math.max(MIN, count - 1))}
          >
            <ZebooIcon name="minus" className="size-4" />
          </Button>

          <output className="font-heading min-w-28 text-center text-sm font-semibold">
            {t('party', { count: travellers })}
          </output>

          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={t('more')}
            disabled={travellers >= MAX}
            onClick={() => setTravellers((count) => Math.min(MAX, count + 1))}
          >
            <ZebooIcon name="plus" className="size-4" />
          </Button>
        </div>

        <span className="text-muted-foreground font-sans text-xs">
          {t('scenario')}
        </span>
      </div>

      <dl className="flex flex-col">
        {posts.map(({ label, note, amount }) => (
          <div
            key={label}
            className="border-border flex items-baseline justify-between gap-4 border-b py-3 last:border-b-0"
          >
            <dt className="flex flex-col">
              <span className="font-sans text-sm font-medium">{label}</span>
              <span className="text-muted-foreground font-sans text-xs">
                {note}
              </span>
            </dt>

            <dd className="font-heading text-sm font-semibold tabular-nums">
              {money(amount, budget.currency)}
            </dd>
          </div>
        ))}
      </dl>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-secondary/60 flex flex-col gap-1 rounded-xl p-4">
          <span className="text-muted-foreground font-sans text-xs tracking-wide uppercase">
            {t('total')}
          </span>
          <span className="font-heading text-xl font-extrabold tabular-nums">
            {money(budget.low, budget.currency)}
          </span>
        </div>

        {/* amber is the budget, systematically, and the share is the figure the whole page exists for */}
        <div className="bg-accent-soft flex flex-col gap-1 rounded-xl p-4">
          <span className="text-accent-ink font-sans text-xs tracking-wide uppercase">
            {t('perPerson')}
          </span>
          <span className="font-heading text-accent-ink text-xl font-extrabold tabular-nums">
            {money(budget.perPersonLow, budget.currency)}
          </span>
        </div>
      </div>
    </div>
  );
}

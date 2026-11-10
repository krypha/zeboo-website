import { budgetOf } from '@/features/itineraries/budget';

import { RN7_STOPS, RN7_TRANSPORT } from './budget-scenario';

const totals = (travellers: number) =>
  budgetOf(RN7_STOPS, travellers, RN7_TRANSPORT);

describe('the landing budget scenario', () => {
  // the figures the page carried as four constants, now read off the engine the product itself counts with: if these move, the page and the product stopped saying the same thing
  it('gives the three totals the page has always shown', () => {
    expect(totals(1).low).toBe(615_936);
    expect(totals(2).low).toBe(699_736);
    expect(totals(4).low).toBe(867_336);
  });

  it('divides once and at the end', () => {
    expect(totals(2).perPersonLow).toBe(349_868);
    expect(totals(4).perPersonLow).toBe(216_834);
  });

  // the whole point of the band: the total climbs while the share falls
  it('climbs the total and lowers the share as the party grows', () => {
    const [one, two, four] = [1, 2, 4].map(totals);

    expect(two.low).toBeGreaterThan(one.low);
    expect(four.low).toBeGreaterThan(two.low);
    expect(four.perPersonLow).toBeLessThan(two.perPersonLow);
  });

  // a room and a vehicle are shared, a meal and an entry bought one per head, which is the rule the band exists to show
  it('shares the room and the fuel, and counts the meal and the entry per head', () => {
    const budget = totals(2);
    const by = (name: string) =>
      budget.lines.find((line) => line.name === name);

    expect(by('Hébergement')?.rule).toBe('shared');
    expect(by('Hébergement')?.low).toBe(240_000);
    expect(by('Repas')?.rule).toBe('perHead');
    expect(by('Repas')?.low).toBe(57_600);
    expect(by("Parc de l'Isalo")?.rule).toBe('perHead');
    expect(by("Parc de l'Isalo")?.low).toBe(110_000);
    expect(budget.transport?.rule).toBe('shared');
    expect(budget.transport?.low).toBe(292_136);
  });

  // every tariff on the band is a regional bracket, so the band has to say so rather than let the figure pass for a quote
  it('says the figures are indicative', () => {
    expect(totals(2).indicative).toBe(true);
    expect(totals(2).uncounted).toBe(0);
  });
});

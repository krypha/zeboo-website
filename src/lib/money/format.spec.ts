import { money, moneyRange } from './format';

// the unit and the groups are both joined by a no break space, so an amount never splits across two lines
const NB = ' ';

describe('money', () => {
  // grouped by hand rather than through intl, so the figure reads the same whatever the browser
  it('groups the thousands', () => {
    expect(money(699736, 'MGA')).toBe(`699${NB}736${NB}Ar`);
    expect(money(240000, 'MGA')).toBe(`240${NB}000${NB}Ar`);
    expect(money(900, 'MGA')).toBe(`900${NB}Ar`);
  });

  it('names the euro by its own sign', () => {
    expect(money(620, 'EUR')).toBe(`620${NB}€`);
  });

  // whole units and never cents: the ariary has no subdivision anybody quotes
  it('rounds to the whole unit', () => {
    expect(money(45000.6, 'MGA')).toBe(`45${NB}001${NB}Ar`);
  });
});

describe('moneyRange', () => {
  it('reads as a bracket, which is what an indicative tariff is', () => {
    expect(moneyRange(45000, 75000, 'MGA')).toBe(
      `45${NB}000 à 75${NB}000${NB}Ar`,
    );
  });

  // a range whose ends meet is one figure, not the same number twice
  it('collapses when the two ends are equal', () => {
    expect(moneyRange(45000, 45000, 'MGA')).toBe(`45${NB}000${NB}Ar`);
    expect(moneyRange(45000, 10000, 'MGA')).toBe(`45${NB}000${NB}Ar`);
  });
});

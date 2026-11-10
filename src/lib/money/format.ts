// an amount never splits across two lines, so every space inside one is a no break space, written as an escape because the lint rules refuse the raw character
const NBSP = '\u00a0';

// grouped by hand rather than through intl, which hermes ships without on some builds and which would format differently per device
function grouped(amount: number): string {
  return String(Math.round(amount)).replace(/\B(?=(\d{3})+(?!\d))/g, NBSP);
}

// whole units and never cents: the catalogue publishes indicative ranges, and the ariary has no subdivision anybody quotes
export function money(amount: number, currency: string): string {
  return currency === 'EUR'
    ? `${grouped(amount)}${NBSP}€`
    : `${grouped(amount)}${NBSP}Ar`;
}

// a range rather than an amount, which is what an indicative tariff is; the two collapse into one figure when they are equal, and the word between them is passed in because the web reads in two languages where the phone reads in one
export function moneyRange(
  low: number,
  high: number,
  currency: string,
  join = 'à',
): string {
  return high > low
    ? `${grouped(low)} ${join} ${money(high, currency)}`
    : money(low, currency);
}

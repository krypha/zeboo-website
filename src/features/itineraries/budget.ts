import { moneyRange } from '@/lib/money/format';

import type { ItineraryDetail, ItineraryStep } from './api/itineraries.types';

type Unit = ItineraryStep['items'][number]['place']['price']['unit'];

// the least a choice has to be for the arithmetic to work, so one being assembled in the create form counts exactly as one the api already holds
type StepPlace = ItineraryStep['items'][number]['place'];

export interface BudgetChoice {
  id: string;
  quantity: number;
  place: StepPlace;
}

// a stop is what the nights belong to, and a lodging underneath counts them rather than a quantity of its own
export interface BudgetStop {
  id: string;
  nights: number;
  items: readonly BudgetChoice[];
}

// the two classes the written rules reduce to: a room and a vehicle are shared between travellers, a meal and an entry are bought one per head
export type BudgetRule = 'shared' | 'perHead';

// taken from the unit the catalogue publishes rather than guessed from the category, and typed off the contract so a unit the api adds stops compiling here instead of silently counting as a shared one
const RULES: Record<Unit, BudgetRule> = {
  NIGHT: 'shared',
  DAY: 'shared',
  MEAL: 'perHead',
  PERSON: 'perHead',
  ENTRY: 'perHead',
};

// what the column defaults to, and the only sensible answer for an itinerary that holds nothing yet
const BASE_CURRENCY = 'MGA';

export interface BudgetLine {
  stopId: string;
  choiceId: string;
  name: string;
  rule: BudgetRule;
  quantity: number;
  unit: Unit;
  // a floor and a ceiling, an indicative tariff being a range rather than an amount; the two are equal where the catalogue gives one figure
  low: number;
  high: number;
  indicative: boolean;
  // the currency this tariff was published in, which is not always the one the total is counted in
  currency: string;
  counted: boolean;
}

export interface Budget {
  currency: string;
  low: number;
  high: number;
  perPersonLow: number;
  perPersonHigh: number;
  lines: BudgetLine[];
  // true as soon as one counted line comes from a regional range, which the screen has to say rather than let the figure pass for a quote
  indicative: boolean;
  // choices left out because their tariff is published in another currency, said plainly rather than converted at a rate nobody maintains
  uncounted: number;
  // absent until the traveller says how they move between the stops
  transport: TransportLine | null;
}

// the currency most of the choices are published in, a tie going to the earliest since a map keeps its insertion order; adding ariary to euros would be wrong by a factor of several thousand and nothing on screen would show it
function mainCurrency(stops: readonly BudgetStop[]): string {
  const held = new Map<string, number>();

  for (const stop of stops) {
    for (const choice of stop.items) {
      const { currency } = choice.place.price;
      held.set(currency, (held.get(currency) ?? 0) + 1);
    }
  }

  let best = BASE_CURRENCY;
  let most = 0;

  for (const [currency, count] of held) {
    if (count > most) {
      best = currency;
      most = count;
    }
  }

  return best;
}

function lineOf(
  stop: BudgetStop,
  choice: BudgetChoice,
  heads: number,
  currency: string,
): BudgetLine {
  const { price } = choice.place;
  const rule = RULES[price.unit];
  // the generated schema makes a nullable field optional too, and a harvested range is not always the right way round, so the ceiling is settled once here
  const to = typeof price.to === 'number' ? price.to : price.from;
  // a lodging counts the nights of the stop it sits under rather than a quantity of its own, which is what two nights at one hotel means and what the guide writes
  const quantity = price.unit === 'NIGHT' ? stop.nights : choice.quantity;
  const times = rule === 'perHead' ? quantity * heads : quantity;

  return {
    stopId: stop.id,
    choiceId: choice.id,
    name: choice.place.name,
    rule,
    quantity,
    unit: price.unit,
    // a tariff of zero is a price and not a missing one: a viewpoint or a public garden charges nothing, and two hundred and twenty four of the catalogue's activities are exactly that
    low: price.from * times,
    high: Math.max(price.from, to) * times,
    indicative: price.source === 'BASELINE',
    currency: price.currency,
    counted: price.currency === currency,
  };
}

// pure, so the figures move with the stepper rather than with a round trip, and so every rule can be proved one line at a time
export function budgetOf(
  stops: readonly BudgetStop[],
  travellers: number,
  transport?: BudgetTransport | null,
): Budget {
  const heads = Math.max(1, travellers);
  const currency = mainCurrency(stops);

  const lines = stops.flatMap((stop) =>
    stop.items.map((choice) => lineOf(stop, choice, heads, currency)),
  );
  const counted = lines.filter((line) => line.counted);

  const moving = transport
    ? transportLine(transport, stops, heads, currency)
    : null;

  // a transport published in another currency stays out of the sum for the same reason a choice does
  const counts = moving !== null && moving.currency === currency;

  const low =
    counted.reduce((total, line) => total + line.low, 0) +
    (counts ? moving.low : 0);
  const high =
    counted.reduce((total, line) => total + line.high, 0) +
    (counts ? moving.high : 0);

  return {
    currency,
    low,
    high,
    // divided once and at the end, never poste by poste, so the figure can never drift from the total it came from
    perPersonLow: Math.round(low / heads),
    perPersonHigh: Math.round(high / heads),
    lines,
    indicative: counted.some((line) => line.indicative),
    uncounted:
      lines.length - counted.length + (moving !== null && !counts ? 1 : 0),
    transport: moving,
  };
}

export function showBudget(budget: Budget, join?: string): string {
  return moneyRange(budget.low, budget.high, budget.currency, join);
}

export function showPerPerson(budget: Budget, join?: string): string {
  return moneyRange(
    budget.perPersonLow,
    budget.perPersonHigh,
    budget.currency,
    join,
  );
}

export function showLine(line: BudgetLine, join?: string): string {
  return moneyRange(line.low, line.high, line.currency, join);
}

export type TransportMode = NonNullable<ItineraryDetail['transport']>['mode'];

type Carrier = NonNullable<
  NonNullable<ItineraryDetail['transport']>['carrier']
>;

// everything the transport of a trip costs is counted from these, and nothing here is guessed: the distance comes from the road, the fuel price from the api, the fares from the lines a company publishes
export interface BudgetTransport {
  mode: TransportMode;
  consumption: number | null;
  fuelPricePerLitre: number;
  // the road through the stops, in kilometres, or nothing while it is still being asked for
  distanceKm: number | null;
  rentalPlace: StepPlace | null;
  carrier: Carrier | null;
  // the towns the trip passes through, in order, which is what a carrier line is matched against
  towns: readonly string[];
}

export interface TransportLine {
  mode: TransportMode;
  rule: BudgetRule;
  low: number;
  high: number;
  currency: string;
  // legs of the road no known line covers, left out of the figure rather than guessed at
  uncovered: number;
  // true while the road is still being asked for, so a screen says it is counting rather than showing a figure that is about to move
  waiting: boolean;
}

// litres per hundred kilometres is what a traveller reads off their own dashboard, so the hundred is divided here and nowhere else
function fuelCost(transport: BudgetTransport): number {
  if (transport.distanceKm === null || transport.consumption === null) return 0;

  return Math.round(
    (transport.distanceKm *
      transport.consumption *
      transport.fuelPricePerLitre) /
      100,
  );
}

// the consecutive pairs a trip is made of, which is what a carrier line is matched against
export function legsOf(towns: readonly string[]): [string, string][] {
  return towns
    .slice(1)
    .map((to, at): [string, string] => [towns[at], to])
    .filter(([from, to]) => from !== to);
}

// a line is the same line whichever way it is driven, so a leg matches either way round; exported because the list a traveller is shown and the figure they are given have to agree on what serving a line means
export function servesLeg(carrier: Carrier, from: string, to: string): boolean {
  return carrier.routes.some(
    (route) =>
      (route.fromTown.name === from && route.toTown.name === to) ||
      (route.fromTown.name === to && route.toTown.name === from),
  );
}

// true as soon as one leg of the trip is covered, which is what makes a company worth showing at all
export function servesAnyLeg(
  carrier: Carrier,
  towns: readonly string[],
): boolean {
  return legsOf(towns).some(([from, to]) => servesLeg(carrier, from, to));
}

function fareFor(
  carrier: Carrier,
  from: string,
  to: string,
): { low: number; high: number } | null {
  const line = carrier.routes.find(
    (route) =>
      (route.fromTown.name === from && route.toTown.name === to) ||
      (route.fromTown.name === to && route.toTown.name === from),
  );

  if (!line || typeof line.fareFrom !== 'number') return null;

  return { low: line.fareFrom, high: line.fareTo ?? line.fareFrom };
}

function transportLine(
  transport: BudgetTransport,
  stops: readonly BudgetStop[],
  heads: number,
  currency: string,
): TransportLine {
  const days = stops.reduce(
    (total, stop) => total + Math.max(1, stop.nights),
    0,
  );

  if (transport.mode === 'OWN_VEHICLE') {
    const cost = fuelCost(transport);

    return {
      mode: transport.mode,
      rule: 'shared',
      low: cost,
      high: cost,
      currency,
      uncovered: 0,
      waiting: transport.distanceKm === null && transport.consumption !== null,
    };
  }

  if (transport.mode === 'RENTAL') {
    const price = transport.rentalPlace?.price;
    const to = typeof price?.to === 'number' ? price.to : (price?.from ?? 0);

    return {
      mode: transport.mode,
      rule: 'shared',
      low: (price?.from ?? 0) * days,
      high: Math.max(price?.from ?? 0, to) * days,
      currency: price?.currency ?? currency,
      uncovered: 0,
      waiting: false,
    };
  }

  // a fare is bought per seat, so it is the one transport that grows with the party
  let low = 0;
  let high = 0;
  let uncovered = 0;

  for (let at = 1; at < transport.towns.length; at += 1) {
    const fare = transport.carrier
      ? fareFor(transport.carrier, transport.towns[at - 1], transport.towns[at])
      : null;

    if (!fare) {
      uncovered += 1;
      continue;
    }

    low += fare.low * heads;
    high += fare.high * heads;
  }

  return {
    mode: transport.mode,
    rule: 'perHead',
    low,
    high,
    currency,
    uncovered,
    waiting: false,
  };
}

import type { ItineraryStep } from './api/itineraries.types';
import {
  budgetOf,
  showBudget,
  showLine,
  showPerPerson,
  type BudgetChoice,
  type BudgetLine,
  type BudgetStop,
} from './budget';

type Price = ItineraryStep['items'][number]['place']['price'];

let serial = 0;

// only the tariff and the quantity matter to the engine, so the rest of a catalogue entry is filled in once and never looked at again
function choice(
  price: Partial<Price> & Pick<Price, 'unit'>,
  quantity = 1,
  name = 'Une fiche',
): BudgetChoice {
  serial += 1;

  return {
    id: `choice-${String(serial)}`,
    quantity,
    place: {
      id: `place-${String(serial)}`,
      name,
      category: 'LODGING',
      subtype: null,
      latitude: -18.8792,
      longitude: 47.5079,
      region: 'HIGHLANDS',
      city: null,
      cityDistanceM: null,
      image: null,
      price: {
        from: 0,
        to: null,
        currency: 'MGA',
        level: null,
        source: 'SITE',
        url: null,
        checkedAt: null,
        ...price,
      },
    },
  };
}

// a stop is what the nights belong to, so a spec that cares only about one choice wraps it in a stop of its own
function stop(items: BudgetChoice[], nights = 1): BudgetStop {
  serial += 1;

  return { id: `stop-${String(serial)}`, nights, items };
}

// one stop holding one choice, which is how most of these rules are read one at a time
const alone = (one: BudgetChoice, nights = 1) => [stop([one], nights)];

const room = (from: number, nights: number) =>
  alone(choice({ from, unit: 'NIGHT' }, 1, 'Couleur Café'), nights);

const meal = (from: number, meals: number) =>
  alone(choice({ from, unit: 'MEAL' }, meals, 'Chez Mariette'));

const car = (from: number, days: number) =>
  alone(choice({ from, unit: 'DAY' }, days, '4x4 avec chauffeur'));

function ruleOf(line: BudgetLine | undefined) {
  return line?.rule;
}

describe('budgetOf, the rules poste by poste', () => {
  // a room is shared: the total does not move with the party, only the share each traveller carries does
  it('counts a night once however many travellers sleep in it', () => {
    const two = budgetOf(room(120000, 2), 2);
    const four = budgetOf(room(120000, 2), 4);

    expect(two.low).toBe(240000);
    expect(four.low).toBe(240000);
    expect(two.perPersonLow).toBe(120000);
    expect(four.perPersonLow).toBe(60000);
  });

  // a meal is bought per head: the share each traveller carries does not move, the total does
  it('multiplies a meal by the party, leaving the share each one pays alone', () => {
    const two = budgetOf(meal(9600, 3), 2);
    const four = budgetOf(meal(9600, 3), 4);

    expect(two.low).toBe(57600);
    expect(four.low).toBe(115200);
    expect(two.perPersonLow).toBe(28800);
    expect(four.perPersonLow).toBe(28800);
  });

  // two nights at one hotel is one choice and two nights, never two choices, so the lodging reads the nights of the stop it sits under
  it('counts a lodging on the nights of its stop, not on its own quantity', () => {
    const stops = [
      stop([choice({ from: 65000, unit: 'NIGHT' }, 1, 'Couleur Café')], 3),
    ];

    const budget = budgetOf(stops, 2);

    expect(budget.lines[0]?.quantity).toBe(3);
    expect(budget.low).toBe(195000);
  });

  // a stop passed through for lunch is slept nowhere, so a lodging left on it charges nothing rather than a night nobody spent
  it('charges no night at a stop nobody sleeps at', () => {
    const stops = [
      stop([choice({ from: 65000, unit: 'NIGHT' }, 4, 'Couleur Café')], 0),
    ];

    expect(budgetOf(stops, 2).low).toBe(0);
  });

  it.each([
    ['a night, which is a room', 'NIGHT', 'shared'],
    ['a day, which is a vehicle', 'DAY', 'shared'],
    ['a meal', 'MEAL', 'perHead'],
    ['an entry', 'ENTRY', 'perHead'],
    ['a head, where the catalogue says so outright', 'PERSON', 'perHead'],
  ] as const)(
    'reads %s off the unit the catalogue publishes',
    (_label, unit, rule) => {
      const budget = budgetOf(alone(choice({ from: 1000, unit }, 1)), 2);

      expect(ruleOf(budget.lines[0])).toBe(rule);
    },
  );

  // the vehicle with a driver is the argument the concept makes: it looks dear alone and reasonable together, which only shows if the total is left whole
  it('never divides a poste, the share being taken from the total at the end', () => {
    const budget = budgetOf(car(326000, 2), 2);

    expect(budget.lines[0]?.low).toBe(652000);
    expect(budget.low).toBe(652000);
    expect(budget.perPersonLow).toBe(326000);
  });

  it('adds the two classes together, which is the whole arithmetic', () => {
    const stops = [
      stop(
        [
          choice({ from: 120000, unit: 'NIGHT' }, 1, 'Couleur Café'),
          choice({ from: 9600, unit: 'MEAL' }, 3, 'Chez Mariette'),
          choice({ from: 55000, unit: 'ENTRY' }, 1, 'Isalo'),
        ],
        2,
      ),
    ];

    const two = budgetOf(stops, 2);
    const four = budgetOf(stops, 4);

    // 240 000 shared over two nights, 57 600 of meals, 110 000 of entries
    expect(two.low).toBe(407600);
    // 120 000 of room per head, 28 800 of meals, 55 000 of entry
    expect(two.perPersonLow).toBe(203800);

    // the room does not move, the meals and the entries double
    expect(four.low).toBe(575200);
    expect(four.perPersonLow).toBe(143800);
  });

  // a trip is a list of stops, and the figure is the sum over all of them rather than over one
  it('adds every stop of the trip together', () => {
    const stops = [
      stop([choice({ from: 120000, unit: 'NIGHT' }, 1)], 2),
      stop([choice({ from: 9600, unit: 'MEAL' }, 3)], 1),
    ];

    expect(budgetOf(stops, 2).low).toBe(240000 + 57600);
  });

  it('holds an itinerary with no stop at zero rather than at nothing', () => {
    const budget = budgetOf([], 2);

    expect(budget).toMatchObject({
      low: 0,
      high: 0,
      perPersonLow: 0,
      currency: 'MGA',
      uncounted: 0,
      indicative: false,
    });
  });

  it('holds a stop with no choice at zero too', () => {
    expect(budgetOf([stop([], 2)], 2).low).toBe(0);
  });

  // a party of nobody is not a party, and dividing by it would hand the screen an infinity
  it('counts at least one traveller, whatever it is handed', () => {
    expect(budgetOf(room(120000, 1), 0).perPersonLow).toBe(120000);
    expect(budgetOf(room(120000, 1), -3).perPersonLow).toBe(120000);
  });

  // the arrondi happens once, at the end, so the share times the party can land just under the total
  it('rounds the share once rather than poste by poste', () => {
    const budget = budgetOf(room(100000, 1), 3);

    expect(budget.low).toBe(100000);
    expect(budget.perPersonLow).toBe(33333);
  });
});

describe('budgetOf, what it refuses to pretend', () => {
  // a tariff of zero is a price: two hundred and twenty four of the catalogue's activities are free to walk into
  it('counts a free entry as free rather than as unknown', () => {
    const stops = [
      stop(
        [
          choice({ from: 0, unit: 'ENTRY' }, 1, 'Arboretum'),
          choice({ from: 120000, unit: 'NIGHT' }, 1, 'Couleur Café'),
        ],
        1,
      ),
    ];

    const budget = budgetOf(stops, 2);

    expect(budget.low).toBe(120000);
    expect(budget.uncounted).toBe(0);
    expect(budget.lines[0]?.low).toBe(0);
  });

  it('carries a floor and a ceiling, an indicative tariff being a range', () => {
    const budget = budgetOf(
      alone(choice({ from: 65000, to: 90000, unit: 'NIGHT' }), 2),
      2,
    );

    expect(budget.low).toBe(130000);
    expect(budget.high).toBe(180000);
    expect(budget.perPersonLow).toBe(65000);
    expect(budget.perPersonHigh).toBe(90000);
  });

  it('puts a range the wrong way round back the right way', () => {
    const budget = budgetOf(
      alone(choice({ from: 90000, to: 65000, unit: 'NIGHT' })),
      1,
    );

    expect(budget.low).toBe(90000);
    expect(budget.high).toBe(90000);
  });

  it('says so as soon as one counted line comes from a regional range', () => {
    const firm = budgetOf(alone(choice({ from: 1000, unit: 'NIGHT' })), 2);
    const ranged = budgetOf(
      alone(choice({ from: 1000, source: 'BASELINE', unit: 'NIGHT' })),
      2,
    );

    expect(firm.indicative).toBe(false);
    expect(ranged.indicative).toBe(true);
  });

  // adding ariary to euros at a hardcoded rate would be wrong by a factor of several thousand, and nothing on the screen would show it
  it('leaves a tariff in another currency out of the figure, and counts it', () => {
    const stops = [
      stop(
        [
          choice({ from: 120000, unit: 'NIGHT' }),
          choice({ from: 9600, unit: 'MEAL' }, 1),
          choice({ from: 250, currency: 'EUR', unit: 'PERSON' }, 1),
        ],
        2,
      ),
    ];

    const budget = budgetOf(stops, 2);

    expect(budget.currency).toBe('MGA');
    expect(budget.low).toBe(240000 + 19200);
    expect(budget.uncounted).toBe(1);
    expect(budget.lines[2]?.counted).toBe(false);
  });

  it('counts in the currency most of the choices use, not the first one', () => {
    const stops = [
      stop(
        [
          choice({ from: 250, currency: 'EUR', unit: 'PERSON' }),
          choice({ from: 120000, unit: 'NIGHT' }),
          choice({ from: 9600, unit: 'MEAL' }),
        ],
        1,
      ),
    ];

    const budget = budgetOf(stops, 1);

    expect(budget.currency).toBe('MGA');
    expect(budget.uncounted).toBe(1);
  });

  it('breaks a tie on the earliest choice rather than on an alphabet', () => {
    const stops = [
      stop(
        [
          choice({ from: 250, currency: 'EUR', unit: 'PERSON' }),
          choice({ from: 120000, unit: 'NIGHT' }),
        ],
        1,
      ),
    ];

    const budget = budgetOf(stops, 1);

    expect(budget.currency).toBe('EUR');
    expect(budget.low).toBe(250);
  });

  // a range nobody is counting must not make the figure look like a guess
  it('ignores a range that was left out when it says it is indicative', () => {
    const stops = [
      stop(
        [
          choice({ from: 120000, unit: 'NIGHT' }),
          choice({
            from: 250,
            currency: 'EUR',
            source: 'BASELINE',
            unit: 'PERSON',
          }),
        ],
        1,
      ),
    ];

    const budget = budgetOf(stops, 1);

    expect(budget.indicative).toBe(false);
    expect(budget.uncounted).toBe(1);
  });
});

describe('what the screen reads', () => {
  it('collapses a range into one figure when the two ends meet', () => {
    expect(showBudget(budgetOf(room(120000, 2), 2))).toBe(
      '240\u00a0000\u00a0Ar',
    );
  });

  it('shows both ends when the tariffs behind it are ranges', () => {
    const budget = budgetOf(
      alone(choice({ from: 65000, to: 90000, unit: 'NIGHT' }), 2),
      2,
    );

    expect(showBudget(budget)).toBe('130\u00a0000 à 180\u00a0000\u00a0Ar');
    expect(showPerPerson(budget)).toBe('65\u00a0000 à 90\u00a0000\u00a0Ar');
  });

  it('shows a line in the currency it was published in', () => {
    const budget = budgetOf(
      alone(choice({ from: 250, currency: 'EUR', unit: 'PERSON' }, 1)),
      2,
    );

    expect(showLine(budget.lines[0])).toBe('500\u00a0€');
  });
});

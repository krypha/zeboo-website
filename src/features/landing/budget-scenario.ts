import type {
  BudgetStop,
  BudgetTransport,
} from '@/features/itineraries/budget';
import type { DiscoverPlace } from '@/features/places/api/places.types';

// the five nights, the three meals a day and the one entry the budget band has always shown, written as the engine's own shape rather than as four constants beside it
const NIGHTS = 5;
const NIGHT_PRICE = 48_000;
const MEALS = 3;
const MEAL_PRICE = 9_600;
const ENTRY_PRICE = 55_000;

// the road from antananarivo to ranohira, the consumption a traveller reads off their own dashboard, and the price the api serves from the one place it lives
export const RN7_DISTANCE_KM = 689;
export const RN7_CONSUMPTION = 8;
export const RN7_FUEL_PRICE = 5_300;

const CURRENCY = 'MGA';

// every tariff here is a regional bracket, which is what the band says of itself
function place(
  name: string,
  from: number,
  unit: DiscoverPlace['price']['unit'],
): DiscoverPlace {
  return {
    id: name,
    name,
    category: 'OTHER',
    subtype: null,
    latitude: -22.55,
    longitude: 45.4,
    region: 'SOUTH_RN7',
    city: 'Ranohira',
    cityDistanceM: null,
    image: null,
    price: {
      from,
      to: null,
      currency: CURRENCY,
      unit,
      level: null,
      source: 'BASELINE',
      url: null,
      checkedAt: null,
    },
  };
}

// one stop, because the band shows one budget and not an itinerary: what it proves is the rule, a room shared and a meal per head
export const RN7_STOPS: readonly BudgetStop[] = [
  {
    id: 'rn7',
    nights: NIGHTS,
    items: [
      {
        id: 'lodging',
        quantity: 1,
        place: place('Hébergement', NIGHT_PRICE, 'NIGHT'),
      },
      {
        id: 'meals',
        quantity: MEALS,
        place: place('Repas', MEAL_PRICE, 'MEAL'),
      },
      {
        id: 'isalo',
        quantity: 1,
        place: place("Parc de l'Isalo", ENTRY_PRICE, 'ENTRY'),
      },
    ],
  },
];

export const RN7_TRANSPORT: BudgetTransport = {
  mode: 'OWN_VEHICLE',
  consumption: RN7_CONSUMPTION,
  fuelPricePerLitre: RN7_FUEL_PRICE,
  distanceKm: RN7_DISTANCE_KM,
  rentalPlace: null,
  carrier: null,
  towns: ['Antananarivo', 'Ranohira'],
};

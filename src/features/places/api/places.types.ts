// the site calls no api, so the one place shape the copied budget engine reads is written out here, transcribed from the web's generated contract, the discovered place and its price, rather than generated from a backend this repo never talks to
export type PlaceCategory =
  | 'LODGING'
  | 'DINING'
  | 'POOL'
  | 'EVENT'
  | 'NATURE'
  | 'WATER'
  | 'HIKING'
  | 'SPORT'
  | 'HERITAGE'
  | 'CAMPING'
  | 'RENTAL'
  | 'OTHER';

export type Region =
  'HIGHLANDS' | 'NORTH' | 'EAST' | 'SOUTH_EAST' | 'SOUTH_RN7' | 'WEST';

export interface PlacePrice {
  from: number;
  to?: number | null;
  currency: string;
  unit: 'NIGHT' | 'MEAL' | 'DAY' | 'ENTRY' | 'PERSON';
  level?: 'BUDGET' | 'COMFORT' | 'PREMIUM' | null;
  source:
    'OFFICIAL' | 'SITE' | 'MANUAL' | 'BASELINE' | 'PROVIDER' | 'TRAVELLER';
  url?: string | null;
  checkedAt?: string | null;
}

export interface DiscoverPlace {
  id: string;
  name: string;
  category: PlaceCategory;
  subtype?: string | null;
  latitude: number;
  longitude: number;
  region: Region;
  city?: string | null;
  cityDistanceM?: number | null;
  image?: string | null;
  price: PlacePrice;
  distanceM?: number | null;
}

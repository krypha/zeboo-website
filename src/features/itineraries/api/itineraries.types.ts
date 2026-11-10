import type { DiscoverPlace, Region } from '@/features/places/api/places.types';

// the trip shapes the copied budget engine and its spec read, transcribed from the web's generated contract, the itinerary detail and what it holds, so budget.ts stays the same file in both repos
interface Town {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  region: Region;
  photoUrl?: string | null;
  photoAuthor?: string | null;
  photoLicence?: string | null;
}

interface StepItem {
  id: string;
  position: number;
  quantity: number;
  place: DiscoverPlace;
}

export interface ItineraryStep {
  id: string;
  position: number;
  nights: number;
  firstDay: number;
  lastDay: number;
  town: Town;
  items: StepItem[];
}

interface CarrierRoute {
  id: string;
  fromTown: Town;
  toTown: Town;
  fareFrom?: number | null;
  fareTo?: number | null;
  currency: string;
  minutes?: number | null;
  source?: string | null;
  checkedAt?: string | null;
}

interface Carrier {
  id: string;
  name: string;
  homeTown?: Town | null;
  website?: string | null;
  classes: string[];
  verified: boolean;
  routes: CarrierRoute[];
}

interface Transport {
  mode: 'OWN_VEHICLE' | 'CARRIER' | 'RENTAL';
  vehicleType?: 'CAR' | 'MOTORCYCLE' | 'FOUR_BY_FOUR' | 'VAN' | null;
  consumption?: number | null;
  rentalPlace?: DiscoverPlace | null;
  carrier?: Carrier | null;
}

interface Endpoint {
  name: string;
  latitude: number;
  longitude: number;
}

export interface ItineraryDetail {
  id: string;
  title: string;
  travellerCount: number;
  startDate: string | null;
  start: Endpoint | null;
  end: Endpoint | null;
  stepCount: number;
  createdAt: string;
  updatedAt: string;
  steps: ItineraryStep[];
  transport?: Transport | null;
}

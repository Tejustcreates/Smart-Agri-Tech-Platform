export type EquipmentTab = 'find' | 'register';

export type EquipmentCategory =
  | 'Tractor' | 'Harvester' | 'Rotavator' | 'Seeder' | 'Sprayer'
  | 'Cultivator' | 'Thresher' | 'Plough' | 'Others';

export type EquipmentCondition = 'Excellent' | 'Good' | 'Average';

export type AvailabilityFilter = 'today' | 'tomorrow' | 'this-week' | 'any';

export interface EquipmentListing {
  id: string;
  name: string;
  category: EquipmentCategory;
  brand: string;
  model: string;
  horsepower: number;
  year: number;
  condition: EquipmentCondition;
  image: string;
  images: string[];
  pricePerDay: number;
  pricePerHour: number;
  deposit: number;
  fuelIncluded: boolean;
  operatorIncluded: boolean;
  minRental: string;
  availability: string[];
  ownerName: string;
  ownerPhone: string;
  village: string;
  taluka: string;
  district: string;
  state: string;
  lat: number;
  lng: number;
  distance: number;
  rating: number;
  reviewCount: number;
  verified: boolean;
  featured: boolean;
  recentlyAdded: boolean;
  lowPrice: boolean;
  matchScore: number;
  description: string;
}

export interface SearchFilters {
  location: string;
  lat: number;
  lng: number;
  radius: number;
  category: string;
  availability: AvailabilityFilter;
  maxBudget: number;
}

export interface RegistrationForm {
  ownerName: string;
  phone: string;
  village: string;
  taluka: string;
  district: string;
  state: string;
  lat: number;
  lng: number;
  equipmentName: string;
  category: EquipmentCategory | '';
  brand: string;
  model: string;
  horsepower: string;
  year: string;
  condition: EquipmentCondition | '';
  coverPhoto: string;
  additionalPhotos: string[];
  pricePerHour: string;
  pricePerDay: string;
  deposit: string;
  fuelIncluded: boolean;
  operatorIncluded: boolean;
  minRental: string;
  workingRadius: number;
  description: string;
}

export interface FarmerProfile {
  state: string;
  district: string;
  category: 'Small' | 'Marginal' | 'Medium' | 'Large' | '';
  landHolding: string;
  crop: string;
  gender: string;
  age: string;
  annualIncome: string;
  farmerType: 'Individual' | 'FPO' | 'SHG' | 'Organic Farmer' | 'Tenant Farmer' | '';
  irrigation: 'Rainfed' | 'Canal' | 'Drip' | 'Sprinkler' | '';
}

export interface Scheme {
  id: string;
  schemeName: string;
  ministry: string;
  level: 'Central' | 'State';
  description: string;
  eligibility: string;
  benefits: string;
  documents: string[];
  website: string;
  lastUpdated: string;
  category: string;
  matchScore: number;
}

export type SortOption = 'newest' | 'match' | 'central' | 'state';

export interface SchemeFilters {
  state: string;
  category: string;
  crop: string;
  search: string;
  sort: SortOption;
  level: 'all' | 'Central' | 'State';
}

export enum Section {
  HERO = 'hero',
  ABOUT = 'about',
  WEATHER = 'weather',
  NEWS = 'news',
  SCHEMES = 'schemes',
  MANDI = 'mandi',
  CROP_RECOMMENDER = 'crop-recommender',
  DISEASE_DETECTION = 'disease-detection',
  EQUIPMENT_RECOMMENDER = 'equipment-recommender',
  LOGIN = 'login',
  SIGNUP = 'signup',
  CART = 'cart',
  PAYMENT = 'payment',
}

export interface User {
  name: string;
  email: string;
  password?: string;
  signedUpAt?: string;
}

export interface NewsArticle {
  headline: string;
  summary: string;
  source: string;
  publishedDate: string;
}

export interface Scheme {
  schemeName: string;
  description: string;
  eligibility: string;
  benefits: string;
}

export interface Crop {
  id: number;
  name: string;
  quantity: string;
  expectedPrice: string;
  harvestDate: string;
}

export interface ListedCrop {
  id: number;
  name: string;
  quantity: string;
  expectedPrice: string;
  harvestDate: string;
  farmerName: string;
  location: string;
  status: 'Active' | 'Pending';
  listedOn: string;
}

export interface Equipment {
  id: number;
  name: string;
  image: string;
  description: string;
  rentPerDay: number;
  available: boolean;
}

export interface Fertilizer {
    id: number;
    name: string;
    image: string;
    description: string;
    pricePerBag: number;
    brand: string;
}

export interface Seed {
    id: number;
    name: string;
    image: string;
    description: string;
    pricePerKg: number;
    brand: string;
}

export interface Pesticide {
    id: number;
    name: string;
    image: string;
    description: string;
    pricePerLiter: number;
    brand: string;
}

export type Product = ListedCrop | Equipment | Fertilizer | Seed | Pesticide;

export interface CartItem {
    id: string; // Composite key like 'crop-1' or 'equipment-2'
    name: string;
    price: number;
    quantity: number;
    image: string;
    type: 'Crop' | 'Equipment' | 'Fertilizer' | 'Seed' | 'Pesticide';
}

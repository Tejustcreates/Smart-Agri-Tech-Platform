import type { LucideIcon } from 'lucide-react';
import { Home, Store, CloudSun, Bug, Sprout, Landmark, Tractor, Newspaper, ChartLine } from 'lucide-react';

export const ROUTES = {
  HOME: '/',
  MANDI: '/mandi',
  WEATHER: '/weather',
  CROPS: '/crop-advisor',
  DISEASE: '/disease-detection',
  SCHEMES: '/schemes',
  EQUIPMENT: '/equipment',
  NEWS: '/news',
  DASHBOARD: '/dashboard',
  CART: '/cart',
  PAYMENT: '/payment',
  LOGIN: '/login',
  SIGNUP: '/signup',
} as const;

export interface NavItem {
  name: string;
  route: string;
  icon: LucideIcon;
  sectionId: string;
}

export const NAV_ITEMS: NavItem[] = [
  { name: 'Home', route: ROUTES.HOME, icon: Home, sectionId: 'hero' },
  { name: 'Mandi', route: ROUTES.MANDI, icon: Store, sectionId: 'mandi' },
  { name: 'Weather', route: ROUTES.WEATHER, icon: CloudSun, sectionId: 'weather' },
  { name: 'Crop Doctor', route: ROUTES.DISEASE, icon: Bug, sectionId: 'disease-detection' },
  { name: 'Crop Advisor', route: ROUTES.CROPS, icon: Sprout, sectionId: 'crop-recommender' },
  { name: 'Schemes', route: ROUTES.SCHEMES, icon: Landmark, sectionId: 'schemes' },
  { name: 'Equipment', route: ROUTES.EQUIPMENT, icon: Tractor, sectionId: 'equipment-recommender' },
  { name: 'News', route: ROUTES.NEWS, icon: Newspaper, sectionId: 'news' },
  { name: 'Dashboard', route: ROUTES.DASHBOARD, icon: ChartLine, sectionId: 'dashboard' },
];

export const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
];

export const CROP_OPTIONS = [
  'Wheat', 'Rice', 'Maize', 'Soybean', 'Cotton', 'Sugarcane', 'Potato', 'Onion', 'Tomato', 'Mustard'
];

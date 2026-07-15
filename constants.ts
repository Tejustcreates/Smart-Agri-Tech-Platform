import { Section } from './types';

export const NAV_ITEMS = [
  { name: 'Home', section: Section.HERO },
  { name: 'About', section: Section.ABOUT },
  { name: 'Weather', section: Section.WEATHER },
  { name: 'Crop Advisor', section: Section.CROP_RECOMMENDER },
  { name: 'Disease Detection', section: Section.DISEASE_DETECTION },
  { name: 'News', section: Section.NEWS },
  { name: 'Schemes', section: Section.SCHEMES },
  { name: 'Mandi', section: Section.MANDI },
  { name: 'Equipment Rental', section: Section.EQUIPMENT_RECOMMENDER },
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
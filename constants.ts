export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  CART: '/cart',
  PAYMENT: '/payment',
  DASHBOARD: '/dashboard',
} as const;

export const NAV_ITEMS = [
  { name: 'Home', sectionId: 'hero', icon: 'fas fa-home' },
  { name: 'Weather', sectionId: 'weather', icon: 'fas fa-cloud-sun' },
  { name: 'Crop Advisor', sectionId: 'crop-recommender', icon: 'fas fa-seedling' },
  { name: 'Disease Detection', sectionId: 'disease-detection', icon: 'fas fa-bug' },
  { name: 'Dashboard', sectionId: 'dashboard', icon: 'fas fa-chart-line', route: '/dashboard' },
  { name: 'News', sectionId: 'news', icon: 'fas fa-newspaper' },
  { name: 'Schemes', sectionId: 'schemes', icon: 'fas fa-landmark' },
  { name: 'Mandi', sectionId: 'mandi', icon: 'fas fa-store' },
  { name: 'Equipment', sectionId: 'equipment-recommender', icon: 'fas fa-tractor' },
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

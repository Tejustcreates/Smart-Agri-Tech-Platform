export const ROUTES = {
  HOME: '/',
  WEATHER: '/weather',
  CROP_ADVISOR: '/crop-advisor',
  DISEASE_DETECTION: '/disease-detection',
  NEWS: '/news',
  SCHEMES: '/schemes',
  MANDI: '/mandi',
  EQUIPMENT: '/equipment',
  LOGIN: '/login',
  SIGNUP: '/signup',
  CART: '/cart',
  PAYMENT: '/payment',
} as const;

export const NAV_ITEMS = [
  { name: 'Home', path: ROUTES.HOME, icon: 'fas fa-home' },
  { name: 'Weather', path: ROUTES.WEATHER, icon: 'fas fa-cloud-sun' },
  { name: 'Crop Advisor', path: ROUTES.CROP_ADVISOR, icon: 'fas fa-seedling' },
  { name: 'Disease Detection', path: ROUTES.DISEASE_DETECTION, icon: 'fas fa-bug' },
  { name: 'News', path: ROUTES.NEWS, icon: 'fas fa-newspaper' },
  { name: 'Schemes', path: ROUTES.SCHEMES, icon: 'fas fa-landmark' },
  { name: 'Mandi', path: ROUTES.MANDI, icon: 'fas fa-store' },
  { name: 'Equipment', path: ROUTES.EQUIPMENT, icon: 'fas fa-tractor' },
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

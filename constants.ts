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

export const NAV_ITEMS = [
  { name: 'Home', route: ROUTES.HOME, icon: 'fas fa-home', sectionId: 'hero' },
  { name: 'Mandi', route: ROUTES.MANDI, icon: 'fas fa-store', sectionId: 'mandi' },
  { name: 'Weather', route: ROUTES.WEATHER, icon: 'fas fa-cloud-sun', sectionId: 'weather' },
  { name: 'Crop Doctor', route: ROUTES.DISEASE, icon: 'fas fa-bug', sectionId: 'disease-detection' },
  { name: 'Crop Advisor', route: ROUTES.CROPS, icon: 'fas fa-seedling', sectionId: 'crop-recommender' },
  { name: 'Schemes', route: ROUTES.SCHEMES, icon: 'fas fa-landmark', sectionId: 'schemes' },
  { name: 'Equipment', route: ROUTES.EQUIPMENT, icon: 'fas fa-tractor', sectionId: 'equipment-recommender' },
  { name: 'News', route: ROUTES.NEWS, icon: 'fas fa-newspaper', sectionId: 'news' },
  { name: 'Dashboard', route: ROUTES.DASHBOARD, icon: 'fas fa-chart-line', sectionId: 'dashboard' },
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

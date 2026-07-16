import { EquipmentListing, SearchFilters, RegistrationForm } from '../../types/equipment';

const IMAGES = [
  'https://picsum.photos/seed/tractor1/600/400',
  'https://picsum.photos/seed/harvester1/600/400',
  'https://picsum.photos/seed/rotavator1/600/400',
  'https://picsum.photos/seed/seeder1/600/400',
  'https://picsum.photos/seed/sprayer1/600/400',
  'https://picsum.photos/seed/cultivator1/600/400',
  'https://picsum.photos/seed/thresher1/600/400',
  'https://picsum.photos/seed/plough1/600/400',
  'https://picsum.photos/seed/tractor2/600/400',
  'https://picsum.photos/seed/harvester2/600/400',
];

const MOCK_LISTINGS: EquipmentListing[] = [
  {
    id: 'eq-1', name: 'Mahindra Arjun 555', category: 'Tractor', brand: 'Mahindra', model: 'Arjun 555 DI',
    horsepower: 52, year: 2021, condition: 'Excellent', image: IMAGES[0], images: [IMAGES[0], IMAGES[8]],
    pricePerDay: 3500, pricePerHour: 500, deposit: 10000, fuelIncluded: false, operatorIncluded: true,
    minRental: '4 hours', availability: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
    ownerName: 'Rajesh Patil', ownerPhone: '+919876543210', village: 'Indapur', taluka: 'Indapur',
    district: 'Pune', state: 'Maharashtra', lat: 18.15, lng: 75.02, distance: 12, rating: 4.8,
    reviewCount: 23, verified: true, featured: true, recentlyAdded: false, lowPrice: false, matchScore: 98,
    description: 'Well-maintained Mahindra tractor with hydraulic tipping. Operator included. Regular servicing done.',
  },
  {
    id: 'eq-2', name: 'John Deere 5310', category: 'Tractor', brand: 'John Deere', model: '5310 GearPro',
    horsepower: 55, year: 2022, condition: 'Excellent', image: IMAGES[8], images: [IMAGES[8], IMAGES[0]],
    pricePerDay: 4000, pricePerHour: 550, deposit: 15000, fuelIncluded: true, operatorIncluded: true,
    minRental: '4 hours', availability: ['monday', 'wednesday', 'friday', 'saturday'],
    ownerName: 'Suresh Jadhav', ownerPhone: '+919876543211', village: 'Baramati', taluka: 'Baramati',
    district: 'Pune', state: 'Maharashtra', lat: 18.24, lng: 74.63, distance: 35, rating: 4.9,
    reviewCount: 41, verified: true, featured: true, recentlyAdded: false, lowPrice: false, matchScore: 95,
    description: 'Premium John Deere tractor with AC cabin. Fuel and operator both included. GPS enabled.',
  },
  {
    id: 'eq-3', name: 'Dasmesh 9252 Harvester', category: 'Harvester', brand: 'Dasmesh', model: '9252',
    horsepower: 100, year: 2020, condition: 'Good', image: IMAGES[1], images: [IMAGES[1], IMAGES[9]],
    pricePerDay: 8000, pricePerHour: 1200, deposit: 25000, fuelIncluded: false, operatorIncluded: true,
    minRental: '1 day', availability: ['tuesday', 'thursday', 'saturday'],
    ownerName: 'Arun Shinde', ownerPhone: '+919876543212', village: 'Sangli', taluka: 'Miraj',
    district: 'Sangli', state: 'Maharashtra', lat: 16.85, lng: 74.56, distance: 85, rating: 4.5,
    reviewCount: 12, verified: true, featured: false, recentlyAdded: false, lowPrice: false, matchScore: 82,
    description: 'Multi-crop harvester suitable for wheat and rice. Regular maintenance. Operator experienced.',
  },
  {
    id: 'eq-4', name: 'Sonalika Sikander', category: 'Rotavator', brand: 'Sonalika', model: 'Sikander 65',
    horsepower: 50, year: 2023, condition: 'Excellent', image: IMAGES[2], images: [IMAGES[2]],
    pricePerDay: 1500, pricePerHour: 250, deposit: 5000, fuelIncluded: false, operatorIncluded: false,
    minRental: '2 hours', availability: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
    ownerName: 'Manoj Deshmukh', ownerPhone: '+919876543213', village: 'Satara', taluka: 'Satara',
    district: 'Satara', state: 'Maharashtra', lat: 17.68, lng: 74.01, distance: 55, rating: 4.7,
    reviewCount: 18, verified: true, featured: false, recentlyAdded: true, lowPrice: true, matchScore: 92,
    description: 'New rotavator, barely used. Perfect for land preparation. Available all days.',
  },
  {
    id: 'eq-5', name: 'Precision Seeder DS-300', category: 'Seeder', brand: 'Dasmesh', model: 'DS-300',
    horsepower: 35, year: 2022, condition: 'Good', image: IMAGES[3], images: [IMAGES[3]],
    pricePerDay: 2000, pricePerHour: 300, deposit: 8000, fuelIncluded: false, operatorIncluded: true,
    minRental: '4 hours', availability: ['monday', 'tuesday', 'wednesday'],
    ownerName: 'Vikram More', ownerPhone: '+919876543214', village: 'Nashik', taluka: 'Nashik',
    district: 'Nashik', state: 'Maharashtra', lat: 19.99, lng: 73.78, distance: 120, rating: 4.3,
    reviewCount: 8, verified: false, featured: false, recentlyAdded: true, lowPrice: false, matchScore: 75,
    description: 'Precision seeder for wheat and soybean. GPS guidance system included.',
  },
  {
    id: 'eq-6', name: 'Tata Hitachi Sprayer', category: 'Sprayer', brand: 'Tata Hitachi', model: 'Power Sprayer 200L',
    horsepower: 15, year: 2023, condition: 'Excellent', image: IMAGES[4], images: [IMAGES[4]],
    pricePerDay: 800, pricePerHour: 150, deposit: 3000, fuelIncluded: true, operatorIncluded: false,
    minRental: '2 hours', availability: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
    ownerName: 'Priya Kulkarni', ownerPhone: '+919876543215', village: 'Kolhapur', taluka: 'Karvir',
    district: 'Kolhapur', state: 'Maharashtra', lat: 16.71, lng: 74.23, distance: 65, rating: 4.6,
    reviewCount: 15, verified: true, featured: false, recentlyAdded: false, lowPrice: true, matchScore: 90,
    description: 'New power sprayer with 200L tank. Ideal for sugarcane and grape farms. Fuel included.',
  },
  {
    id: 'eq-7', name: 'Kubota cultivator', category: 'Cultivator', brand: 'Kubota', model: 'KC-220',
    horsepower: 40, year: 2021, condition: 'Good', image: IMAGES[5], images: [IMAGES[5]],
    pricePerDay: 1800, pricePerHour: 280, deposit: 6000, fuelIncluded: false, operatorIncluded: false,
    minRental: '3 hours', availability: ['wednesday', 'thursday', 'friday', 'saturday'],
    ownerName: 'Ganesh Rao', ownerPhone: '+919876543216', village: 'Belgaum', taluka: 'Belgaum',
    district: 'Belgaum', state: 'Karnataka', lat: 15.85, lng: 74.50, distance: 200, rating: 4.4,
    reviewCount: 10, verified: true, featured: false, recentlyAdded: false, lowPrice: false, matchScore: 70,
    description: 'Japanese quality cultivator. Deep tillage capable. Well maintained.',
  },
  {
    id: 'eq-8', name: 'Shaktiman Champion', category: 'Thresher', brand: 'Shaktiman', model: 'Champion 165',
    horsepower: 25, year: 2020, condition: 'Average', image: IMAGES[6], images: [IMAGES[6]],
    pricePerDay: 1200, pricePerHour: 200, deposit: 4000, fuelIncluded: false, operatorIncluded: true,
    minRental: '4 hours', availability: ['monday', 'tuesday', 'thursday', 'saturday'],
    ownerName: 'Dattatray Khot', ownerPhone: '+919876543217', village: 'Solapur', taluka: 'Solapur',
    district: 'Solapur', state: 'Maharashtra', lat: 17.66, lng: 75.91, distance: 150, rating: 4.1,
    reviewCount: 6, verified: false, featured: false, recentlyAdded: false, lowPrice: true, matchScore: 68,
    description: 'Multi-crop thresher. Works for wheat, paddy, and soybean. Operator included.',
  },
  {
    id: 'eq-9', name: 'Lemken Plough 3-Furrow', category: 'Plough', brand: 'Lemken', model: 'Juwal 3',
    horsepower: 45, year: 2022, condition: 'Good', image: IMAGES[7], images: [IMAGES[7]],
    pricePerDay: 2200, pricePerHour: 350, deposit: 7000, fuelIncluded: false, operatorIncluded: false,
    minRental: '3 hours', availability: ['tuesday', 'wednesday', 'friday', 'sunday'],
    ownerName: 'Sandeep Bapat', ownerPhone: '+919876543218', village: 'Ahmednagar', taluka: 'Ahmednagar',
    district: 'Ahmednagar', state: 'Maharashtra', lat: 19.09, lng: 74.74, distance: 90, rating: 4.7,
    reviewCount: 14, verified: true, featured: true, recentlyAdded: false, lowPrice: false, matchScore: 88,
    description: 'German engineering reversible plough. 3-furrow, deep tillage. Excellent for hard soil.',
  },
  {
    id: 'eq-10', name: 'Swaraj 744 XT', category: 'Tractor', brand: 'Swaraj', model: '744 XT',
    horsepower: 48, year: 2019, condition: 'Average', image: IMAGES[9], images: [IMAGES[9], IMAGES[8]],
    pricePerDay: 2800, pricePerHour: 400, deposit: 8000, fuelIncluded: false, operatorIncluded: true,
    minRental: '4 hours', availability: ['monday', 'wednesday', 'friday'],
    ownerName: 'Kiran Pawar', ownerPhone: '+919876543219', village: 'Latur', taluka: 'Latur',
    district: 'Latur', state: 'Maharashtra', lat: 18.40, lng: 76.57, distance: 250, rating: 4.0,
    reviewCount: 5, verified: true, featured: false, recentlyAdded: false, lowPrice: false, matchScore: 62,
    description: 'Reliable Swaraj tractor. Good for general farm work. Regular maintenance done.',
  },
];

function computeMatch(listing: EquipmentListing, filters: SearchFilters): number {
  let score = 50;
  if (filters.radius > 0) {
    if (listing.distance <= 20) score += 25;
    else if (listing.distance <= 50) score += 15;
    else if (listing.distance <= 100) score += 8;
  }
  if (filters.maxBudget > 0 && listing.pricePerDay <= filters.maxBudget) score += 15;
  if (listing.condition === 'Excellent') score += 10;
  else if (listing.condition === 'Good') score += 5;
  if (listing.verified) score += 8;
  if (listing.rating >= 4.5) score += 7;
  if (listing.operatorIncluded) score += 3;
  return Math.min(99, score);
}

export async function searchEquipment(filters: SearchFilters): Promise<EquipmentListing[]> {
  await new Promise((r) => setTimeout(r, 700));
  const results = MOCK_LISTINGS
    .filter((l) => l.distance <= filters.radius)
    .filter((l) => !filters.category || l.category === filters.category)
    .filter((l) => filters.maxBudget <= 0 || l.pricePerDay <= filters.maxBudget)
    .map((l) => ({ ...l, matchScore: computeMatch(l, filters) }))
    .sort((a, b) => b.matchScore - a.matchScore);
  return results;
}

export async function getListingDetails(id: string): Promise<EquipmentListing | undefined> {
  await new Promise((r) => setTimeout(r, 300));
  return MOCK_LISTINGS.find((l) => l.id === id);
}

export async function registerEquipment(_form: RegistrationForm): Promise<{ success: boolean; id: string }> {
  await new Promise((r) => setTimeout(r, 1200));
  return { success: true, id: `eq-new-${Date.now()}` };
}

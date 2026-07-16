import { EquipmentListing, SearchFilters, RegistrationForm, GpsLocation } from '../../types/equipment';
import { reverseGeocode as sharedReverseGeocode } from '../shared/locationService';

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

// Spread around Pune (18.52, 73.85) with realistic distances
const MOCK_LISTINGS: EquipmentListing[] = [
  {
    id: 'eq-1', name: 'Mahindra Arjun 555', category: 'Tractor', brand: 'Mahindra', model: 'Arjun 555 DI',
    horsepower: 52, year: 2021, condition: 'Excellent', image: IMAGES[0], images: [IMAGES[0], IMAGES[8]],
    pricePerDay: 3500, pricePerHour: 500, deposit: 10000, fuelIncluded: false, operatorIncluded: true,
    minRental: '4 hours', availability: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
    ownerName: 'Rajesh Patil', ownerPhone: '+919876543210', village: 'Indapur',
    lat: 18.15, lng: 75.02, distance: 0, travelTime: '', rating: 4.8,
    reviewCount: 23, verified: true, featured: true, recentlyAdded: false, lowPrice: false, matchScore: 0,
    description: 'Well-maintained Mahindra tractor with hydraulic tipping. Operator included. Regular servicing done.',
  },
  {
    id: 'eq-2', name: 'John Deere 5310', category: 'Tractor', brand: 'John Deere', model: '5310 GearPro',
    horsepower: 55, year: 2022, condition: 'Excellent', image: IMAGES[8], images: [IMAGES[8], IMAGES[0]],
    pricePerDay: 4000, pricePerHour: 550, deposit: 15000, fuelIncluded: true, operatorIncluded: true,
    minRental: '4 hours', availability: ['monday', 'wednesday', 'friday', 'saturday'],
    ownerName: 'Suresh Jadhav', ownerPhone: '+919876543211', village: 'Baramati',
    lat: 18.24, lng: 74.63, distance: 0, travelTime: '', rating: 4.9,
    reviewCount: 41, verified: true, featured: true, recentlyAdded: false, lowPrice: false, matchScore: 0,
    description: 'Premium John Deere tractor with AC cabin. Fuel and operator both included. GPS enabled.',
  },
  {
    id: 'eq-3', name: 'Dasmesh 9252 Harvester', category: 'Harvester', brand: 'Dasmesh', model: '9252',
    horsepower: 100, year: 2020, condition: 'Good', image: IMAGES[1], images: [IMAGES[1], IMAGES[9]],
    pricePerDay: 8000, pricePerHour: 1200, deposit: 25000, fuelIncluded: false, operatorIncluded: true,
    minRental: '1 day', availability: ['tuesday', 'thursday', 'saturday'],
    ownerName: 'Arun Shinde', ownerPhone: '+919876543212', village: 'Miraj',
    lat: 16.85, lng: 74.56, distance: 0, travelTime: '', rating: 4.5,
    reviewCount: 12, verified: true, featured: false, recentlyAdded: false, lowPrice: false, matchScore: 0,
    description: 'Multi-crop harvester suitable for wheat and rice. Regular maintenance. Operator experienced.',
  },
  {
    id: 'eq-4', name: 'Sonalika Sikander', category: 'Rotavator', brand: 'Sonalika', model: 'Sikander 65',
    horsepower: 50, year: 2023, condition: 'Excellent', image: IMAGES[2], images: [IMAGES[2]],
    pricePerDay: 1500, pricePerHour: 250, deposit: 5000, fuelIncluded: false, operatorIncluded: false,
    minRental: '2 hours', availability: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
    ownerName: 'Manoj Deshmukh', ownerPhone: '+919876543213', village: 'Wai',
    lat: 17.99, lng: 73.89, distance: 0, travelTime: '', rating: 4.7,
    reviewCount: 18, verified: true, featured: false, recentlyAdded: true, lowPrice: true, matchScore: 0,
    description: 'New rotavator, barely used. Perfect for land preparation. Available all days.',
  },
  {
    id: 'eq-5', name: 'Precision Seeder DS-300', category: 'Seeder', brand: 'Dasmesh', model: 'DS-300',
    horsepower: 35, year: 2022, condition: 'Good', image: IMAGES[3], images: [IMAGES[3]],
    pricePerDay: 2000, pricePerHour: 300, deposit: 8000, fuelIncluded: false, operatorIncluded: true,
    minRental: '4 hours', availability: ['monday', 'tuesday', 'wednesday'],
    ownerName: 'Vikram More', ownerPhone: '+919876543214', village: 'Nashik',
    lat: 19.99, lng: 73.78, distance: 0, travelTime: '', rating: 4.3,
    reviewCount: 8, verified: false, featured: false, recentlyAdded: true, lowPrice: false, matchScore: 0,
    description: 'Precision seeder for wheat and soybean. GPS guidance system included.',
  },
  {
    id: 'eq-6', name: 'Tata Hitachi Sprayer', category: 'Sprayer', brand: 'Tata Hitachi', model: 'Power Sprayer 200L',
    horsepower: 15, year: 2023, condition: 'Excellent', image: IMAGES[4], images: [IMAGES[4]],
    pricePerDay: 800, pricePerHour: 150, deposit: 3000, fuelIncluded: true, operatorIncluded: false,
    minRental: '2 hours', availability: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
    ownerName: 'Priya Kulkarni', ownerPhone: '+919876543215', village: 'Karad',
    lat: 17.29, lng: 74.18, distance: 0, travelTime: '', rating: 4.6,
    reviewCount: 15, verified: true, featured: false, recentlyAdded: false, lowPrice: true, matchScore: 0,
    description: 'New power sprayer with 200L tank. Ideal for sugarcane and grape farms. Fuel included.',
  },
  {
    id: 'eq-7', name: 'Kubota Cultivator', category: 'Cultivator', brand: 'Kubota', model: 'KC-220',
    horsepower: 40, year: 2021, condition: 'Good', image: IMAGES[5], images: [IMAGES[5]],
    pricePerDay: 1800, pricePerHour: 280, deposit: 6000, fuelIncluded: false, operatorIncluded: false,
    minRental: '3 hours', availability: ['wednesday', 'thursday', 'friday', 'saturday'],
    ownerName: 'Ganesh Rao', ownerPhone: '+919876543216', village: 'Satara',
    lat: 17.68, lng: 74.01, distance: 0, travelTime: '', rating: 4.4,
    reviewCount: 10, verified: true, featured: false, recentlyAdded: false, lowPrice: false, matchScore: 0,
    description: 'Japanese quality cultivator. Deep tillage capable. Well maintained.',
  },
  {
    id: 'eq-8', name: 'Shaktiman Champion', category: 'Thresher', brand: 'Shaktiman', model: 'Champion 165',
    horsepower: 25, year: 2020, condition: 'Average', image: IMAGES[6], images: [IMAGES[6]],
    pricePerDay: 1200, pricePerHour: 200, deposit: 4000, fuelIncluded: false, operatorIncluded: true,
    minRental: '4 hours', availability: ['monday', 'tuesday', 'thursday', 'saturday'],
    ownerName: 'Dattatray Khot', ownerPhone: '+919876543217', village: 'Solapur',
    lat: 17.66, lng: 75.91, distance: 0, travelTime: '', rating: 4.1,
    reviewCount: 6, verified: false, featured: false, recentlyAdded: false, lowPrice: true, matchScore: 0,
    description: 'Multi-crop thresher. Works for wheat, paddy, and soybean. Operator included.',
  },
  {
    id: 'eq-9', name: 'Lemken Plough 3-Furrow', category: 'Plough', brand: 'Lemken', model: 'Juwal 3',
    horsepower: 45, year: 2022, condition: 'Good', image: IMAGES[7], images: [IMAGES[7]],
    pricePerDay: 2200, pricePerHour: 350, deposit: 7000, fuelIncluded: false, operatorIncluded: false,
    minRental: '3 hours', availability: ['tuesday', 'wednesday', 'friday', 'sunday'],
    ownerName: 'Sandeep Bapat', ownerPhone: '+919876543218', village: 'Ahmednagar',
    lat: 19.09, lng: 74.74, distance: 0, travelTime: '', rating: 4.7,
    reviewCount: 14, verified: true, featured: true, recentlyAdded: false, lowPrice: false, matchScore: 0,
    description: 'German engineering reversible plough. 3-furrow, deep tillage. Excellent for hard soil.',
  },
  {
    id: 'eq-10', name: 'Swaraj 744 XT', category: 'Tractor', brand: 'Swaraj', model: '744 XT',
    horsepower: 48, year: 2019, condition: 'Average', image: IMAGES[9], images: [IMAGES[9], IMAGES[8]],
    pricePerDay: 2800, pricePerHour: 400, deposit: 8000, fuelIncluded: false, operatorIncluded: true,
    minRental: '4 hours', availability: ['monday', 'wednesday', 'friday'],
    ownerName: 'Kiran Pawar', ownerPhone: '+919876543219', village: 'Latur',
    lat: 18.40, lng: 76.57, distance: 0, travelTime: '', rating: 4.0,
    reviewCount: 5, verified: true, featured: false, recentlyAdded: false, lowPrice: false, matchScore: 0,
    description: 'Reliable Swaraj tractor. Good for general farm work. Regular maintenance done.',
  },
];

// --- Haversine Distance ---
export function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function estimateTravelTime(distanceKm: number): string {
  if (distanceKm < 5) return '~10 min';
  if (distanceKm < 15) return '~25 min';
  if (distanceKm < 30) return '~45 min';
  if (distanceKm < 60) return '~1.5 hrs';
  if (distanceKm < 100) return '~2 hrs';
  if (distanceKm < 200) return '~3.5 hrs';
  return '~5+ hrs';
}

// --- Reverse Geocoding via shared service ---
export async function reverseGeocode(lat: number, lng: number): Promise<GpsLocation> {
  const geo = await sharedReverseGeocode(lat, lng);
  return { lat: geo.lat, lng: geo.lng, address: geo.address, village: geo.village, pincode: geo.pincode };
}

// --- Recommendation Score: 40% distance, 20% availability, 15% price, 10% rating, 10% verified, 5% condition ---
function computeMatch(
  distanceKm: number,
  listing: EquipmentListing,
  filters: SearchFilters,
  availabilityScore: number
): number {
  const maxDist = filters.radius;
  const distPct = Math.max(0, 1 - distanceKm / maxDist);
  const distScore = distPct * 40;

  const availScore = (availabilityScore / 7) * 20;

  const avgPrice = 2500;
  const pricePct = filters.maxBudget > 0
    ? Math.max(0, 1 - listing.pricePerDay / filters.maxBudget)
    : Math.max(0, 1 - Math.abs(listing.pricePerDay - avgPrice) / avgPrice);
  const priceScore = pricePct * 15;

  const ratingScore = (listing.rating / 5) * 10;

  const verifiedScore = listing.verified ? 10 : 0;

  const condPct = listing.condition === 'Excellent' ? 1 : listing.condition === 'Good' ? 0.6 : 0.3;
  const condScore = condPct * 5;

  return Math.round(Math.min(99, distScore + availScore + priceScore + ratingScore + verifiedScore + condScore));
}

// --- Public API ---
export async function searchEquipment(filters: SearchFilters): Promise<EquipmentListing[]> {
  await new Promise((r) => setTimeout(r, 700));
  const results = MOCK_LISTINGS
    .map((l) => {
      const d = haversineDistance(filters.lat, filters.lng, l.lat, l.lng);
      return { ...l, distance: Math.round(d * 10) / 10, travelTime: estimateTravelTime(d) };
    })
    .filter((l) => l.distance <= filters.radius)
    .filter((l) => !filters.category || l.category === filters.category)
    .filter((l) => filters.maxBudget <= 0 || l.pricePerDay <= filters.maxBudget)
    .map((l) => {
      const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
      const availScore = l.availability.includes(today) ? 7 : Math.min(7, l.availability.length);
      return { ...l, matchScore: computeMatch(l.distance, l, filters, availScore) };
    })
    .sort((a, b) => a.distance - b.distance);
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

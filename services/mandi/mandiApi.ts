import {
  LivePrice,
  NearbyMandi,
  PriceForecast,
  MandiRecommendation,
  MandiDashboardSummary,
  PricePredictionContext,
} from '../../types/mandi';

const RAW_LIVE_PRICES: Omit<LivePrice, 'priceDate'>[] = [
  { id: '1', crop: 'Wheat', mandi: 'Pune APMC', district: 'Pune', state: 'Maharashtra', minPrice: 2180, maxPrice: 2450, modalPrice: 2320, lastUpdated: '2 hours ago', change: 2.3 },
  { id: '2', crop: 'Soybean', mandi: 'Nashik APMC', district: 'Nashik', state: 'Maharashtra', minPrice: 5200, maxPrice: 5800, modalPrice: 5500, lastUpdated: '1 hour ago', change: -1.5 },
  { id: '3', crop: 'Rice', mandi: 'Delhi Azadpur', district: 'New Delhi', state: 'Delhi', minPrice: 3800, maxPrice: 4200, modalPrice: 4000, lastUpdated: '3 hours ago', change: 0.8 },
  { id: '4', crop: 'Onion', mandi: 'Nashik APMC', district: 'Nashik', state: 'Maharashtra', minPrice: 1800, maxPrice: 2600, modalPrice: 2200, lastUpdated: '30 min ago', change: 5.1 },
  { id: '5', crop: 'Cotton', mandi: 'Rajkot APMC', district: 'Rajkot', state: 'Gujarat', minPrice: 6200, maxPrice: 6800, modalPrice: 6500, lastUpdated: '4 hours ago', change: -0.4 },
  { id: '6', crop: 'Maize', mandi: 'Solapur APMC', district: 'Solapur', state: 'Maharashtra', minPrice: 1750, maxPrice: 1950, modalPrice: 1850, lastUpdated: '1 hour ago', change: 1.2 },
  { id: '7', crop: 'Potato', mandi: 'Indore Mandsaur', district: 'Indore', state: 'Madhya Pradesh', minPrice: 1200, maxPrice: 1600, modalPrice: 1400, lastUpdated: '2 hours ago', change: -2.1 },
  { id: '8', crop: 'Tomato', mandi: 'Bangalore APMC', district: 'Bangalore', state: 'Karnataka', minPrice: 2000, maxPrice: 3200, modalPrice: 2600, lastUpdated: '45 min ago', change: 8.3 },
  { id: '9', crop: 'Sugarcane', mandi: 'Kolhapur APMC', district: 'Kolhapur', state: 'Maharashtra', minPrice: 3100, maxPrice: 3400, modalPrice: 3250, lastUpdated: '5 hours ago', change: 0.2 },
  { id: '10', crop: 'Mustard', mandi: 'Jaipur APMC', district: 'Jaipur', state: 'Rajasthan', minPrice: 5400, maxPrice: 5900, modalPrice: 5650, lastUpdated: '3 hours ago', change: 3.7 },
  { id: '11', crop: 'Wheat', mandi: 'Indore APMC', district: 'Indore', state: 'Madhya Pradesh', minPrice: 2200, maxPrice: 2480, modalPrice: 2350, lastUpdated: '1 hour ago', change: 1.9 },
  { id: '12', crop: 'Soybean', mandi: 'Akola APMC', district: 'Akola', state: 'Maharashtra', minPrice: 5100, maxPrice: 5700, modalPrice: 5400, lastUpdated: '2 hours ago', change: -0.8 },
  { id: '13', crop: 'Rice', mandi: 'Kolkata APMC', district: 'Kolkata', state: 'West Bengal', minPrice: 3600, maxPrice: 4100, modalPrice: 3850, lastUpdated: '6 hours ago', change: 0.5 },
  { id: '14', crop: 'Cotton', mandi: 'Nagpur APMC', district: 'Nagpur', state: 'Maharashtra', minPrice: 6000, maxPrice: 6600, modalPrice: 6300, lastUpdated: '2 hours ago', change: 1.1 },
  { id: '15', crop: 'Onion', mandi: 'Pune APMC', district: 'Pune', state: 'Maharashtra', minPrice: 1900, maxPrice: 2500, modalPrice: 2100, lastUpdated: '1 hour ago', change: 3.2 },
  { id: '16', crop: 'Maize', mandi: 'Latur APMC', district: 'Latur', state: 'Maharashtra', minPrice: 1780, maxPrice: 1920, modalPrice: 1860, lastUpdated: '3 hours ago', change: -0.3 },
  { id: '17', crop: 'Tomato', mandi: 'Pune APMC', district: 'Pune', state: 'Maharashtra', minPrice: 2200, maxPrice: 3000, modalPrice: 2500, lastUpdated: '1 hour ago', change: 6.1 },
  { id: '18', crop: 'Potato', mandi: 'Pune APMC', district: 'Pune', state: 'Maharashtra', minPrice: 1100, maxPrice: 1500, modalPrice: 1300, lastUpdated: '4 hours ago', change: -1.8 },
  { id: '19', crop: 'Wheat', mandi: 'Jaipur APMC', district: 'Jaipur', state: 'Rajasthan', minPrice: 2150, maxPrice: 2400, modalPrice: 2280, lastUpdated: '5 hours ago', change: 0.6 },
  { id: '20', crop: 'Sugarcane', mandi: 'Satara APMC', district: 'Satara', state: 'Maharashtra', minPrice: 3050, maxPrice: 3350, modalPrice: 3200, lastUpdated: '3 hours ago', change: 0.4 },
];

const MANDI_COORDS: Record<string, { lat: number; lng: number }> = {
  'Pune APMC': { lat: 18.5204, lng: 73.8567 },
  'Nashik APMC': { lat: 19.9975, lng: 73.7898 },
  'Delhi Azadpur': { lat: 28.7041, lng: 77.1025 },
  'Rajkot APMC': { lat: 22.3039, lng: 70.8022 },
  'Solapur APMC': { lat: 17.6599, lng: 75.9064 },
  'Indore Mandsaur': { lat: 22.7196, lng: 75.8577 },
  'Bangalore APMC': { lat: 12.9716, lng: 77.5946 },
  'Kolhapur APMC': { lat: 16.705, lng: 74.2433 },
  'Jaipur APMC': { lat: 26.9124, lng: 75.7873 },
  'Akola APMC': { lat: 20.7002, lng: 77.0082 },
  'Kolkata APMC': { lat: 22.5726, lng: 88.3639 },
  'Nagpur APMC': { lat: 21.1458, lng: 79.0882 },
  'Latur APMC': { lat: 18.4088, lng: 76.5604 },
  'Satara APMC': { lat: 17.6805, lng: 74.0183 },
};

const LOCATION_COORDS: Record<string, { lat: number; lng: number }> = {
  pune: { lat: 18.5204, lng: 73.8567 },
  nashik: { lat: 19.9975, lng: 73.7898 },
  kolhapur: { lat: 16.705, lng: 74.2433 },
  nagpur: { lat: 21.1458, lng: 79.0882 },
  satara: { lat: 17.6805, lng: 74.0183 },
  ahmednagar: { lat: 19.0948, lng: 74.748 },
  aurangabad: { lat: 19.8762, lng: 75.3433 },
  sangli: { lat: 16.8524, lng: 74.5636 },
  solapur: { lat: 17.6599, lng: 75.9064 },
  latur: { lat: 18.4088, lng: 76.5604 },
  akola: { lat: 20.7002, lng: 77.0082 },
  indore: { lat: 22.7196, lng: 75.8577 },
  ludhiana: { lat: 30.901, lng: 75.8573 },
  delhi: { lat: 28.7041, lng: 77.1025 },
  jaipur: { lat: 26.9124, lng: 75.7873 },
  rajkot: { lat: 22.3039, lng: 70.8022 },
  mumbai: { lat: 19.076, lng: 72.8777 },
};

const CROP_VOLATILITY: Record<string, number> = {
  Wheat: 0.025,
  Rice: 0.025,
  Maize: 0.035,
  Soybean: 0.045,
  Cotton: 0.04,
  Sugarcane: 0.02,
  Onion: 0.09,
  Potato: 0.06,
  Tomato: 0.1,
  Mustard: 0.035,
  Groundnut: 0.045,
  'Moong Bean': 0.05,
  Chickpea: 0.035,
};

const HARVEST_MONTHS: Record<string, number[]> = {
  Kharif: [9, 10],
  Rabi: [2, 3],
  Zaid: [5, 6],
};

function hashString(value: string): number {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function seededNoise(seed: string): number {
  return (hashString(seed) % 2001) / 1000 - 1;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function haversineKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const earthRadius = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * earthRadius * Math.asin(Math.sqrt(h));
}

function resolveLocation(location: string): { lat: number; lng: number } {
  const normalized = location.toLowerCase();
  const match = Object.keys(LOCATION_COORDS).find((key) => normalized.includes(key));
  return match ? LOCATION_COORDS[match] : LOCATION_COORDS.pune;
}

function getMandiCoords(mandi: string, district: string): { lat: number; lng: number } {
  if (MANDI_COORDS[mandi]) return MANDI_COORDS[mandi];
  const districtMatch = LOCATION_COORDS[district.toLowerCase()];
  return districtMatch ?? LOCATION_COORDS.pune;
}

function arrivalQuantity(id: string): number {
  return 120 + (hashString(id) % 480);
}

function generatePriceHistory(
  crop: string,
  currentPrice: number,
  trendScore: number,
  volatility: number
): { date: string; price: number; predicted?: boolean }[] {
  const history: { date: string; price: number; predicted?: boolean }[] = [];
  const now = new Date();
  const seed = `${crop}:${currentPrice}:${now.toISOString().slice(0, 10)}`;

  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const wave = Math.sin((29 - i) / 4.5) * currentPrice * volatility * 1.5;
    const noise = seededNoise(`${seed}:history:${i}`) * currentPrice * volatility;
    history.push({
      date: d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
      price: Math.max(1, Math.round(currentPrice + wave + noise)),
    });
  }

  for (let i = 1; i <= 7; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() + i);
    const projected = currentPrice * (1 + trendScore * volatility * (i / 7) * 2.2);
    const noise = seededNoise(`${seed}:future:${i}`) * currentPrice * volatility * 0.4;
    history.push({
      date: d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
      price: Math.max(1, Math.round(projected + noise)),
      predicted: true,
    });
  }

  return history;
}

export async function getLivePrices(): Promise<LivePrice[]> {
  await new Promise((r) => setTimeout(r, 500));
  const today = new Date().toISOString().slice(0, 10);
  return RAW_LIVE_PRICES.map((price) => ({ ...price, priceDate: today }));
}

export async function getDashboardSummary(): Promise<MandiDashboardSummary> {
  await new Promise((r) => setTimeout(r, 350));
  const prices = await getLivePrices();
  const highest = prices.reduce((best, price) => (price.modalPrice > best.modalPrice ? price : best), prices[0]);
  const avgMarketPrice = Math.round(prices.reduce((sum, price) => sum + price.modalPrice, 0) / prices.length);
  const avgChange = prices.reduce((sum, price) => sum + price.change, 0) / prices.length;

  const mandiTotals = new Map<string, { total: number; count: number }>();
  prices.forEach((price) => {
    const current = mandiTotals.get(price.mandi) ?? { total: 0, count: 0 };
    mandiTotals.set(price.mandi, { total: current.total + price.modalPrice, count: current.count + 1 });
  });
  const bestMandi = Array.from(mandiTotals.entries())
    .map(([name, value]) => ({ name, average: value.total / value.count }))
    .sort((a, b) => b.average - a.average)[0];

  return {
    highestPriceCrop: highest.crop,
    highestPriceValue: highest.modalPrice,
    highestPriceMandi: highest.mandi,
    avgMarketPrice,
    bestMandi: bestMandi?.name ?? 'Pune APMC',
    priceTrend: avgChange > 0.5 ? 'bullish' : avgChange < -0.5 ? 'bearish' : 'stable',
    trendChange: Math.round(avgChange * 10) / 10,
  };
}

export async function getNearbyMandis(crop: string, location: string, radius: number): Promise<NearbyMandi[]> {
  await new Promise((r) => setTimeout(r, 400));
  const origin = resolveLocation(location);
  const cropPrices = RAW_LIVE_PRICES.filter((price) => price.crop.toLowerCase() === crop.toLowerCase());

  return cropPrices
    .map((price) => {
      const distance = Math.max(5, Math.round(haversineKm(origin, getMandiCoords(price.mandi, price.district))));
      const averagePrice = Math.round(price.modalPrice / (1 + price.change / 100));
      return {
        id: price.id,
        name: price.mandi,
        distance,
        todayPrice: price.modalPrice,
        averagePrice,
        arrivalQty: arrivalQuantity(price.id),
        crop: price.crop,
        district: price.district,
        state: price.state,
        transportCost: Math.round(distance * 1.1),
      };
    })
    .filter((mandi) => mandi.distance <= radius)
    .sort((a, b) => a.distance - b.distance);
}

export async function getPricePrediction(
  crop: string,
  currentPrice: number,
  context: PricePredictionContext = {}
): Promise<PriceForecast> {
  await new Promise((r) => setTimeout(r, 650));
  const volatility = CROP_VOLATILITY[crop] ?? 0.04;
  const monthIndex = context.month
    ? ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].indexOf(context.month)
    : new Date().getMonth();

  let trendScore = seededNoise(`${crop}:${currentPrice}:${new Date().toISOString().slice(0, 10)}`) * 0.45;

  if (context.season && HARVEST_MONTHS[context.season]?.includes(monthIndex)) trendScore -= 0.45;
  else if (context.season) trendScore += 0.15;

  const rainfall = Number(context.rainfall) || 0;
  if (rainfall > 200) trendScore += 0.35;
  else if (rainfall > 100) trendScore += 0.18;
  else if (rainfall > 0 && rainfall < 40) trendScore -= 0.12;

  trendScore = clamp(trendScore, -1, 1);
  const tomorrowChange = Math.round(currentPrice * clamp(trendScore * volatility * 0.45, -0.05, 0.05));
  const weekChange = Math.round(currentPrice * clamp(trendScore * volatility * 1.8, -0.15, 0.15));
  const contextFields = [context.season, context.month, context.rainfall, context.state, context.district].filter(Boolean).length;
  const confidence = Math.round(clamp(55 + contextFields * 6 + (1 - Math.abs(trendScore)) * 8, 55, 92));
  const trend = trendScore > 0.15 ? 'bullish' : trendScore < -0.15 ? 'bearish' : 'stable';

  return {
    crop,
    state: context.state ?? '',
    district: context.district ?? '',
    currentPrice,
    tomorrowPrice: currentPrice + tomorrowChange,
    nextWeekPrice: currentPrice + weekChange,
    trend,
    confidence,
    history: generatePriceHistory(crop, currentPrice, trendScore, volatility),
  };
}

export async function getRecommendation(
  crop: string,
  quantity: number,
  transportBudget: number,
  location = 'Pune'
): Promise<MandiRecommendation[]> {
  await new Promise((r) => setTimeout(r, 550));
  const nearby = await getNearbyMandis(crop, location, 800);
  const budget = transportBudget > 0 ? transportBudget : Number.POSITIVE_INFINITY;

  const mandis: MandiRecommendation[] = nearby
    .filter((mandi) => mandi.transportCost <= budget)
    .map((mandi) => {
      const netPrice = mandi.todayPrice - mandi.transportCost;
      return {
        id: mandi.id,
        name: mandi.name,
        distance: mandi.distance,
        currentPrice: mandi.todayPrice,
        transportCost: mandi.transportCost,
        netPrice,
        extraProfit: Math.round((netPrice - mandi.averagePrice) * quantity),
        arrivalQty: mandi.arrivalQty,
        district: mandi.district,
        state: mandi.state,
        isRecommended: false,
      };
    })
    .sort((a, b) => b.netPrice - a.netPrice);

  if (mandis.length > 0) mandis[0].isRecommended = true;
  return mandis;
}

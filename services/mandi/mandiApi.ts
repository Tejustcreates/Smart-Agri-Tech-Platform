import {
  LivePrice,
  NearbyMandi,
  PriceForecast,
  MandiRecommendation,
  MandiDashboardSummary,
  PriceFilters,
} from '../../types/mandi';

const MOCK_LIVE_PRICES: LivePrice[] = [
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

const MOCK_NEARBY_MANDIS: NearbyMandi[] = [
  { id: 'n1', name: 'Pune APMC', distance: 15, todayPrice: 2320, averagePrice: 2280, arrivalQty: 450, crop: 'Wheat', district: 'Pune', state: 'Maharashtra', transportCost: 50 },
  { id: 'n2', name: 'Nashik APMC', distance: 180, todayPrice: 5500, averagePrice: 5300, arrivalQty: 320, crop: 'Soybean', district: 'Nashik', state: 'Maharashtra', transportCost: 200 },
  { id: 'n3', name: 'Solapur APMC', distance: 250, todayPrice: 2150, averagePrice: 2100, arrivalQty: 280, crop: 'Wheat', district: 'Solapur', state: 'Maharashtra', transportCost: 280 },
  { id: 'n4', name: 'Kolhapur APMC', distance: 230, todayPrice: 2400, averagePrice: 2350, arrivalQty: 390, crop: 'Wheat', district: 'Kolhapur', state: 'Maharashtra', transportCost: 260 },
  { id: 'n5', name: 'Satara APMC', distance: 120, todayPrice: 2250, averagePrice: 2200, arrivalQty: 200, crop: 'Wheat', district: 'Satara', state: 'Maharashtra', transportCost: 130 },
  { id: 'n6', name: 'Indore APMC', distance: 650, todayPrice: 2350, averagePrice: 2300, arrivalQty: 550, crop: 'Wheat', district: 'Indore', state: 'Madhya Pradesh', transportCost: 700 },
  { id: 'n7', name: 'Ahmedabad APMC', distance: 500, todayPrice: 2380, averagePrice: 2320, arrivalQty: 420, crop: 'Wheat', district: 'Ahmedabad', state: 'Gujarat', transportCost: 550 },
  { id: 'n8', name: 'Nagpur APMC', distance: 700, todayPrice: 6300, averagePrice: 6100, arrivalQty: 180, crop: 'Cotton', district: 'Nagpur', state: 'Maharashtra', transportCost: 750 },
];

function generatePriceHistory(currentPrice: number): { date: string; price: number; predicted?: boolean }[] {
  const history: { date: string; price: number; predicted?: boolean }[] = [];
  const now = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const variance = (Math.random() - 0.5) * currentPrice * 0.15;
    history.push({
      date: d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
      price: Math.round(currentPrice + variance),
    });
  }
  for (let i = 1; i <= 7; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() + i);
    const variance = (Math.random() - 0.3) * currentPrice * 0.08;
    history.push({
      date: d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
      price: Math.round(currentPrice + variance + i * (Math.random() > 0.5 ? 15 : -10)),
      predicted: true,
    });
  }
  return history;
}

export async function getLivePrices(): Promise<LivePrice[]> {
  await new Promise((r) => setTimeout(r, 600));
  return [...MOCK_LIVE_PRICES];
}

export async function getDashboardSummary(): Promise<MandiDashboardSummary> {
  await new Promise((r) => setTimeout(r, 400));
  return {
    highestPriceCrop: 'Cotton',
    highestPriceValue: 6500,
    highestPriceMandi: 'Rajkot APMC',
    avgMarketPrice: 3890,
    bestMandi: 'Nashik APMC',
    priceTrend: 'bullish',
    trendChange: 2.3,
  };
}

export async function getNearbyMandis(_crop: string, _location: string, _radius: number): Promise<NearbyMandi[]> {
  await new Promise((r) => setTimeout(r, 500));
  return MOCK_NEARBY_MANDIS.filter((m) => m.distance <= _radius);
}

export async function getPricePrediction(
  crop: string,
  currentPrice: number
): Promise<PriceForecast> {
  await new Promise((r) => setTimeout(r, 800));
  const trendFactor = Math.random() > 0.4 ? 1 : -1;
  const tomorrowChange = Math.round(currentPrice * 0.02 * trendFactor);
  const weekChange = Math.round(currentPrice * 0.05 * trendFactor);
  const confidence = Math.round(72 + Math.random() * 20);
  const trend = trendFactor > 0 ? 'bullish' : 'bearish';
  return {
    crop,
    state: '',
    district: '',
    currentPrice,
    tomorrowPrice: currentPrice + tomorrowChange,
    nextWeekPrice: currentPrice + weekChange,
    trend,
    confidence,
    history: generatePriceHistory(currentPrice),
  };
}

export async function getRecommendation(
  crop: string,
  quantity: number,
  transportBudget: number
): Promise<MandiRecommendation[]> {
  await new Promise((r) => setTimeout(r, 700));
  const mandis: MandiRecommendation[] = MOCK_NEARBY_MANDIS.map((m) => {
    const tc = Math.round(m.distance * 1.1);
    const netPrice = m.todayPrice - tc;
    return {
      id: m.id,
      name: m.name,
      distance: m.distance,
      currentPrice: m.todayPrice,
      transportCost: tc,
      netPrice,
      extraProfit: Math.round((netPrice - m.averagePrice) * quantity),
      arrivalQty: m.arrivalQty,
      district: m.district,
      state: m.state,
      isRecommended: false,
    };
  });
  mandis.sort((a, b) => b.netPrice - a.netPrice);
  if (mandis.length > 0) mandis[0].isRecommended = true;
  return mandis;
}

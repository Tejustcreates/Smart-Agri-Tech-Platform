export type MandiTab = 'prices' | 'nearby' | 'prediction' | 'recommendation';

export type TrendDirection = 'bullish' | 'bearish' | 'stable';

export type SortBy = 'price-desc' | 'price-asc' | 'distance' | 'profit';

export interface LivePrice {
  id: string;
  crop: string;
  mandi: string;
  district: string;
  state: string;
  minPrice: number;
  maxPrice: number;
  modalPrice: number;
  lastUpdated: string;
  change: number;
}

export interface NearbyMandi {
  id: string;
  name: string;
  distance: number;
  todayPrice: number;
  averagePrice: number;
  arrivalQty: number;
  crop: string;
  district: string;
  state: string;
  transportCost: number;
}

export interface PriceForecast {
  crop: string;
  state: string;
  district: string;
  currentPrice: number;
  tomorrowPrice: number;
  nextWeekPrice: number;
  trend: TrendDirection;
  confidence: number;
  history: PriceHistoryPoint[];
}

export interface PriceHistoryPoint {
  date: string;
  price: number;
  predicted?: boolean;
}

export interface MandiRecommendation {
  id: string;
  name: string;
  distance: number;
  currentPrice: number;
  transportCost: number;
  netPrice: number;
  extraProfit: number;
  arrivalQty: number;
  district: string;
  state: string;
  isRecommended: boolean;
}

export interface MandiDashboardSummary {
  highestPriceCrop: string;
  highestPriceValue: number;
  highestPriceMandi: string;
  avgMarketPrice: number;
  bestMandi: string;
  priceTrend: TrendDirection;
  trendChange: number;
}

export interface PriceFilters {
  state: string;
  district: string;
  crop: string;
  date: string;
  search: string;
}

export interface NearbyFilters {
  location: string;
  crop: string;
  radius: number;
}

export interface PredictionInput {
  crop: string;
  state: string;
  district: string;
  currentPrice: string;
  season: string;
  month: string;
  rainfall: string;
}

export interface RecommendationInput {
  location: string;
  crop: string;
  quantity: string;
  transportCost: string;
}

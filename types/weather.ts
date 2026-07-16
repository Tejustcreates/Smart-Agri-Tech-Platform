export interface GeoLocation {
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string;
}

export interface CurrentWeather {
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  weatherCode: number;
  cloudCover: number;
  pressureMsl: number;
  surfacePressure: number;
  uvIndex: number;
  visibility: number;
  isDay: boolean;
  time: string;
}

export interface HourlyForecast {
  time: string;
  temperature: number;
  humidity: number;
  dewPoint: number;
  precipitationProbability: number;
  precipitation: number;
  rain: number;
  weatherCode: number;
  cloudCover: number;
  windSpeed: number;
  uvIndex: number;
  isDay: boolean;
}

export interface DailyForecast {
  date: string;
  weatherCode: number;
  temperatureMax: number;
  temperatureMin: number;
  apparentTemperatureMax: number;
  apparentTemperatureMin: number;
  sunrise: string;
  sunset: string;
  uvIndexMax: number;
  precipitationSum: number;
  rainSum: number;
  precipitationHours: number;
  precipitationProbabilityMax: number;
  windSpeedMax: number;
}

export interface WeatherData {
  location: GeoLocation;
  current: CurrentWeather;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
  timezone: string;
}

export interface RainPrediction {
  willRain: boolean;
  confidence: number;
  probability: number;
  recommendation: string;
  timeframe: string;
}

export interface CropRecommendation {
  crop: string;
  suitability: 'high' | 'medium' | 'low';
  reason: string;
  icon: string;
}

export interface DiseaseRiskAssessment {
  disease: string;
  risk: 'high' | 'medium' | 'low';
  probability: number;
  factors: string[];
}

export interface FarmingAdvisory {
  irrigation: { recommendation: string; urgency: 'high' | 'medium' | 'low'; reason: string };
  spraying: { recommendation: string; urgency: 'high' | 'medium' | 'low'; reason: string };
  harvesting: { recommendation: string; urgency: 'high' | 'medium' | 'low'; reason: string };
  planting: { recommendation: string; urgency: 'high' | 'medium' | 'low'; reason: string };
}

export interface WeatherAlert {
  id: string;
  type: 'rain' | 'wind' | 'heat' | 'cold' | 'uv' | 'fog';
  severity: 'high' | 'medium' | 'low';
  title: string;
  message: string;
}

export interface MLPredictionResult {
  rainPrediction: RainPrediction;
  cropRecommendations: CropRecommendation[];
  diseaseRisks: DiseaseRiskAssessment[];
  advisory: FarmingAdvisory;
  alerts: WeatherAlert[];
  agricultureHealthScore: number;
}

export interface ChartDataPoint {
  time: string;
  value: number;
  label?: string;
}

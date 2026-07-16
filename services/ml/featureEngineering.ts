import { CurrentWeather, HourlyForecast, DailyForecast } from '../../types/weather';

export interface WeatherFeatures {
  temperature: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  cloudCover: number;
  uvIndex: number;
  dewPoint: number;
  precipitationProbability: number;
  precipitation: number;
  hourOfDay: number;
  dayOfWeek: number;
  month: number;
  temperatureDelta: number;
  humidityDelta: number;
  pressureDelta: number;
  windGustFactor: number;
  cloudTrend: number;
  seasonalFactor: number;
}

export function extractFeatures(
  current: CurrentWeather,
  hourly: HourlyForecast[],
  daily: DailyForecast[]
): WeatherFeatures {
  const now = new Date();
  const h1 = hourly[1];
  const h3 = hourly[3];
  const h6 = hourly[6];

  return {
    temperature: current.temperature,
    humidity: current.humidity,
    pressure: current.pressureMsl,
    windSpeed: current.windSpeed,
    cloudCover: current.cloudCover,
    uvIndex: current.uvIndex,
    dewPoint: h1?.dewPoint ?? current.temperature - 10,
    precipitationProbability: h1?.precipitationProbability ?? 0,
    precipitation: current.humidity > 80 ? 1 : 0,
    hourOfDay: now.getHours(),
    dayOfWeek: now.getDay(),
    month: now.getMonth(),
    temperatureDelta: h6 ? h6.temperature - current.temperature : 0,
    humidityDelta: h6 ? h6.humidity - current.humidity : 0,
    pressureDelta: h3 ? h3.temperature - current.temperature : 0,
    windGustFactor: h1 ? Math.min(h1.windSpeed / Math.max(current.windSpeed, 1), 3) : 1,
    cloudTrend: h3 ? (h3.cloudCover - current.cloudCover) / 100 : 0,
    seasonalFactor: getSeasonFactor(now.getMonth()),
  };
}

function getSeasonFactor(month: number): number {
  if (month >= 5 && month <= 9) return 1.0;
  if (month >= 10 && month <= 11) return 0.6;
  if (month >= 0 && month <= 1) return 0.3;
  return 0.5;
}

export function featuresToArray(f: WeatherFeatures): number[] {
  return [
    f.temperature / 50,
    f.humidity / 100,
    f.pressure / 1100,
    f.windSpeed / 50,
    f.cloudCover / 100,
    f.uvIndex / 12,
    (f.dewPoint + 20) / 50,
    f.precipitationProbability / 100,
    f.precipitation,
    f.hourOfDay / 24,
    f.dayOfWeek / 7,
    f.month / 12,
    (f.temperatureDelta + 20) / 40,
    (f.humidityDelta + 50) / 100,
    f.pressureDelta / 30,
    f.windGustFactor / 3,
    (f.cloudTrend + 1) / 2,
    f.seasonalFactor,
  ];
}

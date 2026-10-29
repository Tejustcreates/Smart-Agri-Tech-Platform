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

export function findCurrentHourIndex(current: CurrentWeather, hourly: HourlyForecast[]): number {
  if (hourly.length === 0) return 0;
  const currentHour = current.time.slice(0, 13);
  const exact = hourly.findIndex((h) => h.time.slice(0, 13) === currentHour);
  if (exact >= 0) return exact;
  const currentMs = new Date(current.time).getTime();
  const upcoming = hourly.findIndex((h) => new Date(h.time).getTime() >= currentMs);
  return upcoming >= 0 ? upcoming : 0;
}

export function extractFeatures(
  current: CurrentWeather,
  hourly: HourlyForecast[],
  daily: DailyForecast[]
): WeatherFeatures {
  const nowIndex = findCurrentHourIndex(current, hourly);
  const h1 = hourly[nowIndex + 1] ?? hourly[nowIndex];
  const h3 = hourly[nowIndex + 3] ?? hourly[hourly.length - 1];
  const h6 = hourly[nowIndex + 6] ?? hourly[hourly.length - 1];
  const currentDate = new Date(current.time);

  return {
    temperature: current.temperature,
    humidity: current.humidity,
    pressure: current.pressureMsl,
    windSpeed: current.windSpeed,
    cloudCover: current.cloudCover,
    uvIndex: current.uvIndex,
    dewPoint: h1?.dewPoint ?? current.temperature - 10,
    precipitationProbability: h1?.precipitationProbability ?? 0,
    precipitation: Math.min(1, (h1?.precipitation ?? 0) / 5),
    hourOfDay: Number.isNaN(currentDate.getHours()) ? Number(current.time.slice(11, 13)) : currentDate.getHours(),
    dayOfWeek: currentDate.getDay(),
    month: currentDate.getMonth(),
    temperatureDelta: h6 ? h6.temperature - current.temperature : 0,
    humidityDelta: h6 ? h6.humidity - current.humidity : 0,
    pressureDelta: h3 ? h3.pressureMsl - current.pressureMsl : 0,
    windGustFactor: h1 ? Math.min(h1.windSpeed / Math.max(current.windSpeed, 1), 3) : 1,
    cloudTrend: h3 ? (h3.cloudCover - current.cloudCover) / 100 : 0,
    seasonalFactor: getSeasonFactor(currentDate.getMonth()),
  };
}

function getSeasonFactor(month: number): number {
  if (month >= 5 && month <= 9) return 1.0;
  if (month >= 10 || month <= 1) return 0.3;
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

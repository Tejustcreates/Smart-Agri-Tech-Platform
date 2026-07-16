import { WeatherData, GeoLocation, CurrentWeather, HourlyForecast, DailyForecast } from '../../types/weather';

const BASE_URL = 'https://api.open-meteo.com/v1/forecast';
const GEO_URL = 'https://geocoding-api.open-meteo.com/v1/search';

export async function searchLocations(query: string): Promise<GeoLocation[]> {
  const res = await fetch(`${GEO_URL}?name=${encodeURIComponent(query)}&count=8&language=en&format=json`);
  const data = await res.json();
  if (!data.results) return [];
  return data.results.map((r: any) => ({
    name: r.name,
    latitude: r.latitude,
    longitude: r.longitude,
    country: r.country || '',
    admin1: r.admin1 || '',
  }));
}

export const INDIAN_CITIES: GeoLocation[] = [
  { name: 'Pune', latitude: 18.5204, longitude: 73.8567, country: 'India', admin1: 'Maharashtra' },
  { name: 'Nashik', latitude: 19.9975, longitude: 73.7898, country: 'India', admin1: 'Maharashtra' },
  { name: 'Kolhapur', latitude: 16.7050, longitude: 74.2433, country: 'India', admin1: 'Maharashtra' },
  { name: 'Nagpur', latitude: 21.1458, longitude: 79.0882, country: 'India', admin1: 'Maharashtra' },
  { name: 'Satara', latitude: 17.6808, longitude: 73.9885, country: 'India', admin1: 'Maharashtra' },
  { name: 'Ahmednagar', latitude: 19.0948, longitude: 74.7480, country: 'India', admin1: 'Maharashtra' },
  { name: 'Aurangabad', latitude: 19.8762, longitude: 75.3433, country: 'India', admin1: 'Maharashtra' },
  { name: 'Sangli', latitude: 16.8524, longitude: 74.5636, country: 'India', admin1: 'Maharashtra' },
  { name: 'Solapur', latitude: 17.6599, longitude: 75.9064, country: 'India', admin1: 'Maharashtra' },
  { name: 'Indore', latitude: 22.7196, longitude: 75.8577, country: 'India', admin1: 'Madhya Pradesh' },
  { name: 'Ludhiana', latitude: 30.9010, longitude: 75.8573, country: 'India', admin1: 'Punjab' },
];

function weatherCodeToDescription(code: number): string {
  const map: Record<number, string> = {
    0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
    45: 'Foggy', 48: 'Rime fog', 51: 'Light drizzle', 53: 'Moderate drizzle',
    55: 'Dense drizzle', 56: 'Freezing drizzle', 57: 'Dense freezing drizzle',
    61: 'Slight rain', 63: 'Moderate rain', 65: 'Heavy rain',
    66: 'Freezing rain', 67: 'Heavy freezing rain',
    71: 'Slight snow', 73: 'Moderate snow', 75: 'Heavy snow', 77: 'Snow grains',
    80: 'Slight rain showers', 81: 'Moderate rain showers', 82: 'Violent rain showers',
    85: 'Slight snow showers', 86: 'Heavy snow showers',
    95: 'Thunderstorm', 96: 'Thunderstorm with hail', 99: 'Severe thunderstorm',
  };
  return map[code] || 'Unknown';
}

function weatherCodeToIcon(code: number, isDay: boolean): string {
  if (code === 0) return isDay ? '☀️' : '🌙';
  if (code <= 2) return isDay ? '⛅' : '☁️';
  if (code === 3) return '☁️';
  if (code >= 45 && code <= 48) return '🌫️';
  if (code >= 51 && code <= 57) return '🌦️';
  if (code >= 61 && code <= 67) return '🌧️';
  if (code >= 71 && code <= 77) return '❄️';
  if (code >= 80 && code <= 82) return '🌦️';
  if (code >= 85 && code <= 86) return '🌨️';
  if (code >= 95) return '⛈️';
  return '🌤️';
}

export { weatherCodeToDescription, weatherCodeToIcon };

export async function fetchWeatherData(latitude: number, longitude: number): Promise<WeatherData> {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current: [
      'temperature_2m', 'relative_humidity_2m', 'apparent_temperature',
      'precipitation', 'weather_code', 'cloud_cover', 'pressure_msl',
      'surface_pressure', 'wind_speed_10m', 'wind_direction_10m',
      'uv_index', 'is_day',
    ].join(','),
    hourly: [
      'temperature_2m', 'relative_humidity_2m', 'dew_point_2m',
      'precipitation_probability', 'precipitation', 'rain', 'weather_code',
      'cloud_cover', 'wind_speed_10m', 'uv_index', 'is_day',
    ].join(','),
    daily: [
      'weather_code', 'temperature_2m_max', 'temperature_2m_min',
      'apparent_temperature_max', 'apparent_temperature_min',
      'sunrise', 'sunset', 'uv_index_max', 'precipitation_sum',
      'rain_sum', 'precipitation_hours', 'precipitation_probability_max',
      'wind_speed_10m_max',
    ].join(','),
    timezone: 'auto',
    forecast_days: '7',
  });

  const res = await fetch(`${BASE_URL}?${params}`);
  if (!res.ok) throw new Error(`Weather API error: ${res.status}`);
  const data = await res.json();

  const current: CurrentWeather = {
    temperature: Math.round(data.current.temperature_2m),
    apparentTemperature: Math.round(data.current.apparent_temperature),
    humidity: data.current.relative_humidity_2m,
    windSpeed: Math.round(data.current.wind_speed_10m),
    windDirection: data.current.wind_direction_10m,
    weatherCode: data.current.weather_code,
    cloudCover: data.current.cloud_cover,
    pressureMsl: Math.round(data.current.pressure_msl),
    surfacePressure: Math.round(data.current.surface_pressure),
    uvIndex: data.current.uv_index ?? 0,
    visibility: 10,
    isDay: Boolean(data.current.is_day),
    time: data.current.time,
  };

  const hourly: HourlyForecast[] = data.hourly.time.slice(0, 48).map((t: string, i: number) => ({
    time: t,
    temperature: Math.round(data.hourly.temperature_2m[i]),
    humidity: data.hourly.relative_humidity_2m[i],
    dewPoint: Math.round(data.hourly.dew_point_2m[i]),
    precipitationProbability: data.hourly.precipitation_probability[i],
    precipitation: data.hourly.precipitation[i],
    rain: data.hourly.rain[i],
    weatherCode: data.hourly.weather_code[i],
    cloudCover: data.hourly.cloud_cover[i],
    windSpeed: Math.round(data.hourly.wind_speed_10m[i]),
    uvIndex: data.hourly.uv_index[i] ?? 0,
    isDay: Boolean(data.hourly.is_day[i]),
  }));

  const daily: DailyForecast[] = data.daily.time.map((d: string, i: number) => ({
    date: d,
    weatherCode: data.daily.weather_code[i],
    temperatureMax: Math.round(data.daily.temperature_2m_max[i]),
    temperatureMin: Math.round(data.daily.temperature_2m_min[i]),
    apparentTemperatureMax: Math.round(data.daily.apparent_temperature_max[i]),
    apparentTemperatureMin: Math.round(data.daily.apparent_temperature_min[i]),
    sunrise: data.daily.sunrise[i],
    sunset: data.daily.sunset[i],
    uvIndexMax: data.daily.uv_index_max[i],
    precipitationSum: data.daily.precipitation_sum[i],
    rainSum: data.daily.rain_sum[i],
    precipitationHours: data.daily.precipitation_hours[i],
    precipitationProbabilityMax: data.daily.precipitation_probability_max[i],
    windSpeedMax: Math.round(data.daily.wind_speed_10m_max[i]),
  }));

  return {
    location: { name: '', latitude, longitude, country: '' },
    current,
    hourly,
    daily,
    timezone: data.timezone,
  };
}



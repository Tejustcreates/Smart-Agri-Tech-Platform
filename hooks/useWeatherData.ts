import { useState, useCallback } from 'react';
import { WeatherData, GeoLocation } from '../types/weather';
import { fetchWeatherData, searchLocations, INDIAN_CITIES } from '../services/weather/openMeteo';

interface UseWeatherDataReturn {
  weatherData: WeatherData | null;
  loading: boolean;
  error: string;
  searchResults: GeoLocation[];
    fetchWeather: (lat: number, lon: number) => Promise<void>;
  searchCity: (query: string) => Promise<void>;
  selectCity: (location: GeoLocation) => Promise<void>;
}

export function useWeatherData(): UseWeatherDataReturn {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchResults, setSearchResults] = useState<GeoLocation[]>([]);

  const fetchWeather = useCallback(async (lat: number, lon: number) => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchWeatherData(lat, lon);
      setWeatherData(data);
    } catch (err) {
      setError('Failed to fetch weather data. Please try again.');
      console.error('Weather fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const searchCity = useCallback(async (query: string) => {
    if (query.length < 2) { setSearchResults([]); return; }
    try {
      const results = await searchLocations(query);
      setSearchResults(results);
    } catch {
      setSearchResults(INDIAN_CITIES.filter((c) => c.name.toLowerCase().includes(query.toLowerCase())));
    }
  }, []);

  const selectCity = useCallback(async (location: GeoLocation) => {
    setSearchResults([]);
    setWeatherData((prev) => prev ? { ...prev, location } : null);
    await fetchWeather(location.latitude, location.longitude);
  }, [fetchWeather]);

  return { weatherData, loading, error, searchResults, fetchWeather, searchCity, selectCity };
}

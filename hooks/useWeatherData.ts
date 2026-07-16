import { useState, useCallback } from 'react';
import { WeatherData } from '../types/weather';
import { fetchWeatherData } from '../services/weather/openMeteo';

interface UseWeatherDataReturn {
  weatherData: WeatherData | null;
  loading: boolean;
  error: string;
  fetchWeather: (lat: number, lon: number) => Promise<void>;
  clearWeather: () => void;
}

export function useWeatherData(): UseWeatherDataReturn {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

  const clearWeather = useCallback(() => {
    setWeatherData(null);
    setError('');
  }, []);

  return { weatherData, loading, error, fetchWeather, clearWeather };
}

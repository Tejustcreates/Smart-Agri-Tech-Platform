import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Locate, Loader2 } from 'lucide-react';
import { useWeatherData } from '../../hooks/useWeatherData';
import { useMLPredictions } from '../../hooks/useMLPredictions';
import { INDIAN_CITIES, weatherCodeToIcon } from '../../services/weather/openMeteo';
import { GeoLocation } from '../../types/weather';
import CurrentWeatherCard from './CurrentWeatherCard';
import ForecastCards from './ForecastCards';
import WeatherCharts from './WeatherCharts';
import RainProbability from './RainProbability';
import FarmingAdvice from './FarmingAdvice';
import WeatherAlerts from './WeatherAlerts';
import MLPredictionsComponent from './MLPredictions';
import HealthScore from './HealthScore';
import { DashboardSkeleton } from './LoadingSkeleton';

const WeatherDashboard: React.FC = () => {
  const { weatherData, loading, error, searchResults, fetchWeather, searchCity, selectCity } = useWeatherData();
  const mlPredictions = useMLPredictions(weatherData);
  const [query, setQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [locationName, setLocationName] = useState('');
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const loadDefault = async () => {
      await fetchWeather(INDIAN_CITIES[0].latitude, INDIAN_CITIES[0].longitude);
      setLocationName('Pune, Maharashtra');
      setInitialLoading(false);
    };
    loadDefault();
  }, [fetchWeather]);

  const handleSearch = useCallback(async (value: string) => {
    setQuery(value);
    if (value.length >= 2) {
      setShowDropdown(true);
      await searchCity(value);
    } else {
      setShowDropdown(false);
    }
  }, [searchCity]);

  const handleSelect = async (loc: GeoLocation) => {
    setQuery('');
    setShowDropdown(false);
    setLocationName(`${loc.name}, ${loc.admin1 || loc.country}`);
    await selectCity(loc);
  };

  const handleGeoLocate = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        setLocationName('Your Location');
        await fetchWeather(pos.coords.latitude, pos.coords.longitude);
      },
      () => { /* fallback to default */ }
    );
  };

  if (initialLoading || loading) {
    return (
      <div>
        <div className="flex items-center justify-center gap-3 py-20">
          <Loader2 size={24} className="animate-spin text-green-600" />
          <span className="text-gray-600 font-medium">Loading weather data...</span>
        </div>
        <DashboardSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">⚠️</span>
        </div>
        <p className="text-gray-700 font-medium">{error}</p>
        <button onClick={() => fetchWeather(INDIAN_CITIES[0].latitude, INDIAN_CITIES[0].longitude)} className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold">
          Try Again
        </button>
      </div>
    );
  }

  if (!weatherData || !mlPredictions) return null;

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
      >
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              onFocus={() => query.length >= 2 && setShowDropdown(true)}
              onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
              placeholder="Search any Indian city..."
              className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all shadow-sm"
            />
          </div>
          <button
            onClick={handleGeoLocate}
            className="p-2.5 bg-white rounded-xl border border-gray-200 hover:bg-green-50 hover:border-green-300 transition-all shadow-sm"
            title="Use my location"
          >
            <Locate size={16} className="text-green-600" />
          </button>
        </div>

        <AnimatePresence>
          {showDropdown && searchResults.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50"
            >
              {searchResults.slice(0, 5).map((loc, i) => (
                <button
                  key={`${loc.name}-${i}`}
                  onMouseDown={() => handleSelect(loc)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-green-50 transition-colors text-left"
                >
                  <MapPin size={14} className="text-gray-400 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-800">{loc.name}</p>
                    <p className="text-xs text-gray-500">{loc.admin1}, {loc.country}</p>
                  </div>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick City Chips */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {INDIAN_CITIES.slice(0, 6).map((city) => (
            <button
              key={city.name}
              onClick={() => handleSelect(city)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                locationName.startsWith(city.name)
                  ? 'bg-green-600 text-white shadow-md'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-green-300 hover:text-green-600'
              }`}
            >
              {city.name}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Alerts */}
      {mlPredictions.alerts.length > 0 && (
        <WeatherAlerts alerts={mlPredictions.alerts} />
      )}

      {/* Today's Farming Advice Banner */}
      <FarmingAdvice advisory={mlPredictions.advisory} />

      {/* Current Weather + Rain Prediction + Health Score */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <CurrentWeatherCard data={weatherData.current} locationName={locationName} />
        </div>
        <div className="space-y-4">
          <RainProbability prediction={mlPredictions.rainPrediction} />
          <HealthScore score={mlPredictions.agricultureHealthScore} />
        </div>
      </div>

      {/* 5-Day Forecast */}
      <ForecastCards forecasts={weatherData.daily} />

      {/* Charts */}
      <WeatherCharts hourly={weatherData.hourly} />

      {/* ML Predictions: Crops + Disease */}
      <MLPredictionsComponent
        crops={mlPredictions.cropRecommendations}
        diseases={mlPredictions.diseaseRisks}
        rainConfidence={mlPredictions.rainPrediction.confidence}
      />
    </div>
  );
};

export default WeatherDashboard;

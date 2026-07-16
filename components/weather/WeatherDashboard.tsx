import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Locate, ArrowLeft, Loader2 } from 'lucide-react';
import { useWeatherData } from '../../hooks/useWeatherData';
import { useMLPredictions } from '../../hooks/useMLPredictions';
import { GeoLocation } from '../../types/weather';
import CurrentWeatherCard from './CurrentWeatherCard';
import ForecastCards from './ForecastCards';
import WeatherCharts from './WeatherCharts';
import RainProbability from './RainProbability';
import FarmingAdvice from './FarmingAdvice';
import WeatherAlerts from './WeatherAlerts';
import CropAndDiseasePanel from './MLPredictions';
import HealthScore from './HealthScore';
import { DashboardSkeleton } from './LoadingSkeleton';
import WeatherLanding from './WeatherLanding';

const stagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const WeatherDashboard: React.FC = () => {
  const { weatherData, loading, error, searchResults, fetchWeather, searchCity } = useWeatherData();
  const mlPredictions = useMLPredictions(weatherData);
  const [query, setQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [locationName, setLocationName] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [dashboardLoading, setDashboardLoading] = useState(false);

  const handleSearch = useCallback(async (value: string) => {
    setQuery(value);
    if (value.length >= 2) {
      setShowDropdown(true);
      await searchCity(value);
    } else {
      setShowDropdown(false);
    }
  }, [searchCity]);

  const handleLandingSelect = useCallback(async (lat: number, lon: number, name: string) => {
    setDashboardLoading(true);
    setLocationName(name);
    setHasSearched(true);
    setShowDropdown(false);
    await fetchWeather(lat, lon);
    setDashboardLoading(false);
  }, [fetchWeather]);

  const handleDashboardSelect = async (loc: GeoLocation) => {
    setQuery('');
    setShowDropdown(false);
    setDashboardLoading(true);
    setLocationName(`${loc.name}, ${loc.admin1 || loc.country}`);
    await fetchWeather(loc.latitude, loc.longitude);
    setDashboardLoading(false);
  };

  const handleGeolocateDashboard = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        setDashboardLoading(true);
        setLocationName('Your Location');
        await fetchWeather(pos.coords.latitude, pos.coords.longitude);
        setDashboardLoading(false);
      },
      () => {}
    );
  };

  const handleBack = () => {
    setHasSearched(false);
  };

  // ─── Landing State ───────────────────────────────────────────
  if (!hasSearched) {
    return (
      <WeatherLanding
        onSelectLocation={handleLandingSelect}
        searchResults={searchResults}
        onSearch={handleSearch}
        locating={false}
      />
    );
  }

  // ─── Loading State ───────────────────────────────────────────
  if ((loading || dashboardLoading) && !weatherData) {
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

  // ─── Error State ─────────────────────────────────────────────
  if (error && !weatherData) {
    return (
      <div className="text-center py-20">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">⚠️</span>
        </div>
        <p className="text-gray-700 font-medium">{error}</p>
        <button onClick={handleBack} className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold">
          Try Again
        </button>
      </div>
    );
  }

  if (!weatherData || !mlPredictions) return null;

  return (
    <div className="space-y-4">
      {/* Compact Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <button
          onClick={handleBack}
          className="p-3 bg-white rounded-xl border border-gray-200 hover:bg-green-50 hover:border-green-300 transition-all shadow-sm flex-shrink-0"
          title="Back to search"
        >
          <ArrowLeft size={18} className="text-gray-600" />
        </button>
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={() => query.length >= 2 && setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
            placeholder="Search another location..."
            className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all shadow-sm"
          />
        </div>
        <button
          onClick={handleGeolocateDashboard}
          className="p-3 bg-white rounded-xl border border-gray-200 hover:bg-green-50 hover:border-green-300 transition-all shadow-sm"
          title="Use my location"
        >
          <Locate size={18} className="text-green-600" />
        </button>

        {/* Dropdown */}
        <AnimatePresence>
          {showDropdown && searchResults.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="absolute top-full left-12 right-12 mt-1 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50"
            >
              {searchResults.slice(0, 5).map((loc, i) => (
                <button
                  key={`${loc.name}-${i}`}
                  onMouseDown={() => handleDashboardSelect(loc)}
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
      </motion.div>

      {/* Location Label */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.05 }}
        className="text-center"
      >
        <h2 className="text-lg sm:text-xl font-bold text-gray-900">{locationName}</h2>
      </motion.div>

      {/* Loading overlay when fetching new data */}
      <AnimatePresence>
        {dashboardLoading && weatherData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white/60 z-50 flex items-center justify-center"
          >
            <div className="bg-white rounded-2xl px-6 py-4 shadow-xl flex items-center gap-3">
              <Loader2 size={20} className="animate-spin text-green-600" />
              <span className="text-gray-700 font-medium text-sm">Updating weather data...</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dashboard Content — Staggered Reveal */}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        {/* Alerts */}
        {mlPredictions.alerts.length > 0 && (
          <motion.div variants={fadeUp}>
            <WeatherAlerts alerts={mlPredictions.alerts} />
          </motion.div>
        )}

        {/* Today's Farming Advice */}
        <motion.div variants={fadeUp}>
          <FarmingAdvice advisory={mlPredictions.advisory} />
        </motion.div>

        {/* Current Weather + Rain + Health */}
        <motion.div variants={fadeUp} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <CurrentWeatherCard data={weatherData.current} locationName={locationName} />
          </div>
          <div className="space-y-4">
            <RainProbability prediction={mlPredictions.rainPrediction} />
            <HealthScore score={mlPredictions.agricultureHealthScore} />
          </div>
        </motion.div>

        {/* 5-Day Forecast */}
        <motion.div variants={fadeUp}>
          <ForecastCards forecasts={weatherData.daily} />
        </motion.div>

        {/* Crop Recommendations */}
        <motion.div variants={fadeUp}>
          <CropAndDiseasePanel
            crops={mlPredictions.cropRecommendations}
            diseases={mlPredictions.diseaseRisks}
            rainConfidence={mlPredictions.rainPrediction.confidence}
          />
        </motion.div>

        {/* Charts */}
        <motion.div variants={fadeUp}>
          <WeatherCharts hourly={weatherData.hourly} />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default WeatherDashboard;

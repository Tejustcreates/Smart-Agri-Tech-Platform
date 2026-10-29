import React, { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AutoComplete, Input, message } from 'antd';
import _Result from 'antd/es/result';
const Result = _Result as unknown as React.FC<any>;
import { Search, MapPin, Locate, ArrowLeft, Loader2 } from 'lucide-react';
import { useWeatherData } from '../../hooks/useWeatherData';
import { useLocationSearch } from '../../hooks/useLocationSearch';
import { useMLPredictions } from '../../hooks/useMLPredictions';
import { GeoLocation } from '../../types/weather';
import { reverseGeocode } from '../../services/shared/locationService';
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
  const { weatherData, loading, error, fetchWeather } = useWeatherData();
  const { searchResults, searching, search, clearResults } = useLocationSearch();
  const mlPredictions = useMLPredictions(weatherData);
  const [query, setQuery] = useState('');
  const [locationName, setLocationName] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [dashboardLoading, setDashboardLoading] = useState(false);

  // Background refetch (e.g. re-searching a new location while data from the
  // previous one is still on screen) failing silently used to leave the user
  // with no feedback at all — surface it as a toast without tearing down the
  // dashboard that's already rendered.
  const hadWeatherDataRef = useRef(false);
  useEffect(() => {
    if (weatherData) hadWeatherDataRef.current = true;
  }, [weatherData]);
  useEffect(() => {
    if (error && weatherData && hadWeatherDataRef.current) {
      message.error(error);
    }
  }, [error, weatherData]);

  const handleSearch = useCallback((value: string) => {
    setQuery(value);
    if (value.length >= 2) {
      search(value);
    }
  }, [search]);

  const locationOptions = searchResults.slice(0, 5).map((loc, i) => ({
    value: `${loc.latitude},${loc.longitude}`,
    key: `${loc.name}-${loc.latitude}-${i}`,
    label: (
      <div className="flex items-center gap-3 py-0.5">
        <MapPin size={14} className="text-gray-400 flex-shrink-0" />
        <div>
          <p className="text-sm font-medium text-gray-800">{loc.name}</p>
          <p className="text-xs text-gray-500">{loc.admin1 && `${loc.admin1}, `}{loc.country}</p>
        </div>
      </div>
    ),
  }));

  const handleLandingSelect = useCallback(async (lat: number, lon: number, name: string) => {
    setDashboardLoading(true);
    setLocationName(name);
    setHasSearched(true);
    clearResults();
    await fetchWeather(lat, lon);
    setDashboardLoading(false);
  }, [fetchWeather, clearResults]);

  const handleDashboardSelect = async (loc: GeoLocation) => {
    setQuery('');
    clearResults();
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
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        try {
          const geo = await reverseGeocode(lat, lon);
          setLocationName(geo.village || geo.district || geo.state || 'Your Location');
        } catch {
          setLocationName('Your Location');
        }
        await fetchWeather(lat, lon);
        setDashboardLoading(false);
      },
      () => {}
    );
  };

  const handleBack = () => {
    setHasSearched(false);
    setQuery('');
    clearResults();
  };

  // ─── Landing State ───────────────────────────────────────────
  if (!hasSearched) {
    return (
      <WeatherLanding
        onSelectLocation={handleLandingSelect}
        searchResults={searchResults}
        onSearch={search}
        searching={searching}
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
      <Result
        status="error"
        title="Couldn't load weather data"
        subTitle={error}
        extra={
          <button onClick={handleBack} className="px-6 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-800 transition-colors font-semibold">
            Try Again
          </button>
        }
      />
    );
  }

  if (!weatherData || !mlPredictions) return null;

  return (
    <div className="space-y-4">
      {/* Compact Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 relative"
      >
        <button
          onClick={handleBack}
          className="p-3 sm:p-3.5 bg-white rounded-xl border border-gray-200 hover:bg-brand-50 hover:border-brand-300 transition-all shadow-sm flex-shrink-0 active:scale-95"
          title="Back to search"
        >
          <ArrowLeft size={18} className="text-gray-600" />
        </button>
        <div className="flex-1 relative">
          <label htmlFor="weather-dashboard-search" className="sr-only">Search another location</label>
          <AutoComplete
            id="weather-dashboard-search"
            className="w-full"
            value={query}
            options={locationOptions}
            onSearch={handleSearch}
            onChange={(value) => setQuery(value)}
            onSelect={(value) => {
              const loc = searchResults.find((l) => `${l.latitude},${l.longitude}` === value);
              if (loc) handleDashboardSelect(loc);
            }}
          >
            <Input
              placeholder="Search another location..."
              prefix={searching && query.length >= 2 ? <Loader2 size={16} className="text-brand-500 animate-spin" /> : <Search size={16} className="text-gray-400" />}
              className="!rounded-xl !py-3 sm:!py-3.5 !text-sm !shadow-sm"
            />
          </AutoComplete>
        </div>
        <button
          onClick={handleGeolocateDashboard}
          className="p-3 sm:p-3.5 bg-brand-600 rounded-xl text-white hover:bg-brand-800 transition-all shadow-sm active:scale-95 flex-shrink-0"
          title="Use my location"
        >
          <Locate size={18} />
        </button>
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
              <Loader2 size={20} className="animate-spin text-brand-600" />
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
        {mlPredictions.alerts.length > 0 && (
          <motion.div variants={fadeUp}>
            <WeatherAlerts alerts={mlPredictions.alerts} />
          </motion.div>
        )}

        <motion.div variants={fadeUp}>
          <FarmingAdvice advisory={mlPredictions.advisory} />
        </motion.div>

        <motion.div variants={fadeUp} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <CurrentWeatherCard data={weatherData.current} locationName={locationName} />
          </div>
          <div className="space-y-4">
            <RainProbability prediction={mlPredictions.rainPrediction} />
            <HealthScore score={mlPredictions.agricultureHealthScore} />
          </div>
        </motion.div>

        <motion.div variants={fadeUp}>
          <ForecastCards forecasts={weatherData.daily} />
        </motion.div>

        <motion.div variants={fadeUp}>
          <CropAndDiseasePanel
            crops={mlPredictions.cropRecommendations}
            diseases={mlPredictions.diseaseRisks}
            rainConfidence={mlPredictions.rainPrediction.confidence}
          />
        </motion.div>

        <motion.div variants={fadeUp}>
          <WeatherCharts hourly={weatherData.hourly} />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default WeatherDashboard;

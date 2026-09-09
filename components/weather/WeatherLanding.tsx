import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AutoComplete, Input } from 'antd';
import { Search, MapPin, Locate, ArrowRight, Loader2, CloudSun } from 'lucide-react';
import { INDIAN_CITIES } from '../../services/weather/openMeteo';
import { GeoLocation } from '../../types/weather';
import { reverseGeocode } from '../../services/shared/locationService';

interface WeatherLandingProps {
  onSelectLocation: (lat: number, lon: number, name: string) => void;
  searchResults: GeoLocation[];
  onSearch: (q: string) => void;
  searching: boolean;
}

const popularCities = INDIAN_CITIES;

const WeatherLanding: React.FC<WeatherLandingProps> = ({ onSelectLocation, searchResults, onSearch, searching }) => {
  const [query, setQuery] = useState('');
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  const handleSearch = useCallback((value: string) => {
    setQuery(value);
    if (value.length >= 2) {
      onSearch(value);
    }
  }, [onSearch]);

  const handleSelect = (loc: GeoLocation) => {
    setQuery('');
    onSelectLocation(loc.latitude, loc.longitude, `${loc.name}, ${loc.admin1 || loc.country}`);
  };

  const locationOptions = searchResults.slice(0, 6).map((loc, i) => ({
    value: `${loc.latitude},${loc.longitude}`,
    key: `${loc.name}-${loc.latitude}-${i}`,
    label: (
      <div className="flex items-center gap-3 py-1">
        <MapPin size={16} className="text-gray-400 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-800">{loc.name}</p>
          <p className="text-xs text-gray-500">{loc.admin1 && `${loc.admin1}, `}{loc.country}</p>
        </div>
        <ArrowRight size={14} className="text-gray-300 flex-shrink-0" />
      </div>
    ),
  }));

  const handleGeolocate = () => {
    if (!navigator.geolocation) return;
    setGpsLoading(true);
    setGpsError(null);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        try {
          const geo = await reverseGeocode(lat, lon);
          const name = geo.village || geo.district || geo.state || 'Your Location';
          onSelectLocation(lat, lon, name);
        } catch {
          onSelectLocation(lat, lon, 'Your Location');
        }
        setGpsLoading(false);
      },
      () => {
        setGpsLoading(false);
        setGpsError('GPS permission denied. Please allow location access or search manually.');
      }
    );
  };

  return (
    <div className="flex flex-col items-center justify-center py-10 sm:py-20">
      {/* Weather Illustration — Breathing */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="mb-8 sm:mb-10"
      >
        <div className="w-32 h-32 sm:w-44 sm:h-44 rounded-full bg-gradient-to-br from-brand-200 via-brand-100 to-emerald-100 flex items-center justify-center shadow-lg shadow-brand-100/50 mx-auto animate-breathe">
          <CloudSun size={64} className="text-brand-600" />
        </div>
      </motion.div>

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.5 }}
        className="text-center mb-8 sm:mb-10"
      >
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
          Smart Weather Intelligence
        </h2>
        <p className="text-base sm:text-lg text-gray-500 max-w-lg mx-auto leading-relaxed">
          Get accurate weather forecasts and personalized farming recommendations for your location.
        </p>
      </motion.div>

      {/* GPS Button — Primary */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.5 }}
        className="w-full max-w-xl mb-4"
      >
        <button
          onClick={handleGeolocate}
          disabled={gpsLoading}
          className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-brand-600 text-white rounded-2xl font-bold text-base shadow-lg hover:bg-brand-800 transition-all active:scale-[0.98] disabled:opacity-60"
        >
          {gpsLoading ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <Locate size={20} />
          )}
          {gpsLoading ? 'Detecting location...' : 'Use My Location'}
        </button>
      </motion.div>

      {/* GPS Error */}
      <AnimatePresence>
        {gpsError && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="w-full max-w-xl mb-4 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-700 text-center"
          >
            {gpsError}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Divider */}
      <div className="flex items-center gap-3 w-full max-w-xl mb-4">
        <div className="flex-1 h-px bg-gray-200"></div>
        <span className="text-xs text-gray-400 font-medium">or search manually</span>
        <div className="flex-1 h-px bg-gray-200"></div>
      </div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="w-full max-w-xl relative mb-4"
      >
        <label htmlFor="weather-location-search" className="sr-only">
          Search for a village, taluka, district or city
        </label>
        <AutoComplete
          id="weather-location-search"
          className="w-full weather-location-search"
          value={query}
          options={locationOptions}
          onSearch={handleSearch}
          onChange={(value) => setQuery(value)}
          onSelect={(value) => {
            const loc = searchResults.find((l) => `${l.latitude},${l.longitude}` === value);
            if (loc) handleSelect(loc);
          }}
          notFoundContent={
            !searching && query.length >= 2 && searchResults.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-2">No locations found. Try a different spelling.</p>
            ) : null
          }
        >
          <Input
            size="large"
            placeholder="Search Village, Taluka, District or City"
            prefix={searching && query.length >= 2 ? <Loader2 size={20} className="text-brand-500 animate-spin" /> : <Search size={20} className="text-gray-400" />}
            className="!rounded-2xl !py-4 sm:!py-5 !px-4 !text-base sm:!text-lg !shadow-md"
          />
        </AutoComplete>
      </motion.div>

      {/* Helper Text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.45, duration: 0.5 }}
        className="text-sm text-gray-400 mb-6"
      >
        Search your village, city or district to view today&apos;s farming insights.
      </motion.p>

      {/* Popular Cities */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="flex flex-wrap justify-center gap-2.5"
      >
        {popularCities.map((city) => (
          <button
            key={city.name}
            onClick={() => onSelectLocation(city.latitude, city.longitude, `${city.name}, ${city.admin1 || city.country}`)}
            className="px-5 py-2.5 rounded-full text-sm font-medium bg-white text-gray-600 border border-gray-200 hover:border-brand-400 hover:text-brand-700 hover:bg-brand-50 transition-all shadow-sm hover:shadow-md active:scale-95"
          >
            {city.name}
          </button>
        ))}
      </motion.div>
    </div>
  );
};

export default WeatherLanding;

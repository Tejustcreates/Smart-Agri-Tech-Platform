import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Locate, ArrowRight, Loader2 } from 'lucide-react';
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
  const [showDropdown, setShowDropdown] = useState(false);
  const [focused, setFocused] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  const handleSearch = useCallback((value: string) => {
    setQuery(value);
    if (value.length >= 2) {
      setShowDropdown(true);
      onSearch(value);
    } else {
      setShowDropdown(false);
    }
  }, [onSearch]);

  const handleSelect = (loc: GeoLocation) => {
    setQuery('');
    setShowDropdown(false);
    onSelectLocation(loc.latitude, loc.longitude, `${loc.name}, ${loc.admin1 || loc.country}`);
  };

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
          <i className="fas fa-cloud-sun text-5xl sm:text-6xl text-brand-600"></i>
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
            <i className="fas fa-location-crosshairs text-lg"></i>
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
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              {searching && query.length >= 2 ? (
                <Loader2 size={22} className="text-brand-500 animate-spin" />
              ) : (
                <Search size={22} className="text-gray-400" />
              )}
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              onFocus={() => { setFocused(true); if (query.length >= 2) setShowDropdown(true); }}
              onBlur={() => { setFocused(false); setTimeout(() => setShowDropdown(false), 250); }}
              placeholder="Search Village, Taluka, District or City"
              className={`w-full pl-12 pr-4 py-4 sm:py-5 bg-white rounded-2xl border text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all shadow-md placeholder:text-gray-400 ${
                focused
                  ? 'border-brand-400 shadow-lg ring-2 ring-brand-100'
                  : 'border-gray-200 hover:shadow-lg hover:border-gray-300'
              }`}
            />
          </div>
        </div>

        {/* Search Dropdown */}
        <AnimatePresence>
          {showDropdown && searchResults.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50"
            >
              {searchResults.slice(0, 6).map((loc, i) => (
                <button
                  key={`${loc.name}-${loc.latitude}-${i}`}
                  onMouseDown={() => handleSelect(loc)}
                  className="w-full flex items-center gap-3 px-5 py-4 hover:bg-brand-50 active:bg-brand-100 transition-colors text-left border-b border-gray-50 last:border-0"
                >
                  <MapPin size={18} className="text-gray-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-medium text-gray-800">{loc.name}</p>
                    <p className="text-sm text-gray-500">{loc.admin1 && `${loc.admin1}, `}{loc.country}</p>
                  </div>
                  <ArrowRight size={16} className="text-gray-300 flex-shrink-0" />
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* No results hint */}
        <AnimatePresence>
          {showDropdown && !searching && query.length >= 2 && searchResults.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 p-5 text-center z-50"
            >
              <p className="text-sm text-gray-500">No locations found. Try a different spelling.</p>
            </motion.div>
          )}
        </AnimatePresence>
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

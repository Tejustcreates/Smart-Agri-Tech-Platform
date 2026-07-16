import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Locate, ArrowRight } from 'lucide-react';
import { INDIAN_CITIES } from '../../services/weather/openMeteo';
import { GeoLocation } from '../../types/weather';

interface WeatherLandingProps {
  onSelectLocation: (lat: number, lon: number, name: string) => void;
  searchResults: GeoLocation[];
  onSearch: (q: string) => Promise<void>;
  locating: boolean;
}

const popularCities = INDIAN_CITIES.slice(0, 8);

const WeatherLanding: React.FC<WeatherLandingProps> = ({ onSelectLocation, searchResults, onSearch, locating }) => {
  const [query, setQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSearch = useCallback(async (value: string) => {
    setQuery(value);
    if (value.length >= 2) {
      setShowDropdown(true);
      await onSearch(value);
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
    navigator.geolocation.getCurrentPosition(
      (pos) => onSelectLocation(pos.coords.latitude, pos.coords.longitude, 'Your Location'),
      () => {}
    );
  };

  return (
    <div className="flex flex-col items-center justify-center py-8 sm:py-16">
      {/* Weather Illustration */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="mb-6 sm:mb-8"
      >
        <div className="w-36 h-36 sm:w-48 sm:h-48 rounded-full bg-gradient-to-br from-sky-200 via-blue-100 to-green-100 flex items-center justify-center shadow-lg shadow-blue-100/50 mx-auto">
          <span className="text-6xl sm:text-7xl select-none">🌤️</span>
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

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="w-full max-w-xl relative mb-4"
      >
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              onFocus={() => query.length >= 2 && setShowDropdown(true)}
              onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
              placeholder="Search your village, city or district..."
              className="w-full pl-12 pr-4 py-4 sm:py-4.5 bg-white rounded-2xl border border-gray-200 text-base focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all shadow-md hover:shadow-lg placeholder:text-gray-400"
            />
          </div>
          <button
            onClick={handleGeolocate}
            disabled={locating}
            className="p-4 bg-white rounded-2xl border border-gray-200 hover:bg-green-50 hover:border-green-300 transition-all shadow-md hover:shadow-lg flex-shrink-0"
            title="Use my current location"
          >
            <Locate size={20} className={locating ? 'text-gray-400 animate-pulse' : 'text-green-600'} />
          </button>
        </div>

        {/* Search Dropdown */}
        <AnimatePresence>
          {showDropdown && searchResults.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50"
            >
              {searchResults.slice(0, 5).map((loc, i) => (
                <button
                  key={`${loc.name}-${i}`}
                  onMouseDown={() => handleSelect(loc)}
                  className="w-full flex items-center gap-3 px-5 py-4 hover:bg-green-50 transition-colors text-left border-b border-gray-50 last:border-0"
                >
                  <MapPin size={18} className="text-gray-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-medium text-gray-800">{loc.name}</p>
                    <p className="text-sm text-gray-500">{loc.admin1}, {loc.country}</p>
                  </div>
                  <ArrowRight size={16} className="text-gray-300 flex-shrink-0" />
                </button>
              ))}
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
            className="px-5 py-2.5 rounded-full text-sm font-medium bg-white text-gray-600 border border-gray-200 hover:border-green-400 hover:text-green-700 hover:bg-green-50 transition-all shadow-sm hover:shadow-md"
          >
            {city.name}
          </button>
        ))}
      </motion.div>
    </div>
  );
};

export default WeatherLanding;

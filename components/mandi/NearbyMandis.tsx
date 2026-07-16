import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Wheat, Route, Loader2, SlidersHorizontal } from 'lucide-react';
import { NearbyMandi, SortBy } from '../../types/mandi';
import { getNearbyMandis } from '../../services/mandi/mandiApi';
import { INDIAN_STATES, CROP_OPTIONS } from '../../constants';
import MandiCard from './MandiCard';

const NearbyMandis: React.FC = () => {
  const [mandis, setMandis] = useState<NearbyMandi[]>([]);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState('Pune');
  const [crop, setCrop] = useState('Wheat');
  const [radius, setRadius] = useState(200);
  const [sortBy, setSortBy] = useState<SortBy>('price-desc');

  useEffect(() => {
    setLoading(true);
    getNearbyMandis(crop, location, radius)
      .then(setMandis)
      .finally(() => setLoading(false));
  }, [crop, location, radius]);

  const sorted = useMemo(() => {
    const list = [...mandis];
    switch (sortBy) {
      case 'price-desc': return list.sort((a, b) => b.todayPrice - a.todayPrice);
      case 'price-asc': return list.sort((a, b) => a.todayPrice - b.todayPrice);
      case 'distance': return list.sort((a, b) => a.distance - b.distance);
      case 'profit': return list.sort((a, b) => (b.todayPrice - b.transportCost) - (a.todayPrice - a.transportCost));
      default: return list;
    }
  }, [mandis, sortBy]);

  return (
    <div>
      {/* Input Controls */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 p-5 mb-6 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Location</label>
            <div className="relative">
              <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {INDIAN_STATES.slice(0, 15).map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Crop</label>
            <div className="relative">
              <Wheat size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <select
                value={crop}
                onChange={(e) => setCrop(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {CROP_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Radius: {radius} km</label>
            <input
              type="range"
              min={50}
              max={800}
              step={50}
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
              className="w-full mt-2 accent-green-600"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Sort By</label>
            <div className="relative">
              <SlidersHorizontal size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortBy)}
                className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="price-desc">Highest Price</option>
                <option value="price-asc">Lowest Price</option>
                <option value="distance">Nearest First</option>
                <option value="profit">Best Profit</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 size={28} className="animate-spin text-green-500" />
          <span className="ml-3 text-sm text-gray-500">Finding nearby mandis...</span>
        </div>
      ) : sorted.length === 0 ? (
        <div className="text-center py-16">
          <Route size={32} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">No mandis found within {radius} km.</p>
          <p className="text-gray-400 text-xs mt-1">Try increasing the radius or changing your crop.</p>
        </div>
      ) : (
        <>
          <p className="text-xs text-gray-500 mb-3 font-medium">{sorted.length} mandis found within {radius} km</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sorted.map((m, i) => (
              <motion.div key={m.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                <MandiCard mandi={m} sortBy={sortBy} />
              </motion.div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default NearbyMandis;

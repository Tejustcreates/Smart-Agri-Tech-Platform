import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Search, SlidersHorizontal, Loader2 } from 'lucide-react';
import { SearchFilters, EquipmentCategory, AvailabilityFilter } from '../../types/equipment';
import { INDIAN_STATES } from '../../constants';

const CATEGORIES: EquipmentCategory[] = ['Tractor', 'Harvester', 'Rotavator', 'Seeder', 'Sprayer', 'Cultivator', 'Thresher', 'Plough', 'Others'];
const AVAILABILITY: { value: AvailabilityFilter; label: string }[] = [
  { value: 'today', label: 'Today' },
  { value: 'tomorrow', label: 'Tomorrow' },
  { value: 'this-week', label: 'This Week' },
  { value: 'any', label: 'Any Time' },
];

interface SearchPanelProps {
  filters: SearchFilters;
  onFiltersChange: (f: SearchFilters) => void;
  onSearch: () => void;
  loading: boolean;
}

const SearchPanel: React.FC<SearchPanelProps> = ({ filters, onFiltersChange, onSearch, loading }) => {
  const [locationLoading, setLocationLoading] = useState(false);

  useEffect(() => {
    if (!filters.location && navigator.geolocation) {
      setLocationLoading(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          onFiltersChange({ ...filters, location: 'Current Location', lat: pos.coords.latitude, lng: pos.coords.longitude });
          setLocationLoading(false);
        },
        () => {
          onFiltersChange({ ...filters, location: 'Pune, Maharashtra' });
          setLocationLoading(false);
        }
      );
    }
  }, []);

  const update = <K extends keyof SearchFilters>(key: K, val: SearchFilters[K]) => {
    onFiltersChange({ ...filters, [key]: val });
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-5">
        {/* Location */}
        <div className="lg:col-span-2">
          <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Location</label>
          <div className="relative">
            <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <select
              value={filters.location}
              onChange={(e) => update('location', e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {INDIAN_STATES.slice(0, 15).map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Category</label>
          <div className="relative">
            <SlidersHorizontal size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <select
              value={filters.category}
              onChange={(e) => update('category', e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">All Categories</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {/* Availability */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Availability</label>
          <select
            value={filters.availability}
            onChange={(e) => update('availability', e.target.value as AvailabilityFilter)}
            className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            {AVAILABILITY.map((a) => <option key={a.value} value={a.value}>{a.label}</option>)}
          </select>
        </div>

        {/* Radius */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Radius: {filters.radius} km</label>
          <input
            type="range"
            min={5}
            max={50}
            step={5}
            value={filters.radius}
            onChange={(e) => update('radius', Number(e.target.value))}
            className="w-full mt-2 accent-green-600"
          />
          <div className="flex justify-between text-[10px] text-gray-400 mt-0.5">
            <span>5km</span><span>50km</span>
          </div>
        </div>
      </div>

      {/* Budget Slider */}
      <div className="mb-5">
        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">
          Max Budget: {filters.maxBudget > 0 ? `₹${filters.maxBudget.toLocaleString()}/day` : 'No limit'}
        </label>
        <input
          type="range"
          min={0}
          max={10000}
          step={500}
          value={filters.maxBudget}
          onChange={(e) => update('maxBudget', Number(e.target.value))}
          className="w-full accent-green-600"
        />
        <div className="flex justify-between text-[10px] text-gray-400 mt-0.5">
          <span>No limit</span><span>₹10,000/day</span>
        </div>
      </div>

      {/* Search Button */}
      <button
        onClick={onSearch}
        disabled={loading}
        className="w-full py-3.5 bg-green-600 text-white rounded-xl font-semibold text-sm hover:bg-green-700 disabled:bg-green-400 transition-all shadow-sm shadow-green-200 active:scale-[0.98] flex items-center justify-center gap-2"
      >
        {loading ? (
          <><Loader2 size={16} className="animate-spin" /> Searching...</>
        ) : (
          <><Search size={16} /> Search Nearby Equipment</>
        )}
      </button>
    </div>
  );
};

export default SearchPanel;

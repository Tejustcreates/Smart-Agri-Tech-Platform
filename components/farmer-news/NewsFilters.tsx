import React from 'react';
import { CROP_OPTIONS, INDIAN_STATES } from '../../constants';

const CATEGORIES = [
  { id: 'all', label: 'All', emoji: '🌾' },
  { id: 'market', label: 'Market', emoji: '💰' },
  { id: 'weather', label: 'Weather', emoji: '🌧' },
  { id: 'schemes', label: 'Govt Schemes', emoji: '🏛' },
  { id: 'crops', label: 'Crops', emoji: '🌱' },
  { id: 'disease', label: 'Disease', emoji: '🐛' },
  { id: 'technology', label: 'Technology', emoji: '🚜' },
  { id: 'msp', label: 'MSP', emoji: '📈' },
];

interface NewsFiltersProps {
  selectedCategory: string;
  onCategoryChange: (id: string) => void;
  selectedState: string;
  onStateChange: (s: string) => void;
  selectedCrop: string;
  onCropChange: (c: string) => void;
  articleCount: number;
  showMobile: boolean;
  onToggleMobile: () => void;
}

const NewsFilters: React.FC<NewsFiltersProps> = ({
  selectedCategory, onCategoryChange,
  selectedState, onStateChange,
  selectedCrop, onCropChange,
  articleCount, showMobile, onToggleMobile,
}) => (
  <div className="mb-8">
    {/* Filters Row */}
    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-5 mb-5 border border-green-100/60">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2">
          <span>⚙️</span> Personalize Your Feed
        </h3>
        <button onClick={onToggleMobile} className="text-green-600 font-medium text-xs md:hidden">
          {showMobile ? 'Hide' : 'Show'} Filters
        </button>
      </div>
      <div className={`grid grid-cols-1 md:grid-cols-2 gap-3 ${showMobile ? '' : 'hidden md:grid'}`}>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">State</label>
          <select
            value={selectedState}
            onChange={(e) => onStateChange(e.target.value)}
            className="w-full px-3 py-2.5 bg-white rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value="">All States</option>
            {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Crop</label>
          <select
            value={selectedCrop}
            onChange={(e) => onCropChange(e.target.value)}
            className="w-full px-3 py-2.5 bg-white rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value="">All Crops</option>
            {CROP_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>
      {(selectedState || selectedCrop) && (
        <div className="flex flex-wrap gap-2 mt-3">
          {selectedState && (
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold flex items-center gap-1">
              📍 {selectedState}
              <button onClick={() => onStateChange('')} className="ml-1 text-green-500 hover:text-green-800">×</button>
            </span>
          )}
          {selectedCrop && (
            <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-semibold flex items-center gap-1">
              🌱 {selectedCrop}
              <button onClick={() => onCropChange('')} className="ml-1 text-amber-500 hover:text-amber-800">×</button>
            </span>
          )}
          <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-xs">{articleCount} articles</span>
        </div>
      )}
    </div>

    {/* Category Chips */}
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
      {CATEGORIES.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onCategoryChange(cat.id)}
          className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 whitespace-nowrap ${
            selectedCategory === cat.id
              ? 'bg-green-600 text-white shadow-md shadow-green-200'
              : 'bg-white text-gray-600 border border-gray-200 hover:border-green-300 hover:text-green-700'
          }`}
        >
          <span>{cat.emoji}</span>
          {cat.label}
        </button>
      ))}
    </div>
  </div>
);

export default NewsFilters;

import React from 'react';
import { CROP_OPTIONS, INDIAN_STATES } from '../../constants';

const CATEGORIES = [
  { id: 'all', label: 'All', icon: 'fas fa-globe' },
  { id: 'market', label: 'Market', icon: 'fas fa-chart-line' },
  { id: 'weather', label: 'Weather', icon: 'fas fa-cloud-sun' },
  { id: 'schemes', label: 'Govt Schemes', icon: 'fas fa-landmark' },
  { id: 'crops', label: 'Crops', icon: 'fas fa-seedling' },
  { id: 'disease', label: 'Disease', icon: 'fas fa-bug' },
  { id: 'technology', label: 'Technology', icon: 'fas fa-tractor' },
  { id: 'msp', label: 'MSP', icon: 'fas fa-coins' },
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
    <div className="bg-gradient-to-r from-brand-50 to-emerald-50 rounded-2xl p-5 mb-5 border border-brand-100/60">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2">
          <i className="fas fa-sliders-h text-brand-600" /> Personalize Your Feed
        </h3>
        <button onClick={onToggleMobile} className="tap-target text-brand-600 font-medium text-xs md:hidden">
          {showMobile ? 'Hide' : 'Show'} Filters
        </button>
      </div>
      <div className={`grid grid-cols-1 md:grid-cols-2 gap-3 ${showMobile ? '' : 'hidden md:grid'}`}>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">State</label>
          <div className="relative">
            <i className="fas fa-map-marker-alt absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none" />
            <select
              value={selectedState}
              onChange={(e) => onStateChange(e.target.value)}
              className="tap-target w-full pl-9 pr-3 py-2.5 bg-white rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 appearance-none"
            >
              <option value="">All States</option>
              {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <i className="fas fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-[10px] pointer-events-none" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Crop</label>
          <div className="relative">
            <i className="fas fa-seedling absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none" />
            <select
              value={selectedCrop}
              onChange={(e) => onCropChange(e.target.value)}
              className="tap-target w-full pl-9 pr-3 py-2.5 bg-white rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 appearance-none"
            >
              <option value="">All Crops</option>
              {CROP_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <i className="fas fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-[10px] pointer-events-none" />
          </div>
        </div>
      </div>
      {(selectedState || selectedCrop) && (
        <div className="flex flex-wrap gap-2 mt-3">
          {selectedState && (
            <span className="px-3 py-1 bg-brand-100 text-brand-700 rounded-full text-xs font-semibold flex items-center gap-1">
              <i className="fas fa-map-marker-alt text-[10px]" /> {selectedState}
              <button onClick={() => onStateChange('')} className="tap-target ml-1 text-brand-500 hover:text-brand-800">×</button>
            </span>
          )}
          {selectedCrop && (
            <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-semibold flex items-center gap-1">
              <i className="fas fa-seedling text-[10px]" /> {selectedCrop}
              <button onClick={() => onCropChange('')} className="tap-target ml-1 text-amber-500 hover:text-amber-800">×</button>
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
          className={`tap-target flex-shrink-0 px-4 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 whitespace-nowrap ${
            selectedCategory === cat.id
              ? 'bg-brand-600 text-white shadow-md shadow-brand-200'
              : 'bg-white text-gray-600 border border-gray-200 hover:border-brand-300 hover:text-brand-700'
          }`}
        >
          <i className={`${cat.icon} text-xs`} />
          {cat.label}
        </button>
      ))}
    </div>
  </div>
);

export default NewsFilters;

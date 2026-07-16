import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { SchemeFilters, SortOption } from '../../types/scheme';

interface SearchBarProps {
  filters: SchemeFilters;
  onFiltersChange: (f: SchemeFilters) => void;
  resultCount: number;
}

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'match', label: 'Highest Match' },
  { value: 'newest', label: 'Newest' },
  { value: 'central', label: 'Central' },
  { value: 'state', label: 'State' },
];

const SearchBar: React.FC<SearchBarProps> = ({ filters, onFiltersChange, resultCount }) => {
  const [showSort, setShowSort] = useState(false);

  return (
    <div className="mb-6">
      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
            placeholder="Search schemes by name, ministry, or keyword..."
            className="w-full pl-11 pr-4 py-3 bg-white rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all shadow-sm"
          />
          {filters.search && (
            <button
              onClick={() => onFiltersChange({ ...filters, search: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={16} />
            </button>
          )}
        </div>
        <div className="relative">
          <button
            onClick={() => setShowSort(!showSort)}
            className="p-3 bg-white rounded-xl border border-gray-200 hover:bg-green-50 hover:border-green-300 transition-all shadow-sm flex items-center gap-2"
          >
            <SlidersHorizontal size={16} className="text-gray-500" />
            <span className="text-sm font-medium text-gray-600 hidden sm:inline">
              {SORT_OPTIONS.find((o) => o.value === filters.sort)?.label}
            </span>
          </button>
          <AnimatePresence>
            {showSort && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="absolute top-full right-0 mt-1 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 min-w-[160px]"
              >
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => { onFiltersChange({ ...filters, sort: opt.value }); setShowSort(false); }}
                    className={`w-full px-4 py-2.5 text-left text-sm hover:bg-green-50 transition-colors ${
                      filters.sort === opt.value ? 'bg-green-50 text-green-700 font-semibold' : 'text-gray-600'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Level Filter Chips */}
      <div className="flex items-center gap-2 mt-3 flex-wrap">
        {(['all', 'Central', 'State'] as const).map((level) => (
          <button
            key={level}
            onClick={() => onFiltersChange({ ...filters, level })}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              filters.level === level
                ? 'bg-green-600 text-white shadow-sm'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            {level === 'all' ? 'All Schemes' : `${level} Schemes`}
          </button>
        ))}
        <span className="text-xs text-gray-400 ml-1">{resultCount} schemes found</span>
      </div>
    </div>
  );
};

export default SearchBar;

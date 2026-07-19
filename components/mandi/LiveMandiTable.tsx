import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, ArrowUp, ArrowDown, Minus, Loader2 } from 'lucide-react';
import { LivePrice, PriceFilters } from '../../types/mandi';
import { getLivePrices } from '../../services/mandi/mandiApi';
import SearchBar from './SearchBar';
import FilterPanel from './FilterPanel';

const LiveMandiTable: React.FC = () => {
  const [prices, setPrices] = useState<LivePrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<PriceFilters>({
    state: '', district: '', crop: '', date: '', search: '',
  });

  useEffect(() => {
    getLivePrices().then(setPrices).finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return prices.filter((p) => {
      if (filters.search && !p.crop.toLowerCase().includes(filters.search.toLowerCase()) && !p.mandi.toLowerCase().includes(filters.search.toLowerCase())) return false;
      if (filters.state && p.state !== filters.state) return false;
      if (filters.district && !p.district.toLowerCase().includes(filters.district.toLowerCase())) return false;
      if (filters.crop && p.crop !== filters.crop) return false;
      return true;
    });
  }, [prices, filters]);

  const updateFilter = (key: keyof PriceFilters, val: string) => setFilters((f) => ({ ...f, [key]: val }));

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 size={28} className="animate-spin text-brand-500" />
        <span className="ml-3 text-sm text-gray-500">Loading live prices...</span>
      </div>
    );
  }

  return (
    <div>
      {/* Search + Filters — stacked on mobile */}
      <div className="flex flex-col gap-3 mb-5">
        <div className="w-full">
          <SearchBar value={filters.search} onChange={(v) => updateFilter('search', v)} placeholder="Search crop or mandi..." />
        </div>
      </div>
      <FilterPanel
        state={filters.state} onStateChange={(v) => updateFilter('state', v)}
        district={filters.district} onDistrictChange={(v) => updateFilter('district', v)}
        crop={filters.crop} onCropChange={(v) => updateFilter('crop', v)}
        date={filters.date} onDateChange={(v) => updateFilter('date', v)}
      />

      {/* Desktop Table — lg and above only */}
      <div className="hidden lg:block mt-5 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              {['Crop', 'Mandi', 'District', 'State', 'Min Price', 'Max Price', 'Modal Price', 'Change', 'Updated'].map((h) => (
                <th key={h} className="text-left py-3 px-3 text-xs font-bold text-gray-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((p, i) => (
              <motion.tr
                key={p.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.02 }}
                className="border-b border-gray-50 hover:bg-brand-50/50 transition-colors"
              >
                <td className="py-3 px-3 font-semibold text-gray-800">{p.crop}</td>
                <td className="py-3 px-3 text-gray-700">{p.mandi}</td>
                <td className="py-3 px-3 text-gray-500">{p.district}</td>
                <td className="py-3 px-3">
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-[10px] font-semibold">{p.state}</span>
                </td>
                <td className="py-3 px-3 text-gray-600">₹{p.minPrice.toLocaleString()}</td>
                <td className="py-3 px-3 text-gray-600">₹{p.maxPrice.toLocaleString()}</td>
                <td className="py-3 px-3 font-bold text-gray-800">₹{p.modalPrice.toLocaleString()}</td>
                <td className="py-3 px-3">
                  <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    p.change > 0 ? 'bg-emerald-50 text-emerald-700' : p.change < 0 ? 'bg-red-50 text-red-700' : 'bg-gray-50 text-gray-600'
                  }`}>
                    {p.change > 0 ? <ArrowUp size={10} /> : p.change < 0 ? <ArrowDown size={10} /> : <Minus size={10} />}
                    {Math.abs(p.change)}%
                  </span>
                </td>
                <td className="py-3 px-3 text-xs text-gray-400">{p.lastUpdated}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400 text-sm">No prices match your filters.</div>
        )}
      </div>

      {/* Mobile Stacked Cards — below lg */}
      <div className="lg:hidden mt-4 space-y-3">
        {filtered.map((p) => {
          const isUp = p.change > 0;
          const isDown = p.change < 0;
          return (
            <div key={p.id} className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100 p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="min-w-0 flex-1">
                  <h4 className="text-lg font-extrabold text-gray-800 leading-tight">{p.crop}</h4>
                  <p className="text-xs text-gray-400 mt-0.5">{p.mandi}, {p.district}</p>
                </div>
                <span className={`inline-flex items-center gap-0.5 px-2.5 py-1 rounded-full text-xs font-bold flex-shrink-0 ${
                  isUp ? 'bg-emerald-50 text-emerald-700' : isDown ? 'bg-red-50 text-red-700' : 'bg-gray-50 text-gray-600'
                }`}>
                  {isUp ? <ArrowUp size={12} /> : isDown ? <ArrowDown size={12} /> : <Minus size={12} />}
                  {Math.abs(p.change)}%
                </span>
              </div>
              <div className="flex items-baseline gap-2 mb-3">
                <span className={`text-2xl font-extrabold ${isUp ? 'text-emerald-700' : isDown ? 'text-red-700' : 'text-gray-800'}`}>
                  ₹{p.modalPrice.toLocaleString()}
                </span>
                <span className="text-xs text-gray-400">modal / quintal</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="bg-gray-50 rounded-lg p-2">
                  <p className="text-[10px] text-gray-400">Min</p>
                  <p className="text-xs font-bold text-gray-700">₹{p.minPrice.toLocaleString()}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-2">
                  <p className="text-[10px] text-gray-400">Max</p>
                  <p className="text-xs font-bold text-gray-700">₹{p.maxPrice.toLocaleString()}</p>
                </div>
              </div>
              <p className="text-[10px] text-gray-400 mt-2 text-right">Updated {p.lastUpdated}</p>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-gray-400 mt-4 text-center">{filtered.length} results found</p>
    </div>
  );
};

export default LiveMandiTable;

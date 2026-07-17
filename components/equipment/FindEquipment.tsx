import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Search } from 'lucide-react';
import { EquipmentListing, SearchFilters } from '../../types/equipment';
import { searchEquipment } from '../../services/equipment/equipmentService';
import SearchPanel from './SearchPanel';
import EquipmentCard from './EquipmentCard';
import EquipmentDetailsModal from './EquipmentDetailsModal';
import MapPlaceholder from './MapPlaceholder';

const FindEquipment: React.FC = () => {
  const [filters, setFilters] = useState<SearchFilters>({
    lat: 0, lng: 0, radius: 20, category: '', availability: 'any', maxBudget: 0,
  });
  const [results, setResults] = useState<EquipmentListing[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [selectedListing, setSelectedListing] = useState<EquipmentListing | null>(null);

  const handleSearch = async () => {
    if (filters.lat === 0 && filters.lng === 0) return;
    setLoading(true);
    setSearched(true);
    try {
      const data = await searchEquipment(filters);
      setResults(data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <SearchPanel filters={filters} onFiltersChange={setFilters} onSearch={handleSearch} loading={loading} />

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white/60 rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
              <div className="h-48 bg-gray-200" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
                <div className="h-3 bg-gray-100 rounded w-full" />
                <div className="flex gap-2 mt-2">
                  <div className="h-8 bg-gray-200 rounded-xl flex-1" />
                  <div className="h-8 bg-gray-200 rounded-xl flex-1" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : searched && results.length > 0 ? (
        <>
          <MapPlaceholder listings={results} userLat={filters.lat} userLng={filters.lng} />
          <p className="text-sm font-semibold text-gray-700 mb-4">{results.length} equipment found within {filters.radius} km — sorted nearest first</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {results.map((l, i) => (
              <EquipmentCard key={l.id} listing={l} index={i} onViewDetails={setSelectedListing} />
            ))}
          </div>
        </>
      ) : searched && results.length === 0 ? (
        <div className="text-center py-16">
          <Search size={40} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">No equipment found within {filters.radius} km.</p>
          <p className="text-gray-400 text-xs mt-1">Try increasing the radius or changing the category.</p>
        </div>
      ) : (
        <div className="text-center py-20 flex flex-col items-center justify-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <Search size={32} className="text-green-500" />
          </div>
          <h3 className="text-lg font-bold text-gray-700 mb-2">Find Equipment Near You</h3>
          <p className="text-gray-500 text-sm max-w-md mb-6">
            Rent tractors, harvesters, and other farming tools directly from nearby farmers in your area.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-xs font-bold">1</span>
              Allow GPS or pick location
            </div>
            <span className="hidden sm:block text-gray-300">→</span>
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-xs font-bold">2</span>
              Pick category & radius
            </div>
            <span className="hidden sm:block text-gray-300">→</span>
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-xs font-bold">3</span>
              Hit Search
            </div>
          </div>
        </div>
      )}

      <EquipmentDetailsModal listing={selectedListing} onClose={() => setSelectedListing(null)} />
    </div>
  );
};

export default FindEquipment;

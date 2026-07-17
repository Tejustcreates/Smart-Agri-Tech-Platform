import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Search, SlidersHorizontal, Loader2, Navigation, RefreshCw } from 'lucide-react';
import { SearchFilters, EquipmentCategory, AvailabilityFilter, GpsLocation } from '../../types/equipment';
import { reverseGeocode } from '../../services/equipment/equipmentService';

const CATEGORIES: EquipmentCategory[] = ['Tractor', 'Harvester', 'Rotavator', 'Seeder', 'Sprayer', 'Cultivator', 'Thresher', 'Plough', 'Others'];
const AVAILABILITY: { value: AvailabilityFilter; label: string }[] = [
  { value: 'today', label: 'Today' },
  { value: 'tomorrow', label: 'Tomorrow' },
  { value: 'this-week', label: 'This Week' },
  { value: 'any', label: 'Any Time' },
];
const RADIUS_OPTIONS = [5, 10, 20, 30, 50, 100];

interface SearchPanelProps {
  filters: SearchFilters;
  onFiltersChange: (f: SearchFilters) => void;
  onSearch: () => void;
  loading: boolean;
}

const SearchPanel: React.FC<SearchPanelProps> = ({ filters, onFiltersChange, onSearch, loading }) => {
  const [gpsStatus, setGpsStatus] = useState<'idle' | 'loading' | 'granted' | 'denied' | 'manual'>('idle');
  const [locationInfo, setLocationInfo] = useState<GpsLocation | null>(null);
  const [mapClickEnabled, setMapClickEnabled] = useState(false);

  const detectLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setGpsStatus('denied');
      return;
    }
    setGpsStatus('loading');
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        onFiltersChange({ ...filters, lat, lng });
        const geo = await reverseGeocode(lat, lng);
        setLocationInfo(geo);
        setGpsStatus('granted');
      },
      () => {
        setGpsStatus('denied');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  useEffect(() => {
    if (filters.lat === 0 && filters.lng === 0) {
      detectLocation();
    } else if (gpsStatus === 'idle') {
      setGpsStatus('granted');
      reverseGeocode(filters.lat, filters.lng).then(setLocationInfo);
    }
  }, []);

  const handleMapClick = async (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mapClickEnabled) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    // Map bounds roughly Maharashtra area
    const lat = 19.5 - y * 5;
    const lng = 73.0 + x * 5;
    onFiltersChange({ ...filters, lat: Math.round(lat * 1000) / 1000, lng: Math.round(lng * 1000) / 1000 });
    const geo = await reverseGeocode(lat, lng);
    setLocationInfo(geo);
    setGpsStatus('manual');
    setMapClickEnabled(false);
  };

  const update = <K extends keyof SearchFilters>(key: K, val: SearchFilters[K]) => {
    onFiltersChange({ ...filters, [key]: val });
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
      {/* Location Status */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold text-gray-500 uppercase">Your Location</label>
          <div className="flex gap-2">
            <button
              onClick={detectLocation}
              className="flex items-center gap-1 px-2.5 py-1 bg-green-50 text-green-700 rounded-lg text-[10px] font-semibold hover:bg-green-100 transition-all"
            >
              <RefreshCw size={10} /> {gpsStatus === 'loading' ? 'Detecting...' : 'Auto-Detect GPS'}
            </button>
            <button
              onClick={() => { setMapClickEnabled(!mapClickEnabled); setGpsStatus('manual'); }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all ${
                mapClickEnabled ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <MapPin size={10} /> {mapClickEnabled ? 'Click map to set' : 'Pick on Map'}
            </button>
          </div>
        </div>

        {gpsStatus === 'loading' && (
          <div className="flex items-center gap-2 bg-blue-50 text-blue-700 rounded-xl px-4 py-3 text-sm">
            <Loader2 size={14} className="animate-spin" />
            Requesting GPS permission...
          </div>
        )}

        {gpsStatus === 'granted' && locationInfo && (
          <div className="bg-green-50 rounded-xl px-4 py-3">
            <div className="flex items-center gap-2 mb-1">
              <Navigation size={14} className="text-green-600" />
              <span className="text-sm font-bold text-green-700">
                {locationInfo.village || 'Location Detected'}
              </span>
              {locationInfo.pincode && <span className="text-[10px] text-green-600 bg-green-100 px-1.5 py-0.5 rounded-full">{locationInfo.pincode}</span>}
            </div>
            <p className="text-xs text-green-600 line-clamp-1">{locationInfo.address}</p>
            <p className="text-[10px] text-green-500 mt-1">Lat: {filters.lat.toFixed(4)}, Lng: {filters.lng.toFixed(4)}</p>
          </div>
        )}

        {gpsStatus === 'denied' && (
          <div className="bg-amber-50 rounded-xl px-4 py-3">
            <p className="text-sm font-semibold text-amber-700 mb-1">GPS permission denied</p>
            <p className="text-xs text-amber-600">Click "Pick on Map" then tap anywhere on the map below to set your location.</p>
          </div>
        )}

        {gpsStatus === 'manual' && locationInfo && (
          <div className="bg-amber-50 rounded-xl px-4 py-3">
            <div className="flex items-center gap-2 mb-1">
              <MapPin size={14} className="text-amber-600" />
              <span className="text-sm font-bold text-amber-700">{locationInfo.village || 'Manually Selected'}</span>
            </div>
            <p className="text-xs text-amber-600 line-clamp-1">{locationInfo.address}</p>
            <p className="text-[10px] text-amber-500 mt-1">Lat: {filters.lat.toFixed(4)}, Lng: {filters.lng.toFixed(4)}</p>
          </div>
        )}

        {/* Interactive Map Placeholder */}
        {(gpsStatus === 'denied' || mapClickEnabled) && (
          <div
            onClick={handleMapClick}
            className={`mt-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 h-40 overflow-hidden relative transition-all ${
              mapClickEnabled ? 'border-dashed border-green-400 cursor-crosshair' : 'border-green-100'
            }`}
          >
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#16a34a 1px, transparent 1px), linear-gradient(90deg, #16a34a 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
            {filters.lat !== 0 && filters.lng !== 0 && (
              <div className="absolute" style={{ left: `${((filters.lng - 73) / 5) * 100}%`, top: `${((19.5 - filters.lat) / 5) * 100}%`, transform: 'translate(-50%, -100%)' }}>
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                  <MapPin size={12} className="text-white" />
                </div>
              </div>
            )}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-white/90 px-3 py-1 rounded-full text-[10px] font-semibold text-gray-600 shadow">
              {mapClickEnabled ? '📍 Tap anywhere to drop a pin' : '🗺️ Map Preview — Google Maps integration coming soon'}
            </div>
          </div>
        )}
      </div>

      {/* Filters Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
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
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Max Budget: {filters.maxBudget > 0 ? `₹${filters.maxBudget.toLocaleString()}/day` : 'No limit'}</label>
          <input
            type="range"
            min={0}
            max={10000}
            step={500}
            value={filters.maxBudget}
            onChange={(e) => update('maxBudget', Number(e.target.value))}
            className="w-full accent-green-600"
          />
          <p className="text-[10px] text-gray-400 mt-1">
            {filters.maxBudget === 0 ? '↔ Drag to set a budget limit' : 'Drag left to clear budget limit'}
          </p>
        </div>
      </div>

      {/* Radius Chips */}
      <div className="mb-5">
        <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Search Radius</label>
        <div className="flex flex-wrap gap-2">
          {RADIUS_OPTIONS.map((r) => (
            <button
              key={r}
              onClick={() => update('radius', r)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                filters.radius === r
                  ? 'bg-green-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              {r} KM
            </button>
          ))}
        </div>
      </div>

      {/* Search Button */}
      <button
        onClick={onSearch}
        disabled={loading || (filters.lat === 0 && filters.lng === 0)}
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

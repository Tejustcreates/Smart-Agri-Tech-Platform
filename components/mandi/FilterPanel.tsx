import React from 'react';
import { Wheat, Navigation, Loader2, MapPin } from 'lucide-react';
import { CROP_OPTIONS } from '../../constants';
import { GpsLocation } from '../../services/shared/locationService';

interface FilterPanelProps {
  crop: string;
  onCropChange: (v: string) => void;
  date?: string;
  onDateChange?: (v: string) => void;
  location: GpsLocation | null;
  gpsStatus: 'idle' | 'loading' | 'granted' | 'denied';
  onDetectGps: () => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  crop, onCropChange,
  date, onDateChange,
  location, gpsStatus, onDetectGps,
}) => (
  <div className="flex flex-wrap items-center gap-3">
    <button
      onClick={onDetectGps}
      disabled={gpsStatus === 'loading'}
      className="flex items-center gap-2 px-3 py-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl text-xs font-medium hover:bg-green-50 hover:border-green-300 transition-all active:scale-95 disabled:opacity-60"
    >
      {gpsStatus === 'loading' ? (
        <Loader2 size={14} className="animate-spin text-green-500" />
      ) : gpsStatus === 'granted' && location ? (
        <Navigation size={14} className="text-green-600" />
      ) : (
        <MapPin size={14} className="text-gray-400" />
      )}
      <span className={gpsStatus === 'granted' && location ? 'text-green-700' : 'text-gray-600'}>
        {gpsStatus === 'loading' ? 'Detecting...' : gpsStatus === 'granted' && location ? (location.village || location.district || 'Location set') : 'Detect Location'}
      </span>
    </button>

    {location && gpsStatus === 'granted' && (
      <span className="text-[10px] text-gray-400 hidden sm:inline">
        {location.state && `${location.state}`}{location.district && `, ${location.district}`}
      </span>
    )}

    <div className="relative">
      <Wheat size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
      <select
        value={crop}
        onChange={(e) => onCropChange(e.target.value)}
        className="pl-9 pr-6 py-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none"
      >
        <option value="">All Crops</option>
        {CROP_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
      </select>
    </div>

    {onDateChange && (
      <input
        type="date"
        value={date || ''}
        onChange={(e) => onDateChange(e.target.value)}
        className="px-3 py-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-green-500"
      />
    )}
  </div>
);

export default FilterPanel;

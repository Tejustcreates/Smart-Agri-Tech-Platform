import React from 'react';
import { Wheat, Navigation, Loader2, MapPin, Calendar } from 'lucide-react';
import { CROP_OPTIONS } from '../../constants';

interface FilterPanelProps {
  state?: string;
  onStateChange?: (v: string) => void;
  district?: string;
  onDistrictChange?: (v: string) => void;
  crop: string;
  onCropChange: (v: string) => void;
  date?: string;
  onDateChange?: (v: string) => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  crop, onCropChange,
  date, onDateChange,
}) => (
  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
    <div className="relative flex-1">
      <Wheat size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
      <select
        value={crop}
        onChange={(e) => onCropChange(e.target.value)}
        className="tap-target w-full pl-9 pr-6 py-2.5 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 appearance-none"
      >
        <option value="">All Crops</option>
        {CROP_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
      </select>
    </div>

    {onDateChange && (
      <div className="relative flex-1">
        <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        <input
          type="date"
          value={date || ''}
          onChange={(e) => onDateChange(e.target.value)}
          className="tap-target w-full pl-9 pr-3 py-2.5 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
        />
      </div>
    )}
  </div>
);

export default FilterPanel;

import React from 'react';
import { MapPin, Wheat, CircleDollarSign, Route } from 'lucide-react';
import { INDIAN_STATES, CROP_OPTIONS } from '../../constants';

interface FilterPanelProps {
  state: string;
  onStateChange: (v: string) => void;
  district: string;
  onDistrictChange: (v: string) => void;
  crop: string;
  onCropChange: (v: string) => void;
  date?: string;
  onDateChange?: (v: string) => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  state, onStateChange,
  district, onDistrictChange,
  crop, onCropChange,
  date, onDateChange,
}) => (
  <div className="flex flex-wrap items-center gap-3">
    <div className="relative">
      <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
      <select
        value={state}
        onChange={(e) => onStateChange(e.target.value)}
        className="pl-9 pr-6 py-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none"
      >
        <option value="">All States</option>
        {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
      </select>
    </div>

    <input
      type="text"
      value={district}
      onChange={(e) => onDistrictChange(e.target.value)}
      placeholder="District"
      className="px-3 py-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-green-500 w-32"
    />

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

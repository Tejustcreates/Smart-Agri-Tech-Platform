import React from 'react';
import { Select, DatePicker } from 'antd';
import dayjs from 'dayjs';
import { Wheat, MapPin, Navigation } from 'lucide-react';
import { CROP_OPTIONS } from '../../constants';

interface FilterPanelProps {
  state?: string;
  onStateChange?: (v: string) => void;
  stateOptions?: string[];
  district?: string;
  onDistrictChange?: (v: string) => void;
  districtOptions?: string[];
  crop: string;
  onCropChange: (v: string) => void;
  date?: string;
  onDateChange?: (v: string) => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  state, onStateChange, stateOptions = [],
  district, onDistrictChange, districtOptions = [],
  crop, onCropChange,
  date, onDateChange,
}) => (
  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-wrap">
    <Select
      value={crop || undefined}
      onChange={(v) => onCropChange(v || '')}
      allowClear
      placeholder="All Crops"
      suffixIcon={<Wheat size={14} className="text-gray-400" />}
      className="tap-target flex-1 min-w-[140px]"
      options={CROP_OPTIONS.map((c) => ({ value: c, label: c }))}
    />

    {onStateChange && (
      <Select
        value={state || undefined}
        onChange={(v) => { onStateChange(v || ''); onDistrictChange?.(''); }}
        allowClear
        showSearch
        placeholder="All States"
        suffixIcon={<MapPin size={14} className="text-gray-400" />}
        className="tap-target flex-1 min-w-[140px]"
        options={stateOptions.map((s) => ({ value: s, label: s }))}
      />
    )}

    {onDistrictChange && (
      <Select
        value={district || undefined}
        onChange={(v) => onDistrictChange(v || '')}
        allowClear
        showSearch
        disabled={!state}
        placeholder={state ? 'All Districts' : 'Select state first'}
        suffixIcon={<Navigation size={14} className="text-gray-400" />}
        className="tap-target flex-1 min-w-[140px]"
        options={districtOptions.map((d) => ({ value: d, label: d }))}
      />
    )}

    {onDateChange && (
      <DatePicker
        value={date ? dayjs(date) : null}
        onChange={(d) => onDateChange(d ? d.format('YYYY-MM-DD') : '')}
        placeholder="Select date"
        className="tap-target flex-1 min-w-[140px]"
      />
    )}
  </div>
);

export default FilterPanel;

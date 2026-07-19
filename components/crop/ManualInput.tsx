import React from 'react';
import { SensorPayload } from '../../types/sensor';

interface ManualInputProps {
  sensorData: SensorPayload;
  onChange: (data: SensorPayload) => void;
  season: string;
  onSeasonChange: (s: string) => void;
  soilType: string;
  onSoilTypeChange: (s: string) => void;
  landSize: number;
  onLandSizeChange: (n: number) => void;
  onPredict: () => void;
  predicting: boolean;
}

const SEASONS = ['Kharif', 'Rabi', 'Zaid'];
const SOIL_TYPES = ['Sandy', 'Loamy', 'Clay', 'Silty', 'Black', 'Red'];

function interpretValue(key: string, val: number): { text: string; color: string } {
  switch (key) {
    case 'nitrogen':
      if (val < 20) return { text: 'Low — needs nitrogen fertilizer', color: 'text-red-600' };
      if (val <= 80) return { text: 'Good — most crops grow well', color: 'text-green-600' };
      return { text: 'High — reduce fertilizer', color: 'text-amber-600' };
    case 'phosphorus':
      if (val < 15) return { text: 'Low — crops may struggle to root', color: 'text-red-600' };
      if (val <= 50) return { text: 'Good — healthy phosphorus level', color: 'text-green-600' };
      return { text: 'High — no extra P needed', color: 'text-amber-600' };
    case 'potassium':
      if (val < 15) return { text: 'Low — weak stems likely', color: 'text-red-600' };
      if (val <= 50) return { text: 'Good — supports plant health', color: 'text-green-600' };
      return { text: 'High — excess may burn roots', color: 'text-amber-600' };
    case 'ph':
      if (val < 5.5) return { text: 'Very acidic — needs lime treatment', color: 'text-red-600' };
      if (val <= 7.5) return { text: 'Good — most crops grow well here', color: 'text-green-600' };
      return { text: 'Too alkaline — needs sulfur', color: 'text-amber-600' };
    case 'temperature':
      if (val < 15) return { text: 'Cold — only winter crops thrive', color: 'text-blue-600' };
      if (val <= 35) return { text: 'Good — ideal for most crops', color: 'text-green-600' };
      return { text: 'Very hot — heat-sensitive crops at risk', color: 'text-red-600' };
    case 'rainfall':
      if (val < 50) return { text: 'Low — irrigation needed', color: 'text-amber-600' };
      if (val <= 200) return { text: 'Good — adequate rainfall', color: 'text-green-600' };
      return { text: 'Heavy — risk of waterlogging', color: 'text-blue-600' };
    default:
      return { text: '', color: 'text-gray-400' };
  }
}

const sliders = [
  { key: 'nitrogen' as const, label: 'Nitrogen (N)', unit: 'kg/ha', min: 0, max: 100, step: 1 },
  { key: 'phosphorus' as const, label: 'Phosphorus (P)', unit: 'kg/ha', min: 0, max: 60, step: 1 },
  { key: 'potassium' as const, label: 'Potassium (K)', unit: 'kg/ha', min: 0, max: 60, step: 1 },
  { key: 'ph' as const, label: 'Soil pH', unit: '', min: 4, max: 9, step: 0.1 },
  { key: 'temperature' as const, label: 'Temperature', unit: '°C', min: 5, max: 45, step: 1 },
  { key: 'rainfall' as const, label: 'Rainfall', unit: 'mm', min: 0, max: 300, step: 5 },
];

const ManualInput: React.FC<ManualInputProps> = ({ sensorData, onChange, season, onSeasonChange, soilType, onSoilTypeChange, landSize, onLandSizeChange, onPredict, predicting }) => {
  const update = (key: string, val: number) => {
    onChange({ ...sensorData, [key]: val });
  };

  return (
    <div className="space-y-5 pb-20 lg:pb-0">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {sliders.map((s) => {
          const val = typeof sensorData[s.key] === 'number' ? sensorData[s.key] : 0;
          const interp = interpretValue(s.key, val);
          return (
            <div key={s.key}>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {s.label} <span className="text-gray-400">({s.unit})</span>
              </label>
              <input
                type="range"
                min={s.min}
                max={s.max}
                step={s.step}
                value={val}
                onChange={(e) => update(s.key, Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-600 tap-target"
              />
              <div className="flex justify-between items-center text-xs mt-1">
                <span className="text-gray-400">{s.min}</span>
                <span className="font-semibold text-brand-600">{s.step < 1 ? val.toFixed(1) : Math.round(val)} {s.unit}</span>
                <span className="text-gray-400">{s.max}</span>
              </div>
              {interp.text && (
                <p className={`text-xs font-medium mt-1 ${interp.color}`}>{interp.text}</p>
              )}
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Season</label>
          <select value={season} onChange={(e) => onSeasonChange(e.target.value)} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 tap-target">
            {SEASONS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Soil Type</label>
          <select value={soilType} onChange={(e) => onSoilTypeChange(e.target.value)} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 tap-target">
            {SOIL_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Land Size (Acres)</label>
          <input
            type="number"
            min={0.1}
            max={100}
            step={0.1}
            value={landSize}
            onChange={(e) => { const v = parseFloat(e.target.value); onLandSizeChange(isNaN(v) ? 1 : Math.min(100, Math.max(0.1, v))); }}
            className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 tap-target"
          />
        </div>
      </div>

      {/* Sticky submit on mobile */}
      <div className="fixed bottom-0 left-0 right-0 lg:relative lg:bottom-auto p-4 bg-white border-t border-gray-200 lg:border-0 lg:p-0 lg:bg-transparent z-40 shadow-[0_-2px_10px_rgba(0,0,0,0.08)] lg:shadow-none">
        <button
          onClick={onPredict}
          disabled={predicting}
          className="w-full py-4 bg-brand-600 text-white rounded-xl hover:bg-brand-800 disabled:bg-brand-400 transition-all font-semibold text-base flex items-center justify-center gap-2 shadow-sm active:scale-[0.98] tap-target"
        >
          {predicting ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <i className="fas fa-seedling"></i>
              Get Crop Recommendation
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ManualInput;

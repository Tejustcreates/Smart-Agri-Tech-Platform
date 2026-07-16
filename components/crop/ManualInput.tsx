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
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {sliders.map((s) => (
          <div key={s.key}>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              {s.label} <span className="text-gray-400">({s.unit})</span>
            </label>
            <input
              type="range"
              min={s.min}
              max={s.max}
              step={s.step}
              value={sensorData[s.key]}
              onChange={(e) => update(s.key, Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>{s.min}</span>
              <span className="font-semibold text-green-600">{typeof sensorData[s.key] === 'number' ? (s.step < 1 ? sensorData[s.key].toFixed(1) : Math.round(sensorData[s.key])) : sensorData[s.key]} {s.unit}</span>
              <span>{s.max}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Season</label>
          <select value={season} onChange={(e) => onSeasonChange(e.target.value)} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
            {SEASONS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Soil Type</label>
          <select value={soilType} onChange={(e) => onSoilTypeChange(e.target.value)} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
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
            className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      <button
        onClick={onPredict}
        disabled={predicting}
        className="w-full py-3.5 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:bg-green-400 transition-all font-semibold text-base flex items-center justify-center gap-2 shadow-sm active:scale-[0.98]"
      >
        {predicting ? (
          <>
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Analyzing...
          </>
        ) : 'Get Crop Recommendation'}
      </button>
    </div>
  );
};

export default ManualInput;

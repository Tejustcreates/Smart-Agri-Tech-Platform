import React from 'react';
import { SensorPayload } from '../../types/sensor';
import SensorCard from './SensorCard';
import { Thermometer, Droplets, Beaker, Wind, CloudRain, Sun, Zap, Waves, Leaf } from 'lucide-react';

interface IoTDashboardProps {
  sensorData: SensorPayload;
  connected: boolean;
  battery: number;
  wifi: number;
  lastSync: number | null;
  onConnect: () => void;
  onDisconnect: () => void;
  onSync: () => void;
  onRunPrediction: () => void;
  predicting: boolean;
}

function getStatus(val: number, min: number, max: number): 'Good' | 'Low' | 'High' {
  if (val < min * 1.1) return 'Low';
  if (val > max * 0.9) return 'High';
  return 'Good';
}

const IoTDashboard: React.FC<IoTDashboardProps> = ({ sensorData, connected, battery, wifi, lastSync, onConnect, onDisconnect, onSync, onRunPrediction, predicting }) => {
  const sensors = [
    { label: 'Nitrogen', value: sensorData.nitrogen.toFixed(1), unit: 'kg/ha', icon: <Leaf size={16} className="text-green-600" />, color: 'bg-green-50', status: getStatus(sensorData.nitrogen, 20, 80), trend: sensorData.nitrogen > 50 ? 'up' as const : 'down' as const },
    { label: 'Phosphorus', value: sensorData.phosphorus.toFixed(1), unit: 'kg/ha', icon: <Beaker size={16} className="text-orange-600" />, color: 'bg-orange-50', status: getStatus(sensorData.phosphorus, 15, 50), trend: 'stable' as const },
    { label: 'Potassium', value: sensorData.potassium.toFixed(1), unit: 'kg/ha', icon: <Zap size={16} className="text-purple-600" />, color: 'bg-purple-50', status: getStatus(sensorData.potassium, 15, 50), trend: 'stable' as const },
    { label: 'Moisture', value: sensorData.moisture.toFixed(1), unit: '%', icon: <Droplets size={16} className="text-blue-600" />, color: 'bg-blue-50', status: getStatus(sensorData.moisture, 30, 70), trend: 'up' as const },
    { label: 'pH', value: sensorData.ph.toFixed(1), unit: '', icon: <Waves size={16} className="text-teal-600" />, color: 'bg-teal-50', status: getStatus(sensorData.ph, 5.5, 7.5), trend: 'stable' as const },
    { label: 'Temperature', value: sensorData.temperature.toFixed(1), unit: '°C', icon: <Thermometer size={16} className="text-red-500" />, color: 'bg-red-50', status: getStatus(sensorData.temperature, 18, 35), trend: 'up' as const },
    { label: 'Humidity', value: sensorData.humidity.toFixed(1), unit: '%', icon: <Wind size={16} className="text-sky-600" />, color: 'bg-sky-50', status: getStatus(sensorData.humidity, 40, 80), trend: 'down' as const },
    { label: 'Rainfall', value: sensorData.rainfall.toFixed(0), unit: 'mm', icon: <CloudRain size={16} className="text-indigo-500" />, color: 'bg-indigo-50', status: getStatus(sensorData.rainfall, 40, 200), trend: 'stable' as const },
    { label: 'Light', value: sensorData.light.toFixed(0), unit: 'lux', icon: <Sun size={16} className="text-yellow-500" />, color: 'bg-yellow-50', status: getStatus(sensorData.light, 400, 1000), trend: 'up' as const },
    { label: 'EC', value: sensorData.ec.toFixed(2), unit: 'dS/m', icon: <Zap size={16} className="text-gray-600" />, color: 'bg-gray-50', status: getStatus(sensorData.ec, 0.5, 2.0), trend: 'stable' as const },
  ];

  const syncTime = lastSync ? new Date(lastSync).toLocaleTimeString() : 'Never';

  return (
    <div className="space-y-4">
      {/* ESP32 Status Card */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${connected ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`} />
            <div>
              <p className="text-sm font-bold text-gray-800">ESP32 Sensor Hub</p>
              <p className={`text-xs font-medium ${connected ? 'text-green-600' : 'text-gray-400'}`}>
                {connected ? 'Connected' : 'Disconnected'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1">🔋 {battery}%</span>
            <span className="flex items-center gap-1">📶 {wifi}%</span>
            <span>Last sync: {syncTime}</span>
          </div>
        </div>
      </div>

      {/* Sensor Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {sensors.map((s) => (
          <SensorCard key={s.label} {...s} />
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        {!connected ? (
          <button onClick={onConnect} className="px-5 py-2.5 bg-green-600 text-white rounded-xl text-sm font-semibold hover:bg-green-700 transition-all shadow-sm active:scale-95">
            Connect Device
          </button>
        ) : (
          <button onClick={onDisconnect} className="px-5 py-2.5 bg-gray-200 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-300 transition-all active:scale-95">
            Disconnect
          </button>
        )}
        <button onClick={onSync} disabled={!connected} className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 transition-all shadow-sm active:scale-95">
          Sync Data
        </button>
        <button onClick={onRunPrediction} className="px-5 py-2.5 bg-green-600 text-white rounded-xl text-sm font-semibold hover:bg-green-700 transition-all shadow-sm active:scale-95">
          {predicting ? 'Analyzing...' : 'Run Prediction'}
        </button>
      </div>
    </div>
  );
};

export default IoTDashboard;

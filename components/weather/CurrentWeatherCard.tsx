import React from 'react';
import { motion } from 'framer-motion';
import { Cloud, Droplets, Wind, Eye, Gauge, Sun } from 'lucide-react';
import { CurrentWeather } from '../../types/weather';
import { weatherCodeToDescription, weatherCodeToIcon } from '../../services/weather/openMeteo';

interface CurrentWeatherProps {
  data: CurrentWeather;
  locationName: string;
}

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string; sub?: string; color: string }> = ({ icon, label, value, sub, color }) => (
  <div className="flex items-center gap-3 p-3 rounded-xl bg-white/60 backdrop-blur-sm border border-white/40 hover:bg-white/80 transition-all duration-300">
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-xs text-gray-500 font-medium">{label}</p>
      <p className="text-sm font-bold text-gray-800">{value}</p>
      {sub && <p className="text-[10px] text-gray-400">{sub}</p>}
    </div>
  </div>
);

const CurrentWeatherCard: React.FC<CurrentWeatherProps> = ({ data, locationName }) => {
  const icon = weatherCodeToIcon(data.weatherCode, data.isDay);
  const description = weatherCodeToDescription(data.weatherCode);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-xl overflow-hidden relative"
    >
      <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-blue-100 text-sm font-medium">{locationName}</p>
            <p className="text-blue-200 text-xs mt-0.5">{description}</p>
          </div>
          <div className="text-4xl">{icon}</div>
        </div>

        <div className="flex items-end gap-4 mb-6">
          <span className="text-6xl font-extrabold tracking-tight">{data.temperature}°</span>
          <div className="pb-2">
            <p className="text-blue-100 text-sm">Feels like {data.apparentTemperature}°C</p>
            <p className="text-blue-200 text-xs">H: {data.temperature + 3}° L: {data.temperature - 4}°</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          <StatCard icon={<Droplets size={16} className="text-blue-600" />} label="Humidity" value={`${data.humidity}%`} color="bg-blue-100" />
          <StatCard icon={<Wind size={16} className="text-cyan-600" />} label="Wind" value={`${data.windSpeed} km/h`} color="bg-cyan-100" />
          <StatCard icon={<Gauge size={16} className="text-purple-600" />} label="Pressure" value={`${data.pressureMsl} hPa`} color="bg-purple-100" />
          <StatCard icon={<Cloud size={16} className="text-gray-600" />} label="Cloud Cover" value={`${data.cloudCover}%`} color="bg-gray-100" />
          <StatCard icon={<Sun size={16} className="text-amber-600" />} label="UV Index" value={`${data.uvIndex}`} sub={data.uvIndex > 7 ? 'Very High' : data.uvIndex > 5 ? 'High' : 'Moderate'} color="bg-amber-100" />
          <StatCard icon={<Eye size={16} className="text-teal-600" />} label="Visibility" value={`${data.visibility} km`} color="bg-teal-100" />
        </div>
      </div>
    </motion.div>
  );
};

export default CurrentWeatherCard;

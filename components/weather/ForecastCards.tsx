import React from 'react';
import { motion } from 'framer-motion';
import { DailyForecast } from '../../types/weather';
import { weatherCodeToDescription, weatherCodeToIcon } from '../../services/weather/openMeteo';

interface ForecastCardsProps {
  forecasts: DailyForecast[];
}

const dayName = (dateStr: string, index: number) => {
  if (index === 0) return 'Today';
  if (index === 1) return 'Tomorrow';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { weekday: 'short' });
};

const ForecastCards: React.FC<ForecastCardsProps> = ({ forecasts }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100"
    >
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">5-Day Forecast</h3>
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
        {forecasts.slice(0, 5).map((day, i) => (
          <motion.div
            key={day.date}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="flex-shrink-0 flex flex-col items-center gap-2 p-4 rounded-xl bg-gradient-to-b from-gray-50 to-white border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all duration-300 min-w-[100px] cursor-default"
          >
            <p className="text-xs font-semibold text-gray-500">{dayName(day.date, i)}</p>
            <div className="text-3xl">{weatherCodeToIcon(day.weatherCode, true)}</div>
            <div className="text-center">
              <p className="text-lg font-bold text-gray-800">{day.temperatureMax}°</p>
              <p className="text-xs text-gray-400">{day.temperatureMin}°</p>
            </div>
            <div className="flex items-center gap-1 text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
              <span>💧</span>
              <span className="font-medium">{day.precipitationProbabilityMax}%</span>
            </div>
            <p className="text-[10px] text-gray-400 text-center leading-tight max-w-[90px]">
              {weatherCodeToDescription(day.weatherCode)}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ForecastCards;

import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import { WeatherAlert } from '../../types/weather';

interface WeatherAlertsProps {
  alerts: WeatherAlert[];
}

const alertStyles: Record<string, { bg: string; icon: string }> = {
  high: { bg: 'bg-red-600 text-white', icon: 'fas fa-exclamation-triangle' },
  medium: { bg: 'bg-amber-500 text-white', icon: 'fas fa-exclamation-circle' },
  low: { bg: 'bg-brand-600 text-white', icon: 'fas fa-info-circle' },
};

const WeatherAlerts: React.FC<WeatherAlertsProps> = ({ alerts }) => {
  if (alerts.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="space-y-3"
    >
      <div className="flex items-center gap-2 mb-1">
        <AlertTriangle size={16} className="text-red-500" />
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Weather Alerts</h3>
      </div>
      {alerts.map((alert, i) => {
        const style = alertStyles[alert.severity] || alertStyles.low;
        return (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 + i * 0.05 }}
            className={`flex items-center gap-4 p-4 rounded-xl ${style.bg} shadow-lg`}
          >
            <i className={`${style.icon} text-2xl flex-shrink-0`} aria-hidden="true"></i>
            <div className="flex-1 min-w-0">
              <p className="text-base font-bold leading-tight">{alert.title}</p>
              <p className="text-sm opacity-90 mt-0.5">{alert.message}</p>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default WeatherAlerts;

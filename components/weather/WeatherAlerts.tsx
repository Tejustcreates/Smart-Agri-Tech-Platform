import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, CloudRain, Wind, Thermometer, Sun, Snowflake, CloudFog } from 'lucide-react';
import { WeatherAlert } from '../../types/weather';

interface WeatherAlertsProps {
  alerts: WeatherAlert[];
}

const typeIcon: Record<string, React.ReactNode> = {
  rain: <CloudRain size={16} />,
  wind: <Wind size={16} />,
  heat: <Thermometer size={16} />,
  cold: <Snowflake size={16} />,
  uv: <Sun size={16} />,
  fog: <CloudFog size={16} />,
};

const severityStyle: Record<string, string> = {
  high: 'bg-red-50 border-red-200 text-red-800',
  medium: 'bg-amber-50 border-amber-200 text-amber-800',
  low: 'bg-blue-50 border-blue-200 text-blue-800',
};

const WeatherAlerts: React.FC<WeatherAlertsProps> = ({ alerts }) => {
  if (alerts.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="space-y-2"
    >
      <div className="flex items-center gap-2 mb-2">
        <AlertTriangle size={16} className="text-amber-500" />
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Weather Alerts</h3>
      </div>
      {alerts.map((alert, i) => (
        <motion.div
          key={alert.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.25 + i * 0.05 }}
          className={`flex items-start gap-3 p-3 rounded-xl border ${severityStyle[alert.severity]} hover:shadow-md transition-all duration-300`}
        >
          <div className="flex-shrink-0 mt-0.5">{typeIcon[alert.type]}</div>
          <div>
            <p className="text-sm font-bold">{alert.title}</p>
            <p className="text-xs opacity-80 mt-0.5">{alert.message}</p>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default WeatherAlerts;

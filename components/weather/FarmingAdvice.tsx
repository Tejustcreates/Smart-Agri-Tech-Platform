import React from 'react';
import { motion } from 'framer-motion';
import { Sprout, Droplets, Scissors, Plane, Sunrise } from 'lucide-react';
import { FarmingAdvisory } from '../../types/weather';

interface FarmingAdviceProps {
  advisory: FarmingAdvisory;
}

const urgencyColor = {
  high: 'bg-red-100 text-red-700 border-red-200',
  medium: 'bg-amber-100 text-amber-700 border-amber-200',
  low: 'bg-green-100 text-green-700 border-green-200',
};

const urgencyDot = {
  high: 'bg-red-500',
  medium: 'bg-amber-500',
  low: 'bg-green-500',
};

interface AdviceItemProps {
  icon: React.ReactNode;
  title: string;
  recommendation: string;
  urgency: 'high' | 'medium' | 'low';
  reason: string;
  delay: number;
}

const AdviceItem: React.FC<AdviceItemProps> = ({ icon, title, recommendation, urgency, reason, delay }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay }}
    className={`p-4 rounded-xl border hover:shadow-md transition-all duration-300 ${urgencyColor[urgency]}`}
  >
    <div className="flex items-start gap-3">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${urgencyDot[urgency]} bg-opacity-20`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="text-sm font-bold text-gray-800">{title}</h4>
          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${urgencyColor[urgency]}`}>
            {urgency.toUpperCase()}
          </span>
        </div>
        <p className="text-sm text-gray-700 font-medium">{recommendation}</p>
        <p className="text-xs text-gray-500 mt-1">{reason}</p>
      </div>
    </div>
  </motion.div>
);

const FarmingAdvice: React.FC<FarmingAdviceProps> = ({ advisory }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 }}
      className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-5 border border-green-100 shadow-lg"
    >
      <div className="flex items-center gap-2 mb-4">
        <Sprout size={18} className="text-green-600" />
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Today's Farming Advisory</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <AdviceItem
          icon={<Droplets size={14} className="text-blue-600" />}
          title="Irrigation"
          recommendation={advisory.irrigation.recommendation}
          urgency={advisory.irrigation.urgency}
          reason={advisory.irrigation.reason}
          delay={0.4}
        />
        <AdviceItem
          icon={<Plane size={14} className="text-purple-600" />}
          title="Spraying"
          recommendation={advisory.spraying.recommendation}
          urgency={advisory.spraying.urgency}
          reason={advisory.spraying.reason}
          delay={0.45}
        />
        <AdviceItem
          icon={<Scissors size={14} className="text-amber-600" />}
          title="Harvesting"
          recommendation={advisory.harvesting.recommendation}
          urgency={advisory.harvesting.urgency}
          reason={advisory.harvesting.reason}
          delay={0.5}
        />
        <AdviceItem
          icon={<Sunrise size={14} className="text-orange-600" />}
          title="Planting"
          recommendation={advisory.planting.recommendation}
          urgency={advisory.planting.urgency}
          reason={advisory.planting.reason}
          delay={0.55}
        />
      </div>
    </motion.div>
  );
};

export default FarmingAdvice;

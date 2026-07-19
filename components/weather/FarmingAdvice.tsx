import React from 'react';
import { motion } from 'framer-motion';
import { Sprout } from 'lucide-react';
import { FarmingAdvisory } from '../../types/weather';

interface FarmingAdviceProps {
  advisory: FarmingAdvisory;
}

const urgencyColor = {
  high: 'bg-red-50 text-red-800 border-red-200',
  medium: 'bg-amber-50 text-amber-800 border-amber-200',
  low: 'bg-brand-50 text-brand-800 border-brand-200',
};

const urgencyIcon: Record<string, { icon: string; label: string }> = {
  irrigation: { icon: 'fas fa-droplet', label: 'Irrigate' },
  spraying: { icon: 'fas fa-spray-can-sparkles', label: 'Spray' },
  harvesting: { icon: 'fas fa-scissors', label: 'Harvest' },
  planting: { icon: 'fas fa-seedling', label: 'Plant' },
};

interface AdviceRowProps {
  type: 'irrigation' | 'spraying' | 'harvesting' | 'planting';
  recommendation: string;
  urgency: 'high' | 'medium' | 'low';
  reason: string;
  delay: number;
}

const AdviceRow: React.FC<AdviceRowProps> = ({ type, recommendation, urgency, reason, delay }) => {
  const config = urgencyIcon[type];
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className={`flex items-center gap-4 p-4 rounded-xl border min-h-[56px] ${urgencyColor[urgency]}`}
    >
      <i className={`${config.icon} text-xl flex-shrink-0`} aria-hidden="true"></i>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold">{config.label}: {recommendation}</p>
        <p className="text-xs opacity-75 mt-0.5">{reason}</p>
      </div>
      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
        urgency === 'high' ? 'bg-red-200 text-red-700' : urgency === 'medium' ? 'bg-amber-200 text-amber-700' : 'bg-brand-200 text-brand-700'
      }`}>
        {urgency.toUpperCase()}
      </span>
    </motion.div>
  );
};

const FarmingAdvice: React.FC<FarmingAdviceProps> = ({ advisory }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className="bg-gradient-to-r from-brand-50 to-emerald-50 rounded-2xl p-5 border border-brand-100 shadow-lg"
    >
      <div className="flex items-center gap-2 mb-4">
        <Sprout size={18} className="text-brand-600" />
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Today's Farming Advisory</h3>
      </div>
      <div className="space-y-3">
        <AdviceRow type="irrigation" recommendation={advisory.irrigation.recommendation} urgency={advisory.irrigation.urgency} reason={advisory.irrigation.reason} delay={0.3} />
        <AdviceRow type="spraying" recommendation={advisory.spraying.recommendation} urgency={advisory.spraying.urgency} reason={advisory.spraying.reason} delay={0.35} />
        <AdviceRow type="harvesting" recommendation={advisory.harvesting.recommendation} urgency={advisory.harvesting.urgency} reason={advisory.harvesting.reason} delay={0.4} />
        <AdviceRow type="planting" recommendation={advisory.planting.recommendation} urgency={advisory.planting.urgency} reason={advisory.planting.reason} delay={0.45} />
      </div>
    </motion.div>
  );
};

export default FarmingAdvice;

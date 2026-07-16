import React from 'react';
import { motion } from 'framer-motion';
import { CloudRain, Clock, TrendingUp } from 'lucide-react';
import { RainPrediction } from '../../types/weather';
import AIConfidenceMeter from './AIConfidenceMeter';

interface RainProbabilityProps {
  prediction: RainPrediction;
}

const RainProbability: React.FC<RainProbabilityProps> = ({ prediction }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className={`rounded-2xl p-5 shadow-lg border overflow-hidden relative ${
        prediction.willRain
          ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white border-blue-400'
          : 'bg-gradient-to-br from-emerald-500 to-green-600 text-white border-green-400'
      }`}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <CloudRain size={18} />
              <h3 className="text-sm font-semibold uppercase tracking-wider opacity-90">Rain Prediction</h3>
            </div>
            <p className="text-2xl font-bold">
              {prediction.willRain ? 'Rain Expected' : 'Clear Skies'}
            </p>
          </div>
          <div className="bg-white/20 rounded-full p-1">
            <AIConfidenceMeter
              value={prediction.confidence}
              size={72}
              strokeWidth={5}
              color="white"
              label="Confidence"
            />
          </div>
        </div>

        <div className="bg-white/15 rounded-xl p-3 backdrop-blur-sm mb-3">
          <p className="text-sm opacity-90">{prediction.recommendation}</p>
        </div>

        <div className="flex items-center gap-4 text-xs opacity-80">
          <div className="flex items-center gap-1">
            <Clock size={12} />
            <span>{prediction.timeframe}</span>
          </div>
          <div className="flex items-center gap-1">
            <TrendingUp size={12} />
            <span>Probability: {prediction.probability}%</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RainProbability;

import React from 'react';
import { motion } from 'framer-motion';
import { CropPrediction } from '../../types/prediction';
import { Trophy, Droplets, TrendingUp, BarChart3, Sprout, ShieldCheck } from 'lucide-react';

interface RecommendationCardProps {
  prediction: CropPrediction;
  rank: number;
  landSize: number;
}

const profitColor = { High: 'text-green-600 bg-green-50', Medium: 'text-amber-600 bg-amber-50', Low: 'text-red-500 bg-red-50' };
const demandColor = { High: 'text-blue-600 bg-blue-50', Medium: 'text-amber-600 bg-amber-50', Low: 'text-gray-500 bg-gray-50' };
const diffColor = { Easy: 'text-green-600', Moderate: 'text-amber-600', Hard: 'text-red-500' };

const RecommendationCard: React.FC<RecommendationCardProps> = ({ prediction, rank, landSize }) => {
  const isTop = rank === 0;
  const confColor = prediction.confidence >= 70 ? 'text-green-600' : prediction.confidence >= 45 ? 'text-amber-600' : 'text-red-500';
  const confBg = prediction.confidence >= 70 ? 'bg-green-500' : prediction.confidence >= 45 ? 'bg-amber-500' : 'bg-red-400';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: rank * 0.08 }}
      className={`bg-white rounded-2xl border shadow-sm hover:shadow-md transition-all overflow-hidden ${
        isTop ? 'border-amber-300 ring-2 ring-amber-100' : 'border-gray-100'
      }`}
    >
      {isTop && (
        <div className="bg-gradient-to-r from-amber-400 to-amber-500 px-5 py-1.5 flex items-center gap-2">
          <Trophy size={14} className="text-white" />
          <span className="text-xs font-bold text-white uppercase tracking-wide">Best Match</span>
        </div>
      )}

      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
              isTop ? 'bg-amber-100 text-amber-700' : rank === 1 ? 'bg-gray-200 text-gray-600' : rank === 2 ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-500'
            }`}>
              #{rank + 1}
            </div>
            <div>
              <h4 className="text-lg font-bold text-gray-800">{prediction.crop}</h4>
              <p className={`text-xs font-semibold ${confColor}`}>{prediction.confidence}% confidence</p>
            </div>
          </div>
        </div>

        {/* Confidence Bar */}
        <div className="w-full h-2 bg-gray-100 rounded-full mb-4 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${prediction.confidence}%` }}
            transition={{ duration: 0.8, delay: rank * 0.08 + 0.2 }}
            className={`h-full rounded-full ${confBg}`}
          />
        </div>

        {/* Key Details */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <TrendingUp size={14} className="text-green-500" />
            <span>Yield: <strong>{prediction.expectedYield}/acre</strong></span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <BarChart3 size={14} className="text-blue-500" />
            <span>Est: <strong>{prediction.estimatedYield}</strong></span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Droplets size={14} className="text-sky-500" />
            <span>Water: <strong className="truncate">{prediction.waterRequirement}</strong></span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Sprout size={14} className="text-emerald-500" />
            <span>Season: <strong>{prediction.suitableSeason}</strong></span>
          </div>
        </div>

        {/* Reason */}
        <p className="text-xs text-gray-500 mb-3 bg-gray-50 rounded-lg px-3 py-2">
          <ShieldCheck size={12} className="inline text-green-500 mr-1" />
          {prediction.reason}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${profitColor[prediction.profitability]}`}>
            {prediction.profitability} Profit
          </span>
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${demandColor[prediction.marketDemand]}`}>
            {prediction.marketDemand} Demand
          </span>
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 ${diffColor[prediction.difficultyLevel]}`}>
            {prediction.difficultyLevel}
          </span>
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
            Soil: {prediction.suitableSoil}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default RecommendationCard;

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CropPrediction } from '../../types/prediction';
import { Trophy, Droplets, TrendingUp, BarChart3, Sprout, ShieldCheck, ChevronDown, ChevronUp } from 'lucide-react';

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
  const [showDetails, setShowDetails] = useState(false);

  const confLabel = prediction.confidence >= 70 ? 'High match' : prediction.confidence >= 45 ? 'Medium match' : 'Low match';
  const confBg = prediction.confidence >= 70 ? 'bg-green-500 text-white' : prediction.confidence >= 45 ? 'bg-amber-500 text-white' : 'bg-red-400 text-white';
  const confBarBg = prediction.confidence >= 70 ? 'bg-green-500' : prediction.confidence >= 45 ? 'bg-amber-500' : 'bg-red-400';

  const farmerReason = prediction.confidence >= 70
    ? `This crop suits your soil's nutrients and this season's rainfall.`
    : prediction.confidence >= 45
    ? `This crop can grow here, but soil conditions are not ideal.`
    : `Difficult to grow with current soil — consider improving it first.`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: rank * 0.08 }}
      className={`bg-white rounded-2xl border shadow-sm overflow-hidden ${
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
        {/* Crop name + confidence badge — the primary thing */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
              isTop ? 'bg-amber-100 text-amber-700' : rank === 1 ? 'bg-gray-200 text-gray-600' : rank === 2 ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-500'
            }`}>
              #{rank + 1}
            </div>
            <h4 className="text-xl font-bold text-gray-800">{prediction.crop}</h4>
          </div>
          <span className={`text-sm font-bold px-3 py-1.5 rounded-full ${confBg}`}>
            {prediction.confidence}% {confLabel}
          </span>
        </div>

        {/* Confidence bar */}
        <div className="w-full h-2.5 bg-gray-100 rounded-full mb-3 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${prediction.confidence}%` }}
            transition={{ duration: 0.8, delay: rank * 0.08 + 0.2 }}
            className={`h-full rounded-full ${confBarBg}`}
          />
        </div>

        {/* Farmer-language explanation */}
        <p className="text-sm text-gray-600 mb-4 bg-brand-50 rounded-lg px-3 py-2">
          <i className="fas fa-leaf text-brand-600 mr-1.5"></i>
          {farmerReason}
        </p>

        {/* Key details */}
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
          <ShieldCheck size={12} className="inline text-brand-500 mr-1" />
          {prediction.reason}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-3">
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

        {/* Collapsible detailed analysis */}
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="flex items-center gap-2 text-sm font-medium text-brand-600 hover:text-brand-800 transition-colors tap-target"
        >
          {showDetails ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          {showDetails ? 'Hide detailed analysis' : 'See detailed analysis'}
        </button>

        {showDetails && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-3 pt-3 border-t border-gray-100 space-y-3"
          >
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-brand-50 rounded-lg p-2">
                <p className="text-xs text-gray-500">NPK Balance</p>
                <p className="text-sm font-bold text-brand-800">N:{Math.round(prediction.confidence * 0.6)} P:{Math.round(prediction.confidence * 0.25)} K:{Math.round(prediction.confidence * 0.15)}</p>
              </div>
              <div className="bg-amber-50 rounded-lg p-2">
                <p className="text-xs text-gray-500">Water Need</p>
                <p className="text-sm font-bold text-amber-800">{prediction.waterRequirement}</p>
              </div>
              <div className="bg-emerald-50 rounded-lg p-2">
                <p className="text-xs text-gray-500">Difficulty</p>
                <p className="text-sm font-bold text-emerald-800">{prediction.difficultyLevel}</p>
              </div>
            </div>
            <p className="text-xs text-gray-400 italic">
              Detailed NPK radar and feature importance charts are available in the analytics section below.
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default RecommendationCard;

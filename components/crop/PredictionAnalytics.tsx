import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PredictionResult } from '../../types/prediction';
import { BarChart3, Layers, Circle, ChevronDown, ChevronUp } from 'lucide-react';

interface PredictionAnalyticsProps {
  result: PredictionResult;
}

const PredictionAnalytics: React.FC<PredictionAnalyticsProps> = ({ result }) => {
  const [isOpen, setIsOpen] = useState(false);
  const maxImportance = Math.max(...Object.values(result.featureImportance) as number[]);

  return (
    <div className="space-y-4">
      {/* Collapsible toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-sm font-medium text-brand-600 hover:text-brand-800 transition-colors tap-target w-full"
      >
        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        {isOpen ? 'Hide detailed analysis' : 'See detailed analysis'}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4 overflow-hidden"
          >
            {/* Feature Importance */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 size={16} className="text-brand-600" />
                <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide">Feature Importance</h3>
              </div>
              <div className="space-y-2.5">
                {(Object.entries(result.featureImportance) as [string, number][])
                  .sort(([, a], [, b]) => b - a)
                  .map(([name, value]) => (
                    <div key={name}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-600 font-medium">{name}</span>
                        <span className="text-gray-500">{value}%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(value / maxImportance) * 100}%` }}
                          transition={{ duration: 0.6 }}
                          className="h-full bg-gradient-to-r from-brand-600 to-brand-400 rounded-full"
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* NPK Balance */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Layers size={16} className="text-blue-600" />
                <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide">NPK Balance</h3>
              </div>
              <div className="flex items-end gap-4 justify-center h-28">
                {[
                  { label: 'N', value: result.npkBalance.nitrogen, color: 'bg-brand-600', h: result.npkBalance.nitrogen },
                  { label: 'P', value: result.npkBalance.phosphorus, color: 'bg-orange-500', h: result.npkBalance.phosphorus },
                  { label: 'K', value: result.npkBalance.potassium, color: 'bg-purple-500', h: result.npkBalance.potassium },
                ].map((bar) => (
                  <div key={bar.label} className="flex flex-col items-center flex-1">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${bar.h}%` }}
                      transition={{ duration: 0.6 }}
                      className={`w-full max-w-[40px] rounded-t-lg ${bar.color}`}
                      style={{ minHeight: '8px' }}
                    />
                    <span className="text-xs font-bold text-gray-600 mt-1.5">{bar.label}</span>
                    <span className="text-[10px] text-gray-400">{bar.value}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Radar - Input vs Ideal */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Circle size={16} className="text-teal-600" />
                <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide">Input vs Ideal</h3>
              </div>
              <div className="space-y-3">
                {result.radarData.map((d) => (
                  <div key={d.feature} className="flex items-center gap-3">
                    <span className="text-xs text-gray-500 font-medium w-16 text-right">{d.feature}</span>
                    <div className="flex-1 flex items-center gap-2">
                      <div className="flex-1 relative h-3 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${d.actual}%` }}
                          transition={{ duration: 0.5 }}
                          className="absolute h-full bg-brand-500 rounded-full opacity-70"
                        />
                        <div
                          className="absolute h-full w-0.5 bg-gray-800 opacity-40"
                          style={{ left: `${d.ideal}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-gray-400 w-8">{Math.round(d.actual)}</span>
                    </div>
                  </div>
                ))}
                <div className="flex items-center gap-4 text-[10px] text-gray-400 mt-1">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-brand-500 inline-block" /> Your Input</span>
                  <span className="flex items-center gap-1"><span className="w-0.5 h-2 bg-gray-800 inline-block opacity-40" /> Ideal Value</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PredictionAnalytics;

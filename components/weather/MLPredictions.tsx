import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, Bug } from 'lucide-react';
import { CropRecommendation, DiseaseRiskAssessment } from '../../types/weather';
import AIConfidenceMeter from './AIConfidenceMeter';

interface MLPredictionsProps {
  crops: CropRecommendation[];
  diseases: DiseaseRiskAssessment[];
  rainConfidence: number;
}

const suitabilityColor = {
  high: 'bg-green-100 text-green-700 border-green-200',
  medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  low: 'bg-gray-100 text-gray-600 border-gray-200',
};

const riskColor = {
  high: 'text-red-600',
  medium: 'text-amber-600',
  low: 'text-green-600',
};

const CropAndDiseasePanel: React.FC<MLPredictionsProps> = ({ crops, diseases }) => {
  return (
    <div className="space-y-4">
      {/* Crop Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100"
      >
        <div className="flex items-center gap-2 mb-4">
          <Leaf size={16} className="text-green-600" />
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Crop Recommendations</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {crops.map((crop, i) => (
            <motion.div
              key={crop.crop}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + i * 0.05 }}
              className={`p-3 rounded-xl border hover:shadow-md transition-all duration-300 cursor-default ${suitabilityColor[crop.suitability]}`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{crop.icon}</span>
                <span className="text-sm font-bold">{crop.crop}</span>
              </div>
              <p className="text-[10px] opacity-70 leading-tight">{crop.reason}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Disease Risk */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100"
      >
        <div className="flex items-center gap-2 mb-4">
          <Bug size={16} className="text-red-500" />
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Disease Risk Assessment</h3>
        </div>
        <div className="space-y-3">
          {diseases.map((disease, i) => (
            <motion.div
              key={disease.disease}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.05 }}
              className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <AIConfidenceMeter
                value={disease.probability}
                size={56}
                strokeWidth={4}
                color={disease.risk === 'high' ? '#dc2626' : disease.risk === 'medium' ? '#d97706' : '#16a34a'}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-800">{disease.disease}</p>
                <p className={`text-xs font-semibold ${riskColor[disease.risk]}`}>
                  {disease.risk.toUpperCase()} RISK
                </p>
                {disease.factors.length > 0 && (
                  <p className="text-[10px] text-gray-500 mt-0.5 truncate">{disease.factors.join(' • ')}</p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default CropAndDiseasePanel;

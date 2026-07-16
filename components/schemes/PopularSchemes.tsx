import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, ChevronRight } from 'lucide-react';
import { Scheme } from '../../types/scheme';

interface PopularSchemesProps {
  schemes: Scheme[];
  onSelect: (scheme: Scheme) => void;
}

const PopularSchemes: React.FC<PopularSchemesProps> = ({ schemes, onSelect }) => {
  if (!schemes.length) return null;

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp size={18} className="text-green-600" />
        <h3 className="text-lg font-bold text-gray-800">Popular in Your Region</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {schemes.map((scheme, i) => (
          <motion.button
            key={scheme.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => onSelect(scheme)}
            className="text-left bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100 hover:border-green-300 hover:shadow-md transition-all group"
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <h4 className="text-sm font-bold text-gray-800 leading-snug group-hover:text-green-700 transition-colors line-clamp-2">
                {scheme.schemeName}
              </h4>
              <ChevronRight size={16} className="text-green-400 flex-shrink-0 mt-0.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <p className="text-xs text-gray-500 line-clamp-1 mb-2">{scheme.ministry}</p>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                scheme.level === 'Central' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
              }`}>
                {scheme.level}
              </span>
              <span className="text-[10px] text-gray-400">{scheme.category}</span>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default PopularSchemes;

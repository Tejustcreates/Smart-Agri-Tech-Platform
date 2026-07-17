import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, ChevronRight, Landmark, FileText } from 'lucide-react';
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
            className="text-left bg-white rounded-xl p-4 border border-gray-100 hover:border-green-300 hover:shadow-md transition-all group"
          >
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <Landmark size={16} className="text-green-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-gray-800 leading-snug group-hover:text-green-700 transition-colors line-clamp-2 mb-1">
                  {scheme.schemeName}
                </h4>
                <p className="text-xs text-gray-500 line-clamp-1 mb-2">{scheme.ministry}</p>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    scheme.level === 'Central' ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'
                  }`}>
                    {scheme.level}
                  </span>
                  <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-[10px] font-semibold">
                    {scheme.category}
                  </span>
                </div>
              </div>
              <ChevronRight size={16} className="text-gray-300 flex-shrink-0 mt-1 group-hover:text-green-500 group-hover:translate-x-0.5 transition-all" />
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default PopularSchemes;

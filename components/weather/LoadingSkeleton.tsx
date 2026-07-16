import React from 'react';
import { motion } from 'framer-motion';

const Shimmer: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`bg-gray-200 rounded-lg animate-pulse ${className}`} />
);

export const DashboardSkeleton: React.FC = () => (
  <div className="space-y-6 p-6">
    <div className="flex items-center gap-4">
      <Shimmer className="h-10 w-64" />
      <Shimmer className="h-10 flex-1 max-w-xs" />
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
        >
          <Shimmer className="h-4 w-20 mb-3" />
          <Shimmer className="h-8 w-16 mb-2" />
          <Shimmer className="h-3 w-24" />
        </motion.div>
      ))}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {[1, 2, 3].map((i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 + i * 0.1 }}
          className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
        >
          <Shimmer className="h-4 w-32 mb-3" />
          <Shimmer className="h-20 w-full mb-3" />
          <Shimmer className="h-3 w-full" />
          <Shimmer className="h-3 w-3/4 mt-2" />
        </motion.div>
      ))}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {[1, 2].map((i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 + i * 0.1 }}
          className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
        >
          <Shimmer className="h-4 w-40 mb-4" />
          <Shimmer className="h-48 w-full" />
        </motion.div>
      ))}
    </div>
  </div>
);

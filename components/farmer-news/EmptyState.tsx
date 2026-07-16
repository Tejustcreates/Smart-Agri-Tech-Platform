import React from 'react';

const EmptyState: React.FC = () => (
  <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
    <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
      <span className="text-5xl">🌾</span>
    </div>
    <h3 className="text-xl font-bold text-gray-800 mb-2">No agriculture news found</h3>
    <p className="text-gray-500 max-w-md mx-auto text-sm">
      No agriculture news available for selected filters. Try changing your state, crop, or category.
    </p>
  </div>
);

export default EmptyState;

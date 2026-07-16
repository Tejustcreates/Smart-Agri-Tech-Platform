import React from 'react';

const SkeletonNewsCard: React.FC<{ featured?: boolean }> = ({ featured }) => (
  <div className={`bg-white rounded-2xl overflow-hidden animate-pulse ${featured ? 'shadow-lg' : 'shadow-sm border border-gray-100'}`}>
    <div className={`${featured ? 'h-64' : 'h-44'} bg-gray-200`} />
    <div className="p-5">
      <div className="h-5 w-20 bg-gray-200 rounded-full mb-3" />
      <div className="h-5 w-3/4 bg-gray-200 rounded mb-2" />
      <div className="h-3 w-full bg-gray-100 rounded mb-1.5" />
      <div className="h-3 w-5/6 bg-gray-100 rounded mb-4" />
      <div className="flex justify-between items-center pt-3 border-t border-gray-100">
        <div className="h-3 w-24 bg-gray-200 rounded" />
        <div className="h-3 w-16 bg-gray-200 rounded" />
      </div>
    </div>
  </div>
);

export const SkeletonGrid: React.FC = () => (
  <div>
    <SkeletonNewsCard featured />
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <SkeletonNewsCard key={i} />
      ))}
    </div>
  </div>
);

export default SkeletonNewsCard;

import React from 'react';

const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`}></div>
);

export const SkeletonCard: React.FC = () => (
  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
    <div className="flex items-center gap-3 mb-4">
      <Skeleton className="w-10 h-10 rounded-full" />
      <Skeleton className="h-4 w-24" />
    </div>
    <Skeleton className="h-8 w-32 mb-2" />
    <Skeleton className="h-3 w-48 mb-4" />
    <div className="grid grid-cols-2 gap-3">
      <Skeleton className="h-16 rounded-lg" />
      <Skeleton className="h-16 rounded-lg" />
    </div>
  </div>
);

export const SkeletonNewsCard: React.FC = () => (
  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
    <Skeleton className="h-5 w-3/4 mb-3" />
    <Skeleton className="h-3 w-full mb-2" />
    <Skeleton className="h-3 w-5/6 mb-4" />
    <Skeleton className="h-3 w-1/3" />
  </div>
);

export const SkeletonPriceCard: React.FC = () => (
  <div className="bg-white rounded-xl p-5 border-2 border-gray-100">
    <div className="flex justify-between mb-3">
      <Skeleton className="h-5 w-24" />
      <Skeleton className="h-5 w-16 rounded-full" />
    </div>
    <div className="flex justify-between mb-3">
      <Skeleton className="h-8 w-28" />
      <Skeleton className="h-8 w-28" />
    </div>
    <Skeleton className="h-10 rounded-lg mb-2" />
    <Skeleton className="h-3 w-20" />
  </div>
);

export default Skeleton;

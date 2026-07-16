import React from 'react';

interface ErrorStateProps {
  onRetry: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ onRetry }) => (
  <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
    <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-5">
      <span className="text-4xl">⚠️</span>
    </div>
    <h3 className="text-xl font-bold text-gray-800 mb-2">Something went wrong</h3>
    <p className="text-gray-500 mb-5 text-sm">Unable to load news. Please check your connection and try again.</p>
    <button
      onClick={onRetry}
      className="px-6 py-2.5 bg-green-600 text-white rounded-xl font-semibold text-sm hover:bg-green-700 transition-all shadow-sm"
    >
      ↺ Retry
    </button>
  </div>
);

export default ErrorState;

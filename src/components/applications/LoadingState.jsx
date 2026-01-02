import React from 'react';

/**
 * LoadingState Component
 * Hiển thị loading state khi đang fetch applications
 */
const LoadingState = () => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-12 flex flex-col items-center justify-center">
      <div className="w-12 h-12 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin mb-4"></div>
      <p className="text-gray-500 text-sm">Loading your applications...</p>
    </div>
  );
};

export default React.memo(LoadingState);

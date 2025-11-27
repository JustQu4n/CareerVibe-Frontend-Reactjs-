import React from 'react';

/**
 * LoadingState Component
 * Hiển thị loading state khi đang fetch applications
 */
const LoadingState = () => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-10 flex flex-col items-center justify-center">
      <div className="w-16 h-16 border-4 border-t-blue-500 border-r-blue-500 border-b-blue-300 border-l-blue-300 rounded-full animate-spin mb-4"></div>
      <p className="text-gray-500 font-medium">Loading your applications...</p>
    </div>
  );
};

export default React.memo(LoadingState);

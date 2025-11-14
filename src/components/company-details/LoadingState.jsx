import React from 'react';

/**
 * LoadingState Component
 * Hiển thị loading spinner khi đang fetch dữ liệu company
 */
const LoadingState = () => {
  return (
    <div className="flex-1 flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600 font-medium">Loading company details...</p>
      </div>
    </div>
  );
};

export default React.memo(LoadingState);

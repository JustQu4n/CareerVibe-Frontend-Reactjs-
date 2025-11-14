import React from 'react';
import { AlertCircle } from 'lucide-react';

/**
 * ErrorState Component
 * Hiển thị error message khi fetch company thất bại
 * 
 * @param {Object} props
 * @param {string} props.error - Error message
 */
const ErrorState = ({ error }) => {
  return (
    <div className="flex-1 flex items-center justify-center min-h-[60vh]">
      <div className="text-center p-8 bg-gradient-to-br from-red-50 to-rose-50 rounded-2xl max-w-md border border-red-200 shadow-lg">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8 text-red-600" />
        </div>
        <h2 className="text-xl font-bold text-red-600 mb-2">Error Loading Company</h2>
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
};

export default React.memo(ErrorState);

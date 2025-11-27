import React from 'react';
import { XCircle } from 'lucide-react';

/**
 * ErrorState Component
 * Hiển thị error state khi không thể load applications
 * 
 * @param {Object} props
 * @param {string|Object} props.error - Error message
 * @param {Function} props.onRetry - Retry callback
 */
const ErrorState = ({ error, onRetry }) => {
  const errorMessage = typeof error === 'object' 
    ? error.message || 'An error occurred' 
    : error;

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 text-center">
      <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <XCircle className="h-10 w-10 text-red-500" />
      </div>
      <h2 className="text-xl font-medium text-gray-800 mb-2">
        Oops! Something went wrong
      </h2>
      <p className="text-red-500 mb-6">{errorMessage}</p>
      <button 
        onClick={onRetry} 
        className="bg-red-50 text-red-700 px-5 py-2.5 rounded-lg hover:bg-red-100 transition font-medium"
      >
        Try Again
      </button>
    </div>
  );
};

export default React.memo(ErrorState);

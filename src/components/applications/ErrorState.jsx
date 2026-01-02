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
    <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <XCircle className="h-8 w-8 text-gray-600" />
      </div>
      <h2 className="text-lg font-semibold text-gray-900 mb-2">
        Oops! Something went wrong
      </h2>
      <p className="text-gray-600 mb-6 text-sm">{errorMessage}</p>
      <button 
        onClick={onRetry} 
        className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-800 transition text-sm font-medium"
      >
        Try Again
      </button>
    </div>
  );
};

export default React.memo(ErrorState);

import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Navbar } from '../navbar';
import Footer from '../components_lite/Footer';

/**
 * ErrorState Component
 * Hiển thị thông báo lỗi khi không thể load job details
 * 
 * @param {Object} props
 * @param {string|Object} props.error - Thông tin lỗi
 */
const ErrorState = ({ error }) => {
  const errorMessage = typeof error === 'object' 
    ? error.message || 'An error occurred' 
    : error;

  return (
    <div className="flex flex-col min-h-screen">
      <div className="sticky top-0 z-50 bg-white shadow-sm">
        <Navbar />
      </div>
      <div className="flex-1 flex justify-center items-center p-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center max-w-md">
          <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            Error Loading Job
          </h3>
          <p className="text-red-600 mb-6">{errorMessage}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default React.memo(ErrorState);

import React from 'react';
import { Navbar } from '../navbar';
import Footer from '../components_lite/Footer';

/**
 * LoadingState Component
 * Hiển thị trạng thái loading khi đang tải dữ liệu job
 */
const LoadingState = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="sticky top-0 z-50 bg-white shadow-sm">
        <Navbar />
      </div>
      <div className="flex-1 flex justify-center items-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">
            Loading job details...
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default React.memo(LoadingState);

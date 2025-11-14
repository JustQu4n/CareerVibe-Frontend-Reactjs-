import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Search } from 'lucide-react';
import { Navbar } from '../navbar';
import Footer from '../components_lite/Footer';

/**
 * EmptyState Component
 * Hiển thị khi không tìm thấy job details
 */
const EmptyState = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="sticky top-0 z-50 bg-white shadow-sm">
        <Navbar />
      </div>
      <div className="flex-1 flex justify-center items-center">
        <div className="text-center p-8">
          <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Briefcase className="h-8 w-8 text-blue-500" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            No Job Details Available
          </h3>
          <p className="text-gray-600 mb-6">
            The job you're looking for might have been removed or doesn't exist.
          </p>
          <Link
            to="/find-job"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium inline-flex items-center"
          >
            <Search className="mr-2 h-4 w-4" />
            Browse All Jobs
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default React.memo(EmptyState);

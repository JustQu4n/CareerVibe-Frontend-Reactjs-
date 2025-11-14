import React from 'react';
import { Link } from 'react-router-dom';

/**
 * JobBreadcrumb Component
 * Hiển thị breadcrumb navigation
 */
const JobBreadcrumb = () => {
  return (
    <div className="container mx-auto px-4 py-4">
      <div className="flex items-center text-sm">
        <Link to="/" className="text-gray-500 hover:text-blue-600 transition">
          Home
        </Link>
        <span className="mx-2 text-gray-400">/</span>
        <Link to="/find-job" className="text-gray-500 hover:text-blue-600 transition">
          Find Job
        </Link>
        <span className="mx-2 text-gray-400">/</span>
        <span className="text-gray-900 font-medium">Job Details</span>
      </div>
    </div>
  );
};

export default React.memo(JobBreadcrumb);

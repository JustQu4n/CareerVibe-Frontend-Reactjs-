import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ChevronRight, Briefcase } from 'lucide-react';

/**
 * JobBreadcrumb Component - Modern breadcrumb navigation
 */
const JobBreadcrumb = () => {
  return (
    <div className="bg-white border-b border-gray-100">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center text-sm gap-2">
          <Link 
            to="/" 
            className="flex items-center gap-1.5 text-gray-600 hover:text-blue-600 transition-colors font-medium group"
          >
            <Home className="h-4 w-4 group-hover:scale-110 transition-transform" />
            <span>Home</span>
          </Link>
          <ChevronRight className="h-4 w-4 text-gray-400" />
          <Link 
            to="/find-job" 
            className="flex items-center gap-1.5 text-gray-600 hover:text-blue-600 transition-colors font-medium group"
          >
            <Briefcase className="h-4 w-4 group-hover:scale-110 transition-transform" />
            <span>Find Jobs</span>
          </Link>
          <ChevronRight className="h-4 w-4 text-gray-400" />
          <span className="text-gray-900 font-bold">Job Details</span>
        </div>
      </div>
    </div>
  );
};

export default React.memo(JobBreadcrumb);

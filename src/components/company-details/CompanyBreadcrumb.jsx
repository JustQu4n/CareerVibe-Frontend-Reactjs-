import React from 'react';
import { ChevronRight } from 'lucide-react';

/**
 * CompanyBreadcrumb Component
 * Breadcrumb navigation cho company detail page
 * 
 * @param {Object} props
 * @param {string} props.companyName - Tên công ty
 */
const CompanyBreadcrumb = ({ companyName }) => {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center text-sm text-gray-600">
          <a href="/" className="hover:text-blue-600 transition-colors">Home</a>
          <ChevronRight className="w-4 h-4 mx-2" />
          <a href="/companies" className="hover:text-blue-600 transition-colors">Find Employers</a>
          <ChevronRight className="w-4 h-4 mx-2" />
          <span className="text-gray-900 font-medium">{companyName}</span>
        </nav>
      </div>
    </header>
  );
};

export default React.memo(CompanyBreadcrumb);

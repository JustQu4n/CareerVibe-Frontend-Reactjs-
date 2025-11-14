import React from 'react';
import { FileText } from 'lucide-react';

/**
 * CompanyDescription Component
 * Hiển thị description của công ty
 * 
 * @param {Object} props
 * @param {string} props.description - Company description
 */
const CompanyDescription = ({ description }) => {
  return (
    <div className="mb-8">
      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <FileText className="w-6 h-6 text-blue-600" />
        About Company
      </h3>
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200">
        <p className="text-gray-700 leading-relaxed">
          {description || "No company description available."}
        </p>
      </div>
    </div>
  );
};

export default React.memo(CompanyDescription);

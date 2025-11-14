import React from 'react';
import { ChevronRight } from 'lucide-react';

/**
 * CompanyHeader Component
 * Header với logo và button view positions
 * 
 * @param {Object} props
 * @param {Object} props.company - Company data
 * @param {Array} props.jobPosts - Job posts array
 * @param {Function} props.onViewPositions - Callback khi click view positions
 */
const CompanyHeader = ({ company, jobPosts, onViewPositions }) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
      <div className="flex items-center">
        <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center overflow-hidden mr-4 shadow-lg">
          {company.logo ? (
            <img src={company.logo} alt={company.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-white text-2xl font-bold">
              {company.name.charAt(0)}
            </span>
          )}
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{company.name}</h2>
          <p className="text-gray-600">{jobPosts[0]?.industries || "Technology"}</p>
        </div>
      </div>
      <button 
        onClick={onViewPositions}
        className="mt-4 md:mt-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-xl flex items-center hover:shadow-xl transition-all duration-300 font-semibold"
      >
        View Open Positions
        <ChevronRight className="w-5 h-5 ml-1" />
      </button>
    </div>
  );
};

export default React.memo(CompanyHeader);

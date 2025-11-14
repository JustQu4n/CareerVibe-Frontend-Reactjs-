import React from 'react';
import { Briefcase, Building, Clock } from 'lucide-react';

/**
 * JobInfoCard Component
 * Hiển thị thông tin job đang apply
 * 
 * @param {Object} props
 * @param {Object} props.jobData - Job data
 */
const JobInfoCard = ({ jobData }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-100">
      <div className="flex items-start">
        <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center mr-4 flex-shrink-0">
          <Briefcase className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-1">
            {jobData.title}
          </h2>
          <div className="flex items-center text-gray-600 mb-3">
            <Building className="h-4 w-4 mr-1" />
            <span>{jobData.company.name}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Full Time
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
              Senior Level
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              <Clock className="mr-1 h-3 w-3" />
              Apply by June 30, 2025
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(JobInfoCard);

import React from 'react';
import { Building, Calendar, FileText, ExternalLink } from 'lucide-react';
import { getStatusBadgeStyle } from '@/utils/applicationHelpers';
import StatusIcon from './StatusIcon';

/**
 * ApplicationCard Component
 * Card hiển thị thông tin application
 * 
 * @param {Object} props
 * @param {Object} props.application - Application data
 * @param {Function} props.onClick - Click handler
 */
const ApplicationCard = ({ application, onClick }) => {
  const { job, status, applied_at } = application;

  return (
    <div 
      className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer border border-gray-100" 
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-blue-100 text-blue-600">
          <Building className="h-5 w-5" />
        </div>
        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeStyle(status)}`}>
          <StatusIcon status={status} className="w-4 h-4" />
          {status?.charAt(0).toUpperCase() + status?.slice(1) || 'Unknown'}
        </span>
      </div>

      {/* Job Info */}
      <h3 className="text-lg font-bold text-gray-800 mb-1 line-clamp-1">
        {job?.title}
      </h3>
      <p className="text-gray-600 mb-3 line-clamp-1">
        {job?.company_id?.name || 'N/A'}
      </p>
      
      {/* Meta Info */}
      <div className="flex flex-wrap gap-y-2 gap-x-4 text-sm text-gray-500 mt-4">
        <div className="flex items-center">
          <Calendar className="w-4 h-4 mr-1.5 text-gray-400" />
          Applied: {new Date(applied_at).toLocaleDateString()}
        </div>
        <div className="flex items-center">
          <FileText className="w-4 h-4 mr-1.5 text-gray-400" />
          {job?.job_type || 'Full Time'}
        </div>
      </div>
      
      {/* Footer */}
      <div className="mt-5 pt-4 border-t border-gray-100 flex justify-end">
        <button className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center">
          View Details
          <ExternalLink className="ml-1 h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};

export default React.memo(ApplicationCard);

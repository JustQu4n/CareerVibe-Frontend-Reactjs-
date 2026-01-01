import React from 'react';
import { Building2, Calendar, Briefcase, ArrowRight, MapPin, DollarSign } from 'lucide-react';
import { getStatusBadgeStyle } from '@/utils/applicationHelpers';
import StatusIcon from './StatusIcon';
import { motion } from 'framer-motion';

/**
 * ApplicationCard Component
 * Card hiển thị thông tin application
 * 
 * @param {Object} props
 * @param {Object} props.application - Application data
 * @param {Function} props.onClick - Click handler
 */
const ApplicationCard = ({ application, onClick }) => {
  // New API structure: application.jobPost instead of application.job
  const { jobPost, status, applied_at } = application;

  return (
    <motion.div
      whileHover={{ y: -8, shadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)" }}
      transition={{ duration: 0.2 }}
      className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer border border-gray-100 overflow-hidden relative" 
      onClick={onClick}
    >
      {/* Gradient top border */}
      <div className="absolute top-0 left-0 right-0 h-1"></div>
      
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 group-hover:scale-110 transition-transform">
              {jobPost?.company?.logo_url ? (
                <img src={jobPost.company.logo_url} alt="" className="w-12 h-12 object-contain rounded-lg" />
              ) : (
                <Building2 className="h-7 w-7 text-blue-600" />
              )}
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                {jobPost?.title || 'N/A'}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-1">
                {jobPost?.company?.name || 'N/A'}
              </p>
            </div>
          </div>
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ${getStatusBadgeStyle(status)} shadow-sm`}>
            <StatusIcon status={status} className="w-3.5 h-3.5" />
            {status?.charAt(0).toUpperCase() + status?.slice(1) || 'Unknown'}
          </span>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2">
            <Calendar className="w-4 h-4 text-blue-500" />
            <span className="font-medium">{new Date(applied_at).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2">
            <Briefcase className="w-4 h-4 text-green-500" />
            <span className="font-medium">{jobPost?.employment_type || 'Full Time'}</span>
          </div>
          {jobPost?.location && (
            <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2">
              <MapPin className="w-4 h-4 text-purple-500" />
              <span className="font-medium truncate">{jobPost.location}</span>
            </div>
          )}
          {jobPost?.salary_range && (
            <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2">
              <DollarSign className="w-4 h-4 text-emerald-500" />
              <span className="font-medium truncate">{jobPost.salary_range}</span>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
          <span className="text-xs text-gray-500 font-medium">
            Applied {Math.ceil((new Date() - new Date(applied_at)) / (1000 * 60 * 60 * 24))} days ago
          </span>
          <button className="text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
            View Details
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default React.memo(ApplicationCard);

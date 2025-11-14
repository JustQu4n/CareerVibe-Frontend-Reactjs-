import React from 'react';
import { Building, MapPin, DollarSign, Calendar, Eye } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

/**
 * JobHeroSection Component
 * Hiển thị thông tin tổng quan của job ở phần header
 * 
 * @param {Object} props
 * @param {Object} props.job - Thông tin job
 */
const JobHeroSection = ({ job }) => {
  const {
    title,
    company_id,
    location,
    salary,
    job_type,
    level,
    views,
    created_at,
  } = job;

  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-10 md:py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-start md:items-center max-w-5xl mx-auto">
          {/* Company Logo */}
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl bg-white p-2 shadow-lg flex items-center justify-center mb-4 md:mb-0">
            <img
              src={company_id?.logo || 'https://via.placeholder.com/64'}
              alt={`${company_id?.name || 'Company'} logo`}
              className="max-h-12 max-w-12"
            />
          </div>

          {/* Job Info */}
          <div className="md:ml-6">
            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-2">
              <span className="px-3 py-1 bg-blue-500/20 backdrop-blur-sm text-white text-xs font-semibold rounded-full">
                {job_type?.replace('_', ' ') || 'Full Time'}
              </span>
              {level && (
                <span className="px-3 py-1 bg-indigo-500/20 backdrop-blur-sm text-white text-xs font-semibold rounded-full">
                  {level}
                </span>
              )}
              <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold rounded-full flex items-center">
                <Eye className="mr-1 h-3 w-3" />
                {views || 0} views
              </span>
            </div>

            {/* Job Title */}
            <h1 className="text-2xl md:text-3xl font-bold mb-2">{title}</h1>

            {/* Job Meta Info */}
            <div className="flex flex-wrap items-center text-sm text-blue-100 gap-y-2">
              <div className="flex items-center mr-4">
                <Building className="h-4 w-4 mr-1" />
                <span>{company_id?.name || 'Company Name'}</span>
              </div>
              <div className="flex items-center mr-4">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{location || 'Remote'}</span>
              </div>
              <div className="flex items-center mr-4">
                <DollarSign className="h-4 w-4 mr-1" />
                <span>
                  {salary ? `$${salary.toLocaleString()}` : 'Competitive salary'}
                </span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                <span>
                  Posted{' '}
                  {created_at
                    ? formatDistanceToNow(new Date(created_at), { addSuffix: true })
                    : 'recently'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(JobHeroSection);

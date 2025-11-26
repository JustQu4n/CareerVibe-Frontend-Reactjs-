import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Star,
  Bookmark,
  Building2,
  Clock,
  MapPin,
  Briefcase,
  DollarSign,
  ArrowRight,
} from 'lucide-react';

/**
 * RelatedJobCard Component
 * Card hiển thị job liên quan
 * 
 * @param {Object} props
 * @param {Object} props.job - Thông tin job
 */
const RelatedJobCard = ({ job }) => {
  const navigate = useNavigate();

  const id = job?.job_post_id || job?._id;

  const handleClick = () => {
    if (id) navigate(`/view-job-detail/${id}`);
  };

  const company = job?.company || job?.company_id || {};

  return (
    <div
      onClick={handleClick}
      className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all duration-200 cursor-pointer relative group"
    >
      <div className="absolute top-3 right-3 z-10">
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-600 text-white">
          <Star className="h-3 w-3 mr-1 fill-white" />
          Related
        </span>
      </div>

      <button
        type="button"
        className="absolute top-3 left-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50"
      >
        <Bookmark className="h-4 w-4 text-gray-500 hover:text-blue-600" />
      </button>

      <div className="p-4">
        <div className="flex items-start space-x-3 mb-3">
          <div className="h-12 w-12 bg-gray-50 border border-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
            {company?.logo_url || company?.logo ? (
              <img
                src={company?.logo_url || company?.logo}
                alt={`${company?.name || 'Company'} logo`}
                className="h-full w-full object-contain"
              />
            ) : (
              <Building2 className="h-6 w-6 text-gray-400" />
            )}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 truncate">{company?.name || 'Company Name'}</h3>
            <span className="block text-gray-500 text-xs mt-0.5">{company?.industry || 'Industry'}</span>
          </div>
        </div>

        <h2 className="text-base font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">{job?.title || 'Untitled'}</h2>

        <div className="space-y-2 mb-3">
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="h-4 w-4 text-blue-500 mr-2 flex-shrink-0" />
            <span className="truncate">{job?.location || job?.address || 'Not specified'}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Briefcase className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
            <span>
              {job?.employment_type === 'full-time'
                ? 'Full-time'
                : job?.employment_type === 'part-time'
                ? 'Part-time'
                : job?.employment_type === 'contract'
                ? 'Contract'
                : job?.employment_type || 'Full-time'}
            </span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <DollarSign className="h-4 w-4 text-emerald-500 mr-2 flex-shrink-0" />
            <span className="truncate">{job?.salary_range || 'Competitive'}</span>
          </div>
        </div>

        <div className="pt-3 mt-3 border-t border-gray-100 flex justify-between items-center">
          <div className="flex items-center text-xs text-gray-500">
            <Clock className="h-3.5 w-3.5 mr-1" />
            Deadline: {job?.deadline ? new Date(job.deadline).toLocaleDateString('en-GB') : 'N/A'}
          </div>
          <span className="inline-flex items-center text-sm font-medium text-blue-600 group-hover:translate-x-1 transition-transform">
            View Details
            <ArrowRight className="ml-1 h-4 w-4" />
          </span>
        </div>
      </div>
    </div>
  );
};

export default React.memo(RelatedJobCard);

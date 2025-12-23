import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bookmark,
  Building2,
  MapPin,
  DollarSign,
  ArrowRight,
} from 'lucide-react';

/**
 * RelatedJobCard Component - Compact card for carousel
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
      className="flex-shrink-0 w-80 bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-lg hover:border-blue-300 transition-all duration-300 cursor-pointer relative group"
    >
      {/* Bookmark Button */}
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); }}
        className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 bg-white/90 backdrop-blur-sm rounded-full shadow-md flex items-center justify-center hover:bg-blue-50"
      >
        <Bookmark className="h-3.5 w-3.5 text-gray-600 hover:text-blue-600" />
      </button>

      <div className="p-4">
        {/* Company Header */}
        <div className="flex items-center gap-3 mb-3">
          <div className="h-10 w-10 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
            {company?.logo_url || company?.logo ? (
              <img
                src={company?.logo_url || company?.logo}
                alt={`${company?.name || 'Company'} logo`}
                className="h-full w-full object-contain p-1"
              />
            ) : (
              <Building2 className="h-5 w-5 text-gray-400" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate text-sm">{company?.name || 'Company Name'}</h3>
            <span className="block text-gray-500 text-xs truncate">{company?.industry || 'Industry'}</span>
          </div>
        </div>

        {/* Job Title */}
        <h2 className="text-base font-bold text-gray-900 mb-3 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
          {job?.title || 'Untitled Position'}
        </h2>

        {/* Job Details - Compact */}
        <div className="space-y-2 mb-3">
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <MapPin className="h-3.5 w-3.5 text-purple-600 flex-shrink-0" />
            <span className="truncate">{job?.location || job?.address || 'Not specified'}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <DollarSign className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" />
            <span className="truncate">{job?.salary_range || 'Competitive'}</span>
          </div>
        </div>

        {/* Employment Type Badge */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <span className="inline-flex items-center px-2.5 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-semibold">
            {job?.employment_type === 'full-time'
              ? 'Full-time'
              : job?.employment_type === 'part-time'
              ? 'Part-time'
              : job?.employment_type === 'contract'
              ? 'Contract'
              : job?.employment_type || 'Full-time'}
          </span>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 group-hover:gap-1.5 transition-all">
            View
            <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </div>
  );
};

export default React.memo(RelatedJobCard);

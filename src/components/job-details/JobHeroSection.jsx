import React from 'react';
import { Building2, MapPin, DollarSign, Calendar, Eye, Sparkles, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

/**
 * JobHeroSection Component
 * Modern hero section with enhanced UI/UX and beautiful gradient design
 */
const JobHeroSection = ({ job }) => {
  const {
    title,
    company,
    location,
    salary_range,
    employment_type,
    views_count,
    created_at,
  } = job;
  const coverUrl = company?.cover_url || company?.cover || company?.cover_image || null;

  return (
    <div
      className={`relative text-white py-8 md:py-12 overflow-hidden ${coverUrl ? '' : 'bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700'}`}
      style={
        coverUrl
          ? { backgroundImage: `url(${coverUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }
          : undefined
      }
    >
      {coverUrl && <div className="absolute inset-0 bg-black/40" />}
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            {/* Company Logo */}
            <div className="relative group">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl bg-white p-2 shadow-2xl flex items-center justify-center transform transition-all duration-300 group-hover:scale-105 group-hover:rotate-3">
                <img
                  src={company?.logo_url || 'https://via.placeholder.com/96'}
                  alt={`${company?.name || 'Company'} logo`}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-3 border-white shadow-lg">
                <Sparkles className="h-2.5 w-2.5 text-white" />
              </div>
            </div>

            {/* Job Info */}
            <div className="flex-1 space-y-3">
              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-xs font-semibold rounded-full border border-white/30 shadow-lg flex items-center gap-1 hover:bg-white/30 transition-colors">
                  <Clock className="h-3 w-3" />
                  {employment_type === 'full-time' ? 'Full Time' : 
                   employment_type === 'part-time' ? 'Part Time' : 
                   employment_type === 'contract' ? 'Contract' : 
                   employment_type || 'Full Time'}
                </span>
                {company?.industry && (
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-xs font-semibold rounded-full border border-white/30 shadow-lg hover:bg-white/30 transition-colors">
                    {company.industry}
                  </span>
                )}
                <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-xs font-semibold rounded-full border border-white/30 shadow-lg flex items-center gap-1 hover:bg-white/30 transition-colors">
                  <Eye className="h-3 w-3" />
                  {views_count || 0}
                </span>
              </div>

              {/* Job Title */}
              <h1 className="text-2xl md:text-3xl font-bold leading-tight">
                {title}
              </h1>

              {/* Job Meta Info - Badge Style */}
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/15 backdrop-blur-sm text-white font-medium rounded-full border border-white/20 shadow-sm">
                  <Building2 className="h-3.5 w-3.5 flex-shrink-0" />
                  {company?.name || 'Company Name'}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/15 backdrop-blur-sm text-white font-medium rounded-full border border-white/20 shadow-sm">
                  <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                  {location || 'Not specified'}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/15 backdrop-blur-sm text-white font-medium rounded-full border border-white/20 shadow-sm">
                  <DollarSign className="h-3.5 w-3.5 flex-shrink-0" />
                  {salary_range || 'Competitive'}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/15 backdrop-blur-sm text-white font-medium rounded-full border border-white/20 shadow-sm">
                  <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
                  {created_at
                    ? formatDistanceToNow(new Date(created_at), { addSuffix: true })
                    : 'Posted recently'}
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

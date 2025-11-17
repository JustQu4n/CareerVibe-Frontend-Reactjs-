/**
 * FeaturedJobsSection Component
 * Displays featured jobs with pagination
 */
import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Star,
  Bookmark,
  Building2,
  Clock,
  MapPin,
  Briefcase,
  DollarSign,
  Users,
  Award,
  ArrowRight,
  ChevronsRight,
} from 'lucide-react';

const getTimeAgo = () => '3 hours ago';

const FeaturedJobsSection = React.memo(({
  jobs,
  currentPage,
  totalPages,
  onNextPage,
  onPrevPage,
}) => {
  const navigate = useNavigate();

  return (
    <section className="py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
          <div>
            <span className="text-blue-600 font-semibold text-sm bg-blue-50 px-4 py-1.5 rounded-full">
              Explore Opportunities
            </span>
            <h2 className="text-3xl font-bold mt-3 text-gray-900">Featured Jobs</h2>
            <p className="text-gray-600 mt-2">
              Discover handpicked positions from top employers
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 flex items-center space-x-3">
            <div className="flex">
              <button
                type="button"
                onClick={onPrevPage}
                disabled={currentPage === 0}
                className={`w-10 h-10 flex items-center justify-center rounded-l-lg border border-r-0 ${
                  currentPage === 0
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={onNextPage}
                disabled={currentPage >= totalPages - 1}
                className={`w-10 h-10 flex items-center justify-center rounded-r-lg border ${
                  currentPage >= totalPages - 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
            <button
              type="button"
              onClick={() => navigate('/find-job')}
              className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
            >
              Browse All Jobs
              <ChevronRight className="h-5 w-5 ml-1" />
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job, idx) => (
            <motion.div
              key={job.job_post_id || idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.1 }}
              whileHover={{ y: -5 }}
              onClick={() => navigate(`/view-job-detail/${job.job_post_id}`)}
              className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all duration-300 cursor-pointer relative group"
            >
              <div className="absolute top-4 right-4 z-10">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-600 text-white">
                  <Star className="h-3 w-3 mr-1 fill-white" />
                  Featured
                </span>
              </div>
              
              <button
                type="button"
                className="absolute top-4 left-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50"
              >
                <Bookmark className="h-4 w-4 text-gray-500 hover:text-blue-600" />
              </button>
              
              <div className="p-6">
                <div className="flex items-start space-x-3 mb-4">
                  <div className="h-12 w-12 bg-gray-50 border border-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                    {job.company?.logo_url ? (
                      <img
                        src={job.company.logo_url}
                        alt={`${job.company.name} logo`}
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <Building2 className="h-6 w-6 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {job.company?.name || 'Company Name'}
                    </h3>
                    <span className="block text-gray-500 text-xs mt-0.5">
                      {job.company?.industry || 'Technology'}
                    </span>
                  </div>
                </div>
                
                <h2 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {job.title}
                </h2>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 text-blue-500 mr-2 flex-shrink-0" />
                    <span className="truncate">{job.location || 'Not specified'}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Briefcase className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    <span>
                      {job.employment_type === 'full-time'
                        ? 'Full-time'
                        : job.employment_type === 'part-time'
                        ? 'Part-time'
                        : job.employment_type === 'contract'
                        ? 'Contract'
                        : job.employment_type || 'Full-time'}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <DollarSign className="h-4 w-4 text-emerald-500 mr-2 flex-shrink-0" />
                    <span className="truncate">{job.salary_range || 'Competitive'}</span>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {job.description || 'No description available'}
                </p>
                
                <div className="pt-4 mt-4 border-t border-gray-100 flex justify-between items-center">
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock className="h-3.5 w-3.5 mr-1" />
                    Deadline: {new Date(job.deadline).toLocaleDateString('en-GB')}
                  </div>
                  <span className="inline-flex items-center text-sm font-medium text-blue-600 group-hover:translate-x-1 transition-transform">
                    View Details
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-8 flex justify-center md:hidden">
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={onPrevPage}
              disabled={currentPage === 0}
              className={`w-10 h-10 flex items-center justify-center rounded-lg border ${
                currentPage === 0 ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-700'
              }`}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <span className="text-sm text-gray-600">
              Page {currentPage + 1} of {totalPages}
            </span>
            <button
              type="button"
              onClick={onNextPage}
              disabled={currentPage >= totalPages - 1}
              className={`w-10 h-10 flex items-center justify-center rounded-lg border ${
                currentPage >= totalPages - 1
                  ? 'bg-gray-100 text-gray-400'
                  : 'bg-white text-gray-700'
              }`}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <div className="mt-8 text-center md:hidden">
          <button
            type="button"
            onClick={() => navigate('/find-job')}
            className="inline-flex items-center text-blue-600 font-medium"
          >
            Browse All Jobs
            <ChevronsRight className="ml-1 h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
});

FeaturedJobsSection.displayName = 'FeaturedJobsSection';

FeaturedJobsSection.propTypes = {
  jobs: PropTypes.array.isRequired,
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onNextPage: PropTypes.func.isRequired,
  onPrevPage: PropTypes.func.isRequired,
};

export default FeaturedJobsSection;

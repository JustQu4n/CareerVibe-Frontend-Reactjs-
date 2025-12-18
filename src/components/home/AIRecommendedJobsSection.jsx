/**
 * AIRecommendedJobsSection Component  
 * Shows AI-powered job recommendations from Python recommendation service
 */
import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ChevronRight,
  AlertTriangle,
  Brain,
  TrendingUp,
  MapPin,
  Briefcase,
  DollarSign,
  Clock,
  Building2,
  Bookmark,
  ArrowRight,
} from 'lucide-react';

const AIRecommendedJobsSection = React.memo(({
  recommendations,
  isLoading,
  error,
  user,
}) => {
  const navigate = useNavigate();

  // Don't show section if user is not a jobseeker
  if (!user || user?.role === 'Recruiter') return null;

  // Helper function to format job type
  const formatJobType = (type) => {
    const types = {
      full_time: 'Full-time',
      'full-time': 'Full-time',
      part_time: 'Part-time',
      'part-time': 'Part-time',
      contract: 'Contract',
      internship: 'Internship',
      freelance: 'Freelance',
    };
    return types[type] || 'Full-time';
  };

  // Helper function to format salary
  const formatSalary = (salary) => {
    if (!salary) return 'Competitive';
    return salary;
  };

  return (
    <section className="py-16 px-6 bg-gradient-to-br from-blue-50 via-blue-50 to-indigo-50">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
          <div>
            <span className="text-blue-600 font-semibold text-sm bg-blue-100 px-4 py-1.5 rounded-full flex items-center w-fit">
              <Sparkles className="h-4 w-4 mr-1" />
              AI Recommendations
            </span>
            <h2 className="text-3xl font-bold mt-3 text-gray-900 flex items-center">
              Jobs Picked Just For You
              <div className="ml-3 px-2 py-1 bg-gradient-to-r from-blue-100 to-blue-100 text-blue-700 text-xs font-semibold rounded-md flex items-center">
                <Brain className="h-3 w-3 mr-1" />
                ML Powered
              </div>
            </h2>
            <p className="text-gray-600 mt-2">
              Intelligent job matching based on your profile and preferences
            </p>
          </div>
          
          <button
            type="button"
            onClick={() => navigate('/find-job')}
            className="mt-4 md:mt-0 flex items-center text-blue-600 hover:text-blue-800 font-medium"
          >
            Explore More Jobs
            <ChevronRight className="h-5 w-5 ml-1" />
          </button>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            <p className="ml-4 text-gray-600 font-medium">
              AI is analyzing the best matches for you...
            </p>
          </div>
        )}

        {error && (
          <div className="text-center py-10 px-6 bg-red-50 rounded-xl border border-red-100">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 text-red-600 mb-4">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-red-800 mb-2">
              Unable to Load AI Recommendations
            </h3>
            <p className="text-red-600">{error}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {!isLoading && !error && recommendations.length === 0 && (
          <div className="text-center py-12 px-6 bg-blue-50 rounded-xl border border-blue-100">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-4">
              <Brain className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Building Your Recommendations
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Our AI is still learning your preferences. Complete your profile to get personalized job recommendations.
            </p>
            <button
              type="button"
              onClick={() => navigate('/profile')}
              className="mt-6 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Complete Your Profile
            </button>
          </div>
        )}

        {!isLoading && !error && recommendations.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.slice(0, 6).map((job, idx) => (
              <motion.div
                key={job.job_post_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.1 }}
                whileHover={{ y: -5 }}
                onClick={() => navigate(`/view-job-detail/${job.job_post_id}`)}
                className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all duration-300 cursor-pointer relative group"
              >
                {/* Match Score Badge - Top Right */}
                <div className="absolute top-4 right-4 z-10">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {Math.round(job.score * 100)}% Match
                  </span>
                </div>

                {/* Bookmark Button - Top Left */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Add bookmark logic here
                  }}
                  className="absolute top-4 left-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50"
                >
                  <Bookmark className="h-4 w-4 text-gray-500 hover:text-blue-600" />
                </button>
                
                <div className="p-6">
                  {/* Company Info */}
                  <div className="flex items-start space-x-3 mb-4">
                    <div className="h-12 w-12 bg-gray-50 border border-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                        {(job.company_logo || job.company?.logo_url) ? (
                          <img
                            src={job.company_logo || job.company.logo_url}
                            alt={`${job.company_name || job.company?.name || 'Company'} logo`}
                            className="h-full w-full object-contain"
                          />
                        ) : (
                          <Building2 className="h-6 w-6 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {job.company_name || job.company?.name || 'Company Name'}
                        </h3>
                        <span className="block text-gray-500 text-xs mt-0.5">
                          {job.company?.industry || 'Technology'}
                        </span>
                      </div>
                  </div>
                  
                  {/* Job Title */}
                  <h2 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {job.title}
                  </h2>
                  
                  {/* Job Info */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 text-blue-500 mr-2 flex-shrink-0" />
                      <span className="truncate">{job.location || 'Not specified'}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Briefcase className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      <span>{formatJobType(job.job_type)}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <DollarSign className="h-4 w-4 text-emerald-500 mr-2 flex-shrink-0" />
                      <span className="truncate">{formatSalary(job.salary_range)}</span>
                    </div>
                  </div>
                  
                  {/* Footer */}
                  <div className="pt-4 mt-4 border-t border-gray-100 flex justify-between items-center">
                    <div className="flex items-center text-xs text-blue-600 font-medium">
                      <Sparkles className="h-3.5 w-3.5 mr-1" />
                      AI Recommended
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
        )}

        {/* Show More Button */}
        {!isLoading && !error && recommendations.length > 6 && (
          <div className="text-center mt-8">
            <button
              type="button"
              onClick={() => navigate('/find-job')}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-blue-700 transition-all shadow-md hover:shadow-lg"
            >
              View All {recommendations.length} Recommendations
            </button>
          </div>
        )}
      </div>
    </section>
  );
});

AIRecommendedJobsSection.displayName = 'AIRecommendedJobsSection';

AIRecommendedJobsSection.propTypes = {
  recommendations: PropTypes.arrayOf(
    PropTypes.shape({
      job_post_id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      score: PropTypes.number.isRequired,
      snippet: PropTypes.string,
      location: PropTypes.string,
      job_type: PropTypes.string,
      salary_range: PropTypes.string,
      status: PropTypes.string,
    })
  ).isRequired,
  isLoading: PropTypes.bool.isRequired,
  error: PropTypes.string,
  user: PropTypes.object,
};

export default AIRecommendedJobsSection;

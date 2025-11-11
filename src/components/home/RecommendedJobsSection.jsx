/**
 * RecommendedJobsSection Component  
 * Shows AI-powered job recommendations for logged-in users
 */
import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  ChevronRight,
  AlertTriangle,
  Layers,
  MapPin,
  Briefcase,
  Clock,
  Star,
} from 'lucide-react';

const getTimeAgo = () => '3 hours ago';

const RecommendedJobsSection = React.memo(({
  jobs,
  isLoading,
  error,
  user,
}) => {
  const navigate = useNavigate();

  if (!user?.jobseeker?.id) return null;

  return (
    <section className="py-16 px-6 bg-gradient-to-r from-blue-50 to-indigo-50">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
          <div>
            <span className="text-blue-600 font-semibold text-sm bg-blue-100 px-4 py-1.5 rounded-full">
              Personalized For You
            </span>
            <h2 className="text-3xl font-bold mt-3 text-gray-900 flex items-center">
              Recommended Jobs
              <div className="ml-3 px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-md flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                AI Powered
              </div>
            </h2>
            <p className="text-gray-600 mt-2">
              Jobs matching your skills, experience, and preferences
            </p>
          </div>
          
          <button
            type="button"
            onClick={() => navigate('/find-job')}
            className="mt-4 md:mt-0 flex items-center text-blue-600 hover:text-blue-800 font-medium"
          >
            View All Recommendations
            <ChevronRight className="h-5 w-5 ml-1" />
          </button>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            <p className="ml-4 text-gray-600 font-medium">
              Finding the perfect matches for you...
            </p>
          </div>
        )}

        {error && (
          <div className="text-center py-10 px-6 bg-red-50 rounded-xl border border-red-100">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 text-red-600 mb-4">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-red-800 mb-2">
              Unable to Load Recommendations
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

        {!isLoading && !error && jobs.length === 0 && (
          <div className="text-center py-12 px-6 bg-blue-50 rounded-xl border border-blue-100">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-4">
              <Layers className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Recommendations Yet
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              We're still learning about your preferences. Update your profile or browse
              jobs to help us provide better recommendations.
            </p>
            <button
              type="button"
              onClick={() => navigate('/profile')}
              className="mt-6 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Update Your Profile
            </button>
          </div>
        )}

        {!isLoading && !error && jobs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center mr-3">
                        <img
                          src={job.company_id?.logo || 'https://via.placeholder.com/40x40'}
                          alt={`${job.company_id?.name || 'Company'} logo`}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {job.company_id?.name || 'Company'}
                        </h3>
                        <div className="flex items-center text-xs text-gray-500">
                          <MapPin className="h-3 w-3 mr-1" />
                          <span>{job.location || 'Remote'}</span>
                        </div>
                      </div>
                    </div>
                    <div className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-md flex items-center">
                      <Star className="h-3 w-3 mr-1" />
                      {Math.round(job.score * 100)}% Match
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">
                    {job.title}
                  </h3>
                  
                  <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
                    <div className="flex items-center">
                      <Briefcase className="h-4 w-4 mr-1 text-gray-400" />
                      <span>
                        {job.job_type === 'full_time'
                          ? 'Full-time'
                          : job.job_type === 'part_time'
                          ? 'Part-time'
                          : job.job_type}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-gray-400" />
                      <span>{getTimeAgo(job.created_at)}</span>
                    </div>
                  </div>
                  
                  <div className="mb-4 flex flex-wrap gap-2">
                    {job.skills?.slice(0, 3).map((skill, idx) => (
                      <span
                        key={idx}
                        className="inline-block px-2.5 py-0.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                    {job.skills?.length > 3 && (
                      <span className="inline-block px-2.5 py-0.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                        +{job.skills.length - 3} more
                      </span>
                    )}
                  </div>
                  
                  <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                    <div className="text-blue-600 text-sm font-medium"></div>
                    <button
                      type="button"
                      onClick={() => navigate(`/view-job-detail/${job._id}`)}
                      className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-600 hover:text-white transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
});

RecommendedJobsSection.displayName = 'RecommendedJobsSection';

RecommendedJobsSection.propTypes = {
  jobs: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
  error: PropTypes.string,
  user: PropTypes.object,
};

export default RecommendedJobsSection;

import React, { useCallback } from 'react';
import { ChevronRight, Briefcase } from 'lucide-react';
import JobCard from '../components_lite/JobCard';

/**
 * OpenPositions Component
 * Hiển thị danh sách job openings của công ty
 * 
 * @param {Object} props
 * @param {Array} props.jobPosts - Array of job posts
 */
const OpenPositions = ({ jobPosts = [] }) => {
  const handleViewAll = useCallback(() => {
    // Scroll to top of positions or navigate
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <Briefcase className="w-6 h-6 text-blue-600" />
        Open Positions ({jobPosts.length})
      </h3>
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200">
        {jobPosts.length > 0 ? (
          <>
            <div className="space-y-4">
              {jobPosts.map((job) => (
                <div 
                  key={job.job_post_id}
                  className="bg-white rounded-xl p-4 hover:shadow-lg transition-shadow duration-300"
                >
                  <JobCard index={job.job_post_id} job={job} />
                </div>
              ))}
            </div>
            <div className="mt-6 text-center">
              <button 
                onClick={handleViewAll}
                className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 transition-colors bg-blue-50 px-6 py-3 rounded-xl hover:bg-blue-100"
              >
                View All Open Positions
                <ChevronRight className="w-5 h-5 ml-1" />
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg">No open positions available at the moment.</p>
            <p className="text-gray-400 text-sm mt-2">Check back later for new opportunities!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(OpenPositions);

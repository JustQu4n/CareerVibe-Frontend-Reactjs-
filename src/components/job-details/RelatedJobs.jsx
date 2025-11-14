import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, ChevronRight } from 'lucide-react';
import RelatedJobCard from './RelatedJobCard';

/**
 * RelatedJobs Component
 * Hiển thị danh sách các job tương tự
 * 
 * @param {Object} props
 * @param {Array} props.jobs - Danh sách jobs liên quan
 * @param {boolean} props.loading - Trạng thái loading
 */
const RelatedJobs = ({ jobs = [], loading = false }) => {
  return (
    <div className="bg-gradient-to-b from-white to-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <Briefcase className="mr-2 h-6 w-6 text-blue-600" />
            Similar Jobs You Might Like
          </h2>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {/* Jobs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job) => (
                <RelatedJobCard key={job._id} job={job} />
              ))}
            </div>

            {/* Browse All Jobs Link */}
            <div className="text-center mt-8">
              <Link
                to="/find-job"
                className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Browse All Jobs
                <ChevronRight className="h-5 w-5 ml-1" />
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default React.memo(RelatedJobs);

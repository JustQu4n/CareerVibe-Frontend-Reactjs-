import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Loader2, AlertCircle, FileText } from 'lucide-react';
import InterviewCard from './InterviewCard';
import { getApplicationsWithInterviews } from '@/services/interviewService';

/**
 * ApplicationsWithInterviews Component
 * Hiển thị danh sách applications có interview
 */
const ApplicationsWithInterviews = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchApplicationsWithInterviews();
  }, []);

  const fetchApplicationsWithInterviews = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getApplicationsWithInterviews();
      setApplications(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể tải danh sách interview');
      console.error('Error fetching applications with interviews:', err);
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
        <div className="flex items-center justify-center">
          <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
          <span className="ml-3 text-gray-600 text-sm">Loading interviews...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-red-50 border border-red-200 rounded-2xl p-5 mb-6"
      >
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-base font-semibold text-red-900 mb-1">Error Loading Data</h3>
            <p className="text-sm text-red-700 mb-3">{error}</p>
            <button
              onClick={fetchApplicationsWithInterviews}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
            >
              Retry
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  // Empty state
  if (applications.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-sm p-6 mb-6 text-center border border-blue-100"
      >
        <div className="flex flex-col items-center">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-3 shadow-lg">
            <FileText className="w-7 h-7 text-white" />
          </div>
          <h3 className="text-base font-semibold text-gray-900 mb-2">
            No Interviews Yet
          </h3>
          <p className="text-sm text-gray-600 max-w-md">
            You don't have any assigned interviews. Interviews from employers will appear here.
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="mb-8">
      {/* Section Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
            <Briefcase className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Assigned Interviews
            </h2>
            <p className="text-sm text-gray-600">
              {applications.length} {applications.length === 1 ? 'interview' : 'interviews'} waiting for you
            </p>
          </div>
        </div>
      </div>

      {/* Interview Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {applications.map((app, index) => (
          <InterviewCard
            key={app.application_id || index}
            application={app}
          />
        ))}
      </div>
    </div>
  );
};

export default React.memo(ApplicationsWithInterviews);

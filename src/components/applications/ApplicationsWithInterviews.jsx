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
      <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
        <div className="flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <span className="ml-3 text-gray-600">Đang tải danh sách interview...</span>
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
        className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8"
      >
        <div className="flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-lg font-semibold text-red-900 mb-1">Lỗi tải dữ liệu</h3>
            <p className="text-sm text-red-700 mb-3">{error}</p>
            <button
              onClick={fetchApplicationsWithInterviews}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
            >
              Thử lại
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
        className="bg-white rounded-xl shadow-sm p-8 mb-8 text-center"
      >
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Chưa có interview nào
          </h3>
          <p className="text-sm text-gray-600 max-w-md">
            Bạn chưa có interview nào được giao. Các interview từ nhà tuyển dụng sẽ hiển thị ở đây.
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="mb-8">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800 flex items-center">
          <Briefcase className="mr-2 h-5 w-5 text-blue-500" />
          Interviews Assigned ({applications.length})
        </h2>
      </div>

      {/* Interview Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  History, 
  Loader2, 
  AlertCircle, 
  TrendingUp, 
  Award,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  FileText,
  Building2,
  Briefcase
} from 'lucide-react';
import { getInterviewHistory } from '@/services/interviewService';

/**
 * InterviewHistoryCard Component
 * Hiển thị thông tin chi tiết một interview đã làm
 */
const InterviewHistoryCard = ({ interviewData }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { candidate_interview_id, interview, jobPost, status, total_score, max_score, percentage, result, answers, completed_at, started_at } = interviewData;

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get result badge
  const getResultBadge = (result) => {
    if (result === 'pass') {
      return (
        <span className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold border border-green-200">
          <CheckCircle className="w-4 h-4" />
          Đạt
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold border border-red-200">
        <XCircle className="w-4 h-4" />
        Chưa đạt
      </span>
    );
  };

  // Calculate duration
  const calculateDuration = (start, end) => {
    if (!start || !end) return 'N/A';
    const diff = new Date(end) - new Date(start);
    const minutes = Math.floor(diff / (1000 * 60));
    return `${minutes} phút`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 border-b border-gray-100">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              {jobPost?.title || 'N/A'}
            </h3>
            <div className="flex items-center text-sm text-gray-600 mb-2">
              <Building2 className="w-4 h-4 mr-1" />
              <span>{jobPost?.company?.company_name || 'N/A'}</span>
            </div>
          </div>
          {result && getResultBadge(result)}
        </div>
      </div>

      {/* Score Section */}
      <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">Điểm số</p>
            <p className="text-3xl font-bold text-blue-600">
              {total_score || 0}<span className="text-lg text-gray-500">/{max_score || 100}</span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600 mb-1">Phần trăm</p>
            <p className="text-3xl font-bold text-indigo-600">{percentage || 0}%</p>
          </div>
        </div>
      </div>

      {/* Interview Details */}
      <div className="p-4 space-y-3">
        {/* Interview Title */}
        <div className="flex items-start gap-2">
          <FileText className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-gray-700">Bài phỏng vấn</p>
            <p className="text-base font-semibold text-gray-900">{interview?.title || 'N/A'}</p>
          </div>
        </div>

        {/* Time Info */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">Hoàn thành</p>
              <p className="font-medium text-gray-900">{formatDate(completed_at)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">Thời gian làm</p>
              <p className="font-medium text-gray-900">{calculateDuration(started_at, completed_at)}</p>
            </div>
          </div>
        </div>

        {/* Expand Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-sm font-medium text-gray-700"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="w-4 h-4" />
              Ẩn chi tiết câu trả lời
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4" />
              Xem chi tiết câu trả lời ({answers?.length || 0} câu)
            </>
          )}
        </button>

        {/* Expanded Answers Section */}
        <AnimatePresence>
          {isExpanded && answers && answers.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-3 pt-3 border-t border-gray-200"
            >
              {answers.map((answer, index) => (
                <div
                  key={answer.question_id || index}
                  className="bg-gray-50 rounded-lg p-4 space-y-2"
                >
                  {/* Question */}
                  <div className="flex items-start gap-2">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </span>
                    <p className="text-sm font-semibold text-gray-900">{answer.question_text}</p>
                  </div>

                  {/* Answer */}
                  <div className="ml-8">
                    <p className="text-sm text-gray-700 mb-2">
                      <span className="font-medium">Câu trả lời:</span> {answer.answer_text || 'Không có câu trả lời'}
                    </p>

                    {/* Score */}
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">
                        Điểm: <span className="font-bold text-blue-600">{answer.score || 0}/{answer.max_score || 10}</span>
                      </span>
                      <span className="text-gray-500">
                        Thời gian: {answer.elapsed_seconds || 0}s
                      </span>
                    </div>

                    {/* Feedback */}
                    {answer.feedback && (
                      <div className="mt-2 p-2 bg-blue-50 border border-blue-100 rounded text-xs">
                        <p className="text-blue-900">
                          <span className="font-semibold">Nhận xét:</span> {answer.feedback}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

/**
 * InterviewHistory Component
 * Hiển thị lịch sử interview đã làm với điểm và feedback
 */
const InterviewHistory = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchInterviewHistory();
  }, []);

  const fetchInterviewHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getInterviewHistory();
      setInterviews(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể tải lịch sử interview');
      console.error('Error fetching interview history:', err);
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
        <div className="flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
          <span className="ml-3 text-gray-600">Đang tải lịch sử interview...</span>
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
              onClick={fetchInterviewHistory}
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
  if (interviews.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm p-8 mb-8 text-center"
      >
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mb-4">
            <History className="w-8 h-8 text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Chưa có lịch sử interview
          </h3>
          <p className="text-sm text-gray-600 max-w-md">
            Bạn chưa hoàn thành interview nào. Lịch sử các interview đã làm sẽ hiển thị ở đây.
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
          <History className="mr-2 h-5 w-5 text-purple-500" />
          Interview History ({interviews.length})
        </h2>
      </div>

      {/* Interview History Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {interviews.map((interview, index) => (
          <InterviewHistoryCard
            key={interview.candidate_interview_id || index}
            interviewData={interview}
          />
        ))}
      </div>
    </div>
  );
};

export default React.memo(InterviewHistory);

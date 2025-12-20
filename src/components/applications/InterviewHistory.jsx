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
        <span className="flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-semibold border border-green-200">
          <CheckCircle className="w-3 h-3" />
          Passed
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1 px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs font-semibold border border-red-200">
        <XCircle className="w-3 h-3" />
        Failed
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
      whileHover={{ y: -4 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg transition-all overflow-hidden group"
    >
     
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-3 border-b border-gray-100">
        <div className="flex items-start justify-between mb-1">
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-gray-900 mb-1 line-clamp-1">
              {jobPost?.title || 'N/A'}
            </h3>
            <div className="flex items-center text-xs text-gray-600">
              <Building2 className="w-3 h-3 mr-1" />
              <span className="truncate">{jobPost?.company?.company_name || 'N/A'}</span>
            </div>
          </div>
          {result && getResultBadge(result)}
        </div>
      </div>

      {/* Score Section */}
      <div className="p-3 bg-gradient-to-br from-blue-50 to-indigo-50 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-600 mb-0.5">Score</p>
            <p className="text-2xl font-bold text-blue-600">
              {total_score || 0}<span className="text-sm text-gray-500">/{max_score || 100}</span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-600 mb-0.5">Percentage</p>
            <p className="text-2xl font-bold text-indigo-600">{percentage || 0}%</p>
          </div>
        </div>
      </div>

      {/* Interview Details */}
      <div className="p-3 space-y-2">
        {/* Interview Title */}
        <div className="flex items-start gap-2">
          <FileText className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-xs font-medium text-gray-600">Interview</p>
            <p className="text-sm font-semibold text-gray-900 line-clamp-1">{interview?.title || 'N/A'}</p>
          </div>
        </div>

        {/* Time Info */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">Completed</p>
              <p className="font-medium text-gray-900 text-xs">{formatDate(completed_at)}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">Duration</p>
              <p className="font-medium text-gray-900 text-xs">{calculateDuration(started_at, completed_at)}</p>
            </div>
          </div>
        </div>

        {/* Expand Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-center gap-2 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-xs font-medium text-gray-700"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="w-3.5 h-3.5" />
              Hide Details
            </>
          ) : (
            <>
              <ChevronDown className="w-3.5 h-3.5" />
              View Answers ({answers?.length || 0})
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
              className="space-y-2 pt-2 border-t border-gray-200"
            >
              {answers.map((answer, index) => (
                <div
                  key={answer.question_id || index}
                  className="bg-gray-50 rounded-lg p-2.5 space-y-1.5"
                >
                  {/* Question */}
                  <div className="flex items-start gap-1.5">
                    <span className="flex-shrink-0 w-5 h-5 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </span>
                    <p className="text-xs font-semibold text-gray-900">{answer.question_text}</p>
                  </div>

                  {/* Answer */}
                  <div className="ml-6">
                    <p className="text-xs text-gray-700 mb-1">
                      <span className="font-medium">Answer:</span> {answer.answer_text || 'No answer'}
                    </p>

                    {/* Score */}
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">
                        Score: <span className="font-bold text-blue-600">{answer.score || 0}/{answer.max_score || 10}</span>
                      </span>
                      <span className="text-gray-500">
                        Time: {answer.elapsed_seconds || 0}s
                      </span>
                    </div>

                    {/* Feedback */}
                    {answer.feedback && (
                      <div className="mt-1.5 p-1.5 bg-blue-50 border border-blue-100 rounded text-xs">
                        <p className="text-blue-900">
                          <span className="font-semibold">Feedback:</span> {answer.feedback}
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
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
        <div className="flex items-center justify-center">
          <Loader2 className="w-6 h-6 text-purple-600 animate-spin" />
          <span className="ml-3 text-gray-600 text-sm">Loading interview history...</span>
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
              onClick={fetchInterviewHistory}
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
  if (interviews.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl shadow-sm p-6 mb-6 text-center border border-purple-100"
      >
        <div className="flex flex-col items-center">
          <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-3 shadow-lg">
            <History className="w-7 h-7 text-white" />
          </div>
          <h3 className="text-base font-semibold text-gray-900 mb-2">
            No Interview History
          </h3>
          <p className="text-sm text-gray-600 max-w-md">
            You haven't completed any interviews yet. Your interview history will appear here.
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="mb-6">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-800 flex items-center">
          <History className="mr-2 h-5 w-5 text-purple-500" />
          Interview History ({interviews.length})
        </h2>
      </div>

      {/* Interview History Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

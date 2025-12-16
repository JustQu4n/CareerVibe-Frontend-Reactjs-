import React from 'react';
import { motion } from 'framer-motion';
import { 
  Clock, 
  Calendar, 
  Play, 
  CheckCircle, 
  AlertCircle,
  FileText,
  Building2,
  Briefcase
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * InterviewCard Component
 * Hiển thị thông tin interview với button actions phù hợp
 */
const InterviewCard = ({ application }) => {
  const navigate = useNavigate();
  const { jobPost, interview, candidateInterview } = application;

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

  // Calculate time remaining
  const getTimeRemaining = (deadline) => {
    if (!deadline) return null;
    const now = new Date();
    const end = new Date(deadline);
    const diff = end - now;
    
    if (diff <= 0) return 'Đã hết hạn';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `Còn ${days} ngày`;
    return `Còn ${hours} giờ`;
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const statusConfig = {
      assigned: { label: 'Chưa bắt đầu', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
      in_progress: { label: 'Đang làm', color: 'bg-blue-100 text-blue-700 border-blue-200' },
      submitted: { label: 'Đã nộp', color: 'bg-green-100 text-green-700 border-green-200' },
      completed: { label: 'Hoàn thành', color: 'bg-green-100 text-green-700 border-green-200' },
      expired: { label: 'Hết hạn', color: 'bg-red-100 text-red-700 border-red-200' },
    };

    const config = statusConfig[status] || statusConfig.assigned;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${config.color}`}>
        {config.label}
      </span>
    );
  };

  // Handle start interview
  const handleStartInterview = () => {
    // Navigate to interview page
    navigate(`/interview/${application.application_id}`);
  };

  // Check if interview is not started yet
  const isNotStarted = !candidateInterview;
  const isInProgress = candidateInterview?.status === 'in_progress';
  const isCompleted = candidateInterview?.status === 'submitted' || candidateInterview?.status === 'completed';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all overflow-hidden"
    >
      {/* Header with company info */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b border-gray-100">
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
          {candidateInterview && getStatusBadge(candidateInterview.status)}
        </div>
      </div>

      {/* Interview Details */}
      <div className="p-4 space-y-3">
        {/* Interview Title */}
        <div className="flex items-start gap-2">
          <FileText className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-gray-700">Bài phỏng vấn</p>
            <p className="text-base font-semibold text-gray-900">{interview?.title || 'N/A'}</p>
          </div>
        </div>

        {/* Interview Description */}
        {interview?.description && (
          <p className="text-sm text-gray-600 line-clamp-2">{interview.description}</p>
        )}

        {/* Time info */}
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center text-gray-600">
            <Clock className="w-4 h-4 mr-1" />
            <span>{interview?.total_time_minutes || 0} phút</span>
          </div>
          
          {interview?.deadline && (
            <div className="flex items-center text-gray-600">
              <Calendar className="w-4 h-4 mr-1" />
              <span className="font-medium">{getTimeRemaining(interview.deadline)}</span>
            </div>
          )}
        </div>

        {/* Deadline info */}
        {interview?.deadline && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <p className="text-xs text-amber-700">
              <strong>Hạn nộp:</strong> {formatDate(interview.deadline)}
            </p>
          </div>
        )}

        {/* Candidate Interview Info (if started) */}
        {candidateInterview && (
          <div className="border-t pt-3 mt-3 space-y-2">
            {candidateInterview.assigned_at && (
              <div className="flex justify-between text-xs text-gray-600">
                <span>Được giao:</span>
                <span className="font-medium">{formatDate(candidateInterview.assigned_at)}</span>
              </div>
            )}
            {candidateInterview.started_at && (
              <div className="flex justify-between text-xs text-gray-600">
                <span>Bắt đầu:</span>
                <span className="font-medium">{formatDate(candidateInterview.started_at)}</span>
              </div>
            )}
            {candidateInterview.completed_at && (
              <div className="flex justify-between text-xs text-gray-600">
                <span>Hoàn thành:</span>
                <span className="font-medium">{formatDate(candidateInterview.completed_at)}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action Button */}
      <div className="p-4 bg-gray-50 border-t border-gray-100">
        {isNotStarted ? (
          <button
            onClick={handleStartInterview}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all font-semibold"
          >
            <Play className="w-5 h-5" />
            Bắt đầu ngay
          </button>
        ) : isInProgress ? (
          <button
            onClick={handleStartInterview}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:shadow-lg hover:from-green-700 hover:to-emerald-700 transition-all font-semibold"
          >
            <Play className="w-5 h-5" />
            Tiếp tục làm bài
          </button>
        ) : isCompleted ? (
          <div className="flex items-center justify-center gap-2 px-4 py-3 bg-green-100 text-green-700 rounded-lg border border-green-200">
            <CheckCircle className="w-5 h-5" />
            <span className="font-semibold">Đã hoàn thành</span>
          </div>
        ) : (
          <button
            onClick={handleStartInterview}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all font-semibold"
          >
            Xem chi tiết
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default React.memo(InterviewCard);

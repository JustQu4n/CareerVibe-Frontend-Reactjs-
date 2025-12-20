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
  Briefcase,
  Mail
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * InterviewCard Component
 * Hiển thị thông tin interview với button actions phù hợp
 */
const InterviewCard = ({ application }) => {
  const navigate = useNavigate();
  const { jobPost, interview, candidateInterview } = application;
  
  // Check if this is a direct invitation (no jobPost)
  const isDirectInvitation = !jobPost || application.isDirectInvitation;

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
    
    if (diff <= 0) return 'Expired';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days} days left`;
    return `${hours} hours left`;
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const statusConfig = {
      assigned: { label: 'Not Started', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
      in_progress: { label: 'In Progress', color: 'bg-blue-100 text-blue-700 border-blue-200' },
      submitted: { label: 'Submitted', color: 'bg-green-100 text-green-700 border-green-200' },
      completed: { label: 'Completed', color: 'bg-green-100 text-green-700 border-green-200' },
      expired: { label: 'Expired', color: 'bg-red-100 text-red-700 border-red-200' },
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
      whileHover={{ y: -4, shadow: "0 10px 20px -5px rgb(0 0 0 / 0.1)" }}
      className="bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg transition-all overflow-hidden group"
    >
      
      {/* Header with company info */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 border-b border-gray-100">
        <div className="flex items-start justify-between mb-1">
          <div className="flex-1">
            {isDirectInvitation ? (
              <>
                <div className="flex items-center gap-1 mb-1.5">
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium border bg-purple-100 text-purple-700 border-purple-200 flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    Direct Invite
                  </span>
                </div>
                <h3 className="text-sm font-bold text-gray-900 mb-1 line-clamp-1">
                  {interview?.title || 'Interview'}
                </h3>
                <div className="flex items-center text-xs text-gray-600">
                  <Mail className="w-3 h-3 mr-1" />
                  <span>Email invitation</span>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-sm font-bold text-gray-900 mb-1 line-clamp-1">
                  {jobPost?.title || 'N/A'}
                </h3>
                <div className="flex items-center text-xs text-gray-600">
                  <Building2 className="w-3 h-3 mr-1" />
                  <span className="truncate">{jobPost?.company?.company_name || 'N/A'}</span>
                </div>
              </>
            )}
          </div>
          {candidateInterview && getStatusBadge(candidateInterview.status)}
        </div>
      </div>

      {/* Interview Details */}
      <div className="p-3 space-y-2">
        {/* Interview Title (only show if not direct invitation) */}
        {!isDirectInvitation && (
          <div className="flex items-start gap-2">
            <FileText className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs font-medium text-gray-600">Interview</p>
              <p className="text-sm font-semibold text-gray-900 line-clamp-1">{interview?.title || 'N/A'}</p>
            </div>
          </div>
        )}

        {/* Interview Description */}
        {interview?.description && (
          <p className="text-xs text-gray-600 line-clamp-2">{interview.description}</p>
        )}

        {/* Time info */}
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center text-gray-600">
            <Clock className="w-3.5 h-3.5 mr-1" />
            <span>{interview?.total_time_minutes || 0} min</span>
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
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-2">
            <p className="text-xs text-amber-700">
              <strong>Deadline:</strong> {formatDate(interview.deadline)}
            </p>
          </div>
        )}

        {/* Candidate Interview Info (if started) */}
        {candidateInterview && (
          <div className="border-t pt-2 mt-2 space-y-1">
            {candidateInterview.assigned_at && (
              <div className="flex justify-between text-xs text-gray-600">
                <span>Assigned:</span>
                <span className="font-medium">{formatDate(candidateInterview.assigned_at)}</span>
              </div>
            )}
            {candidateInterview.started_at && (
              <div className="flex justify-between text-xs text-gray-600">
                <span>Started:</span>
                <span className="font-medium">{formatDate(candidateInterview.started_at)}</span>
              </div>
            )}
            {candidateInterview.completed_at && (
              <div className="flex justify-between text-xs text-gray-600">
                <span>Completed:</span>
                <span className="font-medium">{formatDate(candidateInterview.completed_at)}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action Button */}
      <div className="p-3 bg-gray-50 border-t border-gray-100">
        {isNotStarted ? (
          <button
            onClick={handleStartInterview}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all font-semibold text-sm"
          >
            <Play className="w-4 h-4" />
            Start Now
          </button>
        ) : isInProgress ? (
          <button
            onClick={handleStartInterview}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:shadow-lg hover:from-green-700 hover:to-emerald-700 transition-all font-semibold text-sm"
          >
            <Play className="w-4 h-4" />
            Continue
          </button>
        ) : isCompleted ? (
          <div className="flex items-center justify-center gap-2 px-3 py-2 bg-green-100 text-green-700 rounded-lg border border-green-200">
            <CheckCircle className="w-4 h-4" />
            <span className="font-semibold text-sm">Completed</span>
          </div>
        ) : (
          <button
            onClick={handleStartInterview}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all font-semibold text-sm"
          >
            View Details
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default React.memo(InterviewCard);

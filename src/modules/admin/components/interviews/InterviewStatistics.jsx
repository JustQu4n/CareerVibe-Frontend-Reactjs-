/**
 * InterviewStatistics Component
 * Hiển thị thống kê kết quả interview
 */
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  Users,
  CheckCircle,
  Clock,
  AlertCircle,
  TrendingUp,
  Award,
  Calendar,
  Mail
} from 'lucide-react';
import { toast } from 'react-toastify';
import employerInterviewService from '@/services/employerInterviewService';

export default function InterviewStatistics({ interview }) {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStatistics();
  }, [interview]);

  const loadStatistics = async () => {
    try {
      setLoading(true);
      const data = await employerInterviewService.getInterviewStatistics(interview.interview_id);
      setStatistics(data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!statistics) {
    return (
      <div className="text-center py-12">
        <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">No statistics available</p>
      </div>
    );
  }

  const stats = [
    {
      label: 'Total Candidates',
      value: statistics.total || 0,
      icon: Users,
      color: 'bg-blue-100 text-blue-700',
      iconColor: 'text-blue-600'
    },
    {
      label: 'Assigned',
      value: statistics.assigned || 0,
      icon: Clock,
      color: 'bg-yellow-100 text-yellow-700',
      iconColor: 'text-yellow-600'
    },
    {
      label: 'In Progress',
      value: statistics.in_progress || 0,
      icon: TrendingUp,
      color: 'bg-purple-100 text-purple-700',
      iconColor: 'text-purple-600'
    },
    {
      label: 'Completed',
      value: statistics.submitted || 0,
      icon: CheckCircle,
      color: 'bg-green-100 text-green-700',
      iconColor: 'text-green-600'
    },
    {
      label: 'Timeout',
      value: statistics.timeout || 0,
      icon: AlertCircle,
      color: 'bg-red-100 text-red-700',
      iconColor: 'text-red-600'
    },
    {
      label: 'Average Score',
      value: statistics.average_score ? `${statistics.average_score.toFixed(1)}%` : 'N/A',
      icon: Award,
      color: 'bg-indigo-100 text-indigo-700',
      iconColor: 'text-indigo-600'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Statistics Cards - Compact Version */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-lg shadow-sm border border-gray-100 p-3 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className={`p-1.5 rounded-lg ${stat.color}`}>
                  <Icon className={`h-4 w-4 ${stat.iconColor}`} />
                </div>
                <h3 className="text-[10px] font-medium text-gray-600 uppercase tracking-wide">{stat.label}</h3>
              </div>
              <p className="text-xl font-bold text-gray-900">{stat.value}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Candidates Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-bold text-gray-900">Candidate Results</h2>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Candidate
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Score
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Result
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {statistics.candidates && statistics.candidates.length > 0 ? (
                statistics.candidates.map((candidate) => (
                  <tr key={candidate.candidate_interview_id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {candidate.candidate_avatar_url ? (
                          <img
                            src={candidate.candidate_avatar_url}
                            alt={candidate.candidate_name}
                            className="h-10 w-10 rounded-full object-cover ring-2 ring-gray-100"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(candidate.candidate_name || 'User')}&background=random`;
                            }}
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold ring-2 ring-gray-100">
                            {candidate.candidate_name?.charAt(0)?.toUpperCase() || 'C'}
                          </div>
                        )}
                        <div className="ml-3">
                          <div className="text-sm font-semibold text-gray-900">
                            {candidate.candidate_name || 'Unknown'}
                          </div>
                          {candidate.candidate_email && (
                            <div className="text-xs text-gray-500 flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {candidate.candidate_email}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <StatusBadge status={candidate.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="text-sm font-bold text-gray-900">
                        {candidate.total_score !== null ? (
                          <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-blue-50 text-blue-700">
                            {candidate.total_score}%
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <ResultStatusBadge score={candidate.total_score} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {(candidate.total_score !== null && candidate.total_score >= 25) ? (
                        <button
                          onClick={() => handleSendEmail(candidate)}
                          className="inline-flex items-center justify-center p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors"
                          title="Send email to candidate"
                        >
                          <Mail className="h-4 w-4" />
                        </button>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm text-gray-500 font-medium">No candidates have taken this interview yet</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // Handler for sending email (to be implemented)
  function handleSendEmail(candidate) {
    toast.info(`Email feature for ${candidate.candidate_name} - Coming soon!`);
    // TODO: Implement email sending functionality
  }
}

function StatusBadge({ status }) {
  const badges = {
    assigned: { color: 'bg-yellow-100 text-yellow-700', label: 'Assigned' },
    in_progress: { color: 'bg-purple-100 text-purple-700', label: 'In Progress' },
    submitted: { color: 'bg-green-100 text-green-700', label: 'Completed' },
    timeout: { color: 'bg-red-100 text-red-700', label: 'Timeout' },
  };

  const badge = badges[status] || { color: 'bg-gray-100 text-gray-700', label: status };

  return (
    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${badge.color}`}>
      {badge.label}
    </span>
  );
}

function ResultStatusBadge({ score }) {
  if (score === null || score === undefined) {
    return (
      <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
        N/A
      </span>
    );
  }

  let status, color, label;
  
  if (score >= 40 && score <= 50) {
    status = 'pass';
    label = 'Pass';
    color = 'bg-green-100 text-green-700';
  } else if (score >= 25 && score <= 39) {
    status = 'pass';
    label = 'Pass';
    color = 'bg-blue-100 text-blue-700';
  } else {
    status = 'fail';
    label = 'Fail';
    color = 'bg-red-100 text-red-700';
  }

  return (
    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${color}`}>
      {label}
    </span>
  );
}

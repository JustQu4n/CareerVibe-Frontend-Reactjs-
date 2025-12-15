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
  Calendar
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
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.color}`}>
                  <Icon className={`h-6 w-6 ${stat.iconColor}`} />
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">{stat.label}</h3>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Candidates Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Candidate Results</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Candidate
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Assigned At
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Completed At
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {statistics.candidates && statistics.candidates.length > 0 ? (
                statistics.candidates.map((candidate) => (
                  <tr key={candidate.candidate_interview_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {candidate.candidate_avatar_url ? (
                          <img
                            src={candidate.candidate_avatar_url}
                            alt={candidate.candidate_name}
                            className="h-10 w-10 rounded-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(candidate.candidate_name || 'User')}&background=random`;
                            }}
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold">
                            {candidate.candidate_name?.charAt(0)?.toUpperCase() || 'C'}
                          </div>
                        )}
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {candidate.candidate_name || 'Unknown'}
                          </div>
                          {candidate.candidate_email && (
                            <div className="text-xs text-gray-500">
                              {candidate.candidate_email}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={candidate.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900">
                        {candidate.total_score !== null ? `${candidate.total_score}%` : '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {candidate.assigned_at ? new Date(candidate.assigned_at).toLocaleString() : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {candidate.completed_at ? new Date(candidate.completed_at).toLocaleString() : '-'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    No candidates have taken this interview yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
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

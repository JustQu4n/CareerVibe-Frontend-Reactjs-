/**
 * InterviewAssignments Component
 * Assign interviews to candidates and manage assignments
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Users,
  Search,
  CheckCircle,
  Clock,
  XCircle,
  Award,
  Calendar,
  Eye,
  UserPlus,
  Mail,
  Briefcase
} from 'lucide-react';
import { toast } from 'sonner';
import interviewService from '../../services/interviewService';

export default function InterviewAssignments({ selectedInterview }) {
  const [assignments, setAssignments] = useState([]);
  const [candidateDetails, setCandidateDetails] = useState({});
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [applicationId, setApplicationId] = useState('');
  const [candidateId, setCandidateId] = useState('');

  useEffect(() => {
    if (selectedInterview) {
      fetchAssignments();
    }
  }, [selectedInterview]);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const data = await interviewService.getCandidates(selectedInterview.interview_id);
      console.log('=== ASSIGNMENTS DATA ===', data);
      const assignmentList = Array.isArray(data) ? data : data.candidates || [];
      setAssignments(assignmentList);

      // Build a mapping of candidate details if returned by API
      const detailsMap = {};
      assignmentList.forEach((a) => {
        if (a.candidate) {
          detailsMap[a.candidate_id] = a.candidate;
        }
      });
      setCandidateDetails(detailsMap);
    } catch (error) {
      console.error('Error fetching assignments:', error);
      toast.error('Failed to load candidate assignments');
      setAssignments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    
    if (!applicationId.trim()) {
      toast.error('Application ID is required');
      return;
    }

    try {
      const payload = {
        application_id: applicationId,
        candidate_id: candidateId || undefined
      };

      const newAssignment = await interviewService.assignInterview(selectedInterview.interview_id, payload);
      setAssignments([newAssignment, ...assignments]);
      setShowAssignModal(false);
      setApplicationId('');
      setCandidateId('');
      toast.success('Interview assigned to candidate successfully');
    } catch (error) {
      console.error('Error assigning interview:', error);
      toast.error(error.response?.data?.message || 'Failed to assign interview');
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      pending: { label: 'Pending', color: 'yellow', bgColor: 'bg-yellow-100', textColor: 'text-yellow-700', icon: Clock },
      in_progress: { label: 'In Progress', color: 'blue', bgColor: 'bg-blue-100', textColor: 'text-blue-700', icon: Clock },
      completed: { label: 'Completed', color: 'green', bgColor: 'bg-green-100', textColor: 'text-green-700', icon: CheckCircle },
      graded: { label: 'Graded', color: 'purple', bgColor: 'bg-purple-100', textColor: 'text-purple-700', icon: Award },
      failed: { label: 'Failed', color: 'red', bgColor: 'bg-red-100', textColor: 'text-red-700', icon: XCircle }
    };
    return configs[status] || configs.pending;
  };

  const getResultBadge = (result) => {
    if (!result) return null;
    
    const configs = {
      pass: { label: 'Pass', color: 'green' },
      fail: { label: 'Fail', color: 'red' },
      pending: { label: 'Pending', color: 'gray' }
    };
    
    const config = configs[result] || configs.pending;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium bg-${config.color}-100 text-${config.color}-700`}>
        {config.label}
      </span>
    );
  };

  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch = 
      assignment.candidate_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assignment.application_id?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || assignment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (!selectedInterview) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Interview Selected</h3>
        <p className="text-gray-600">Please select an interview session to manage assignments</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Actions Bar */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by candidate or application ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center gap-3">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="graded">Graded</option>
              <option value="failed">Failed</option>
            </select>

            {/* Assign Button */}
            <button
              onClick={() => setShowAssignModal(true)}
              className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-blue-500/30 transition-all flex items-center gap-2"
            >
              <UserPlus className="h-5 w-5" />
              Assign Interview
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-600 mb-1">Total Assigned</p>
            <p className="text-2xl font-bold text-gray-900">{assignments.length}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-3">
            <p className="text-xs text-green-600 mb-1">Completed</p>
            <p className="text-2xl font-bold text-green-700">
              {assignments.filter(a => a.status === 'completed').length}
            </p>
          </div>
          <div className="bg-blue-50 rounded-lg p-3">
            <p className="text-xs text-blue-600 mb-1">In Progress</p>
            <p className="text-2xl font-bold text-blue-700">
              {assignments.filter(a => a.status === 'in_progress').length}
            </p>
          </div>
          <div className="bg-yellow-50 rounded-lg p-3">
            <p className="text-xs text-yellow-600 mb-1">Pending</p>
            <p className="text-2xl font-bold text-yellow-700">
              {assignments.filter(a => a.status === 'pending').length}
            </p>
          </div>
        </div>
      </div>

      {/* Assignments Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading assignments...</p>
          </div>
        ) : filteredAssignments.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No assignments yet</h3>
            <p className="text-gray-600 mb-6">Assign this interview to candidates to begin assessments</p>
            <button
              onClick={() => setShowAssignModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-blue-500/30 transition-all inline-flex items-center gap-2"
            >
              <UserPlus className="h-5 w-5" />
              Assign Interview
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Candidate
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Score
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Result
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Assigned Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredAssignments.map((assignment) => {
                  const statusConfig = getStatusConfig(assignment.status);
                  const StatusIcon = statusConfig.icon;

                  return (
                    <motion.tr
                      key={assignment.candidate_interview_id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {assignment.candidate?.avatar_url ? (
                            <img
                              src={assignment.candidate.avatar_url}
                              alt={assignment.candidate?.full_name || 'Candidate'}
                              className="h-10 w-10 rounded-full object-cover flex-shrink-0 border-2 border-white shadow-sm"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                              <span className="text-white font-semibold text-sm">
                                {assignment.candidate?.full_name?.charAt(0).toUpperCase() || assignment.candidate_id?.charAt(0).toUpperCase() || 'C'}
                              </span>
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-gray-900">
                              {assignment.candidate?.full_name || assignment.candidate_id || 'Unknown Candidate'}
                            </p>
                            <p className="text-xs text-gray-500">
                              {assignment.candidate?.email ? assignment.candidate.email : `App: ${assignment.application_id?.substring(0,8)}...`}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${statusConfig.bgColor} ${statusConfig.textColor}`}>
                          <StatusIcon className="h-3.5 w-3.5" />
                          {statusConfig.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {assignment.total_score !== null && assignment.total_score !== undefined ? (
                            <>
                              <Award className="h-4 w-4 text-amber-500" />
                              <span className="font-semibold text-gray-900">
                                {assignment.total_score}
                              </span>
                            </>
                          ) : (
                            <span className="text-gray-400 text-sm">Not graded</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {getResultBadge(assignment.result)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-sm text-gray-600">
                          <Calendar className="h-4 w-4" />
                          {new Date(assignment.assigned_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          className="px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-1"
                        >
                          <Eye className="h-4 w-4" />
                          View Details
                        </button>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Assign Modal */}
      <AnimatePresence>
        {showAssignModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowAssignModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full"
            >
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">Assign Interview</h2>
                <p className="text-sm text-gray-600 mt-1">Assign this interview to a candidate</p>
              </div>

              <form onSubmit={handleAssign} className="p-6 space-y-6">
                {/* Application ID */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Application ID <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      required
                      value={applicationId}
                      onChange={(e) => setApplicationId(e.target.value)}
                      placeholder="Enter application ID"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    The application ID of the candidate you want to interview
                  </p>
                </div>

                {/* Candidate ID (Optional) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Candidate ID (Optional)
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={candidateId}
                      onChange={(e) => setCandidateId(e.target.value)}
                      placeholder="Leave empty to use application's candidate"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    If omitted, the backend will use the candidate from the application
                  </p>
                </div>

                {/* Info Box */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-900 mb-1">Notification</p>
                      <p className="text-xs text-blue-700">
                        The candidate will be notified via email about the interview assignment
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAssignModal(false)}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-blue-500/30 transition-all"
                  >
                    Assign Interview
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

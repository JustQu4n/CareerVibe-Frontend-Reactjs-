/**
 * InterviewAssignments Component - Refactored
 * Gán interview cho candidates và quản lý assignments
 */
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Plus,
  UserCheck,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Calendar,
  Search,
  Trash2,
  Eye
} from 'lucide-react';
import { toast } from 'react-toastify';
import employerInterviewService from '@/services/employerInterviewService';

export default function InterviewAssignments({ interview }) {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadCandidates();
  }, [interview]);

  const loadCandidates = async () => {
    try {
      setLoading(true);
      const data = await employerInterviewService.getCandidates(interview.interview_id);
      setCandidates(data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredCandidates = candidates.filter(item =>
    item.candidate?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.candidate?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.status?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusStats = () => {
    return {
      total: candidates.length,
      assigned: candidates.filter(c => c.status === 'assigned').length,
      in_progress: candidates.filter(c => c.status === 'in_progress').length,
      submitted: candidates.filter(c => c.status === 'submitted').length,
      timeout: candidates.filter(c => c.status === 'timeout').length,
    };
  };

  const stats = getStatusStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Interview Assignments</h2>
          <p className="text-sm text-gray-600 mt-1">
            Manage candidate assignments for: <span className="font-semibold">{interview.title}</span>
          </p>
        </div>
        <button
          onClick={() => setShowAssignModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/30 transition-all"
        >
          <Plus className="h-5 w-5" />
          Assign Candidate
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <StatCard
          label="Total"
          value={stats.total}
          icon={Users}
          color="bg-blue-100 text-blue-700"
        />
        <StatCard
          label="Assigned"
          value={stats.assigned}
          icon={Clock}
          color="bg-yellow-100 text-yellow-700"
        />
        <StatCard
          label="In Progress"
          value={stats.in_progress}
          icon={AlertCircle}
          color="bg-purple-100 text-purple-700"
        />
        <StatCard
          label="Completed"
          value={stats.submitted}
          icon={CheckCircle}
          color="bg-green-100 text-green-700"
        />
        <StatCard
          label="Timeout"
          value={stats.timeout}
          icon={XCircle}
          color="bg-red-100 text-red-700"
        />
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search candidates..."
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Candidates List */}
      {filteredCandidates.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {searchTerm ? 'No candidates found' : 'No assignments yet'}
          </h3>
          <p className="text-gray-600 mb-6">
            {searchTerm ? 'Try adjusting your search' : 'Assign candidates to this interview to get started'}
          </p>
          {!searchTerm && (
            <button
              onClick={() => setShowAssignModal(true)}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors"
            >
              Assign First Candidate
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
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
                    Assigned At
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Started At
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Completed At
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredCandidates.map((candidate) => (
                  <CandidateRow
                    key={candidate.candidate_interview_id}
                    candidate={candidate}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Assign Modal */}
      <AssignModal
        isOpen={showAssignModal}
        interview={interview}
        onClose={() => setShowAssignModal(false)}
        onSuccess={() => {
          loadCandidates();
          setShowAssignModal(false);
        }}
      />
    </div>
  );
}

// ========================================
// Stat Card Component
// ========================================
function StatCard({ label, value, icon: Icon, color }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-4"
    >
      <div className="flex items-center justify-between mb-2">
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <h3 className="text-sm font-medium text-gray-600">{label}</h3>
      <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
    </motion.div>
  );
}

// ========================================
// Candidate Row Component
// ========================================
function CandidateRow({ candidate }) {
  const getStatusBadge = (status) => {
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
  };

  // Extract candidate info from nested object
  const candidateInfo = candidate.candidate || {};
  const { full_name, email, phone, avatar_url } = candidateInfo;

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          {/* Avatar */}
          {avatar_url ? (
            <img
              src={avatar_url}
              alt={full_name}
              className="h-10 w-10 rounded-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(full_name || 'User')}&background=random`;
              }}
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold">
              {full_name?.charAt(0)?.toUpperCase() || 'C'}
            </div>
          )}
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">
              {full_name || 'Unknown Candidate'}
            </div>
            <div className="text-xs text-gray-500">
              {email || 'No email'}
            </div>
            {phone && (
              <div className="text-xs text-gray-400">
                {phone}
              </div>
            )}
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {getStatusBadge(candidate.status)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
        {candidate.assigned_at ? (
          <>
            <Calendar className="h-3 w-3 inline mr-1" />
            {new Date(candidate.assigned_at).toLocaleDateString()}
          </>
        ) : '-'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
        {candidate.started_at ? (
          <>
            <Clock className="h-3 w-3 inline mr-1" />
            {new Date(candidate.started_at).toLocaleDateString()}
          </>
        ) : '-'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
        {candidate.completed_at ? (
          <>
            <CheckCircle className="h-3 w-3 inline mr-1" />
            {new Date(candidate.completed_at).toLocaleDateString()}
          </>
        ) : '-'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {candidate.total_score !== null ? (
          <span className="text-sm font-bold text-gray-900">
            {candidate.total_score}%
          </span>
        ) : (
          <span className="text-sm text-gray-400">-</span>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <button
          className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors"
          title="View Details"
        >
          <Eye className="h-4 w-4" />
        </button>
      </td>
    </tr>
  );
}

// ========================================
// Assign Modal Component
// ========================================
function AssignModal({ isOpen, interview, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    application_id: '',
    candidate_id: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.application_id) {
      toast.error('Application ID is required');
      return;
    }

    try {
      setLoading(true);
      await employerInterviewService.assignInterview(interview.interview_id, {
        application_id: formData.application_id,
        candidate_id: formData.candidate_id || undefined,
      });
      toast.success('Interview assigned successfully');
      setFormData({ application_id: '', candidate_id: '' });
      onSuccess();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full"
      >
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Assign Interview</h2>
          <p className="text-sm text-gray-600 mt-1">
            Assign <span className="font-semibold">{interview.title}</span> to a candidate
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Application ID *
            </label>
            <input
              type="text"
              required
              value={formData.application_id}
              onChange={(e) => setFormData({ ...formData, application_id: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter application ID (UUID)"
            />
            <p className="text-xs text-gray-500 mt-1">
              The UUID of the job application
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Candidate ID (Optional)
            </label>
            <input
              type="text"
              value={formData.candidate_id}
              onChange={(e) => setFormData({ ...formData, candidate_id: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Auto-filled from application if empty"
            />
            <p className="text-xs text-gray-500 mt-1">
              Leave empty to auto-fill from application
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold mb-1">Note:</p>
                <p>The candidate will be notified and can access the interview from their dashboard.</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Assigning...' : 'Assign Interview'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-xl transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

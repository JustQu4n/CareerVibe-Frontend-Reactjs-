/**
 * InterviewManagement Component - Refactored
 * Main component quản lý interviews với đầy đủ CRUD operations
 */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Video,
  Plus,
  FileQuestion,
  Users,
  MessageSquare,
  BarChart3,
  Edit,
  Trash2,
  Eye,
  Link as LinkIcon,
  Unlink,
  Search,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { toast } from 'react-toastify';
import employerInterviewService from '@/services/employerInterviewService';
import { jobPostService } from '@/services/jobPostService';
import InterviewQuestions from './InterviewQuestions';
import InterviewAssignments from './InterviewAssignments';
import InterviewAnswers from './InterviewAnswers';
import InterviewStatistics from './InterviewStatistics';

export default function InterviewManagement() {
  // ========================================
  // State Management
  // ========================================
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [activeTab, setActiveTab] = useState('list'); // list | questions | assignments | answers | statistics
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingInterview, setEditingInterview] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAttachModal, setShowAttachModal] = useState(false);
  const [attachingInterview, setAttachingInterview] = useState(null);

  // ========================================
  // Load Interviews
  // ========================================
  useEffect(() => {
    loadInterviews();
  }, []);

  const loadInterviews = async () => {
    try {
      setLoading(true);
      const data = await employerInterviewService.getInterviews();
      setInterviews(data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // CRUD Operations
  // ========================================
  const handleDelete = async (interviewId) => {
    if (!window.confirm('Are you sure you want to delete this interview?')) return;

    try {
      await employerInterviewService.deleteInterview(interviewId);
      toast.success('Interview deleted successfully');
      loadInterviews();
      if (selectedInterview?.interview_id === interviewId) {
        setSelectedInterview(null);
        setActiveTab('list');
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleEdit = (interview) => {
    setEditingInterview(interview);
    setShowEditModal(true);
  };

  const handleViewDetails = async (interview) => {
    try {
      const details = await employerInterviewService.getInterviewDetail(interview.interview_id);
      setSelectedInterview(details.interview);
      setActiveTab('questions');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleAttachJobPost = (interview) => {
    setAttachingInterview(interview);
    setShowAttachModal(true);
  };

  const handleDetachJobPost = async (interview) => {
    if (!window.confirm('Are you sure you want to detach this interview from the job post?')) return;

    try {
      await employerInterviewService.detachInterviewFromJobPost(interview.interview_id);
      toast.success('Interview detached from job post successfully');
      loadInterviews();
    } catch (error) {
      toast.error(error.message);
    }
  };

  // ========================================
  // Filter Interviews
  // ========================================
  const filteredInterviews = interviews.filter(interview =>
    interview.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    interview.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ========================================
  // Get Status Badge
  // ========================================
  const getStatusBadge = (status) => {
    const badges = {
      draft: { color: 'bg-gray-100 text-gray-700', icon: AlertCircle },
      active: { color: 'bg-green-100 text-green-700', icon: CheckCircle },
      inactive: { color: 'bg-red-100 text-red-700', icon: XCircle },
    };

    const badge = badges[status] || badges.draft;
    const Icon = badge.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${badge.color}`}>
        <Icon className="h-3 w-3" />
        {status}
      </span>
    );
  };

  // ========================================
  // Render Tabs
  // ========================================
  if (activeTab !== 'list' && selectedInterview) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center gap-2 text-sm">
            <button
              onClick={() => {
                setActiveTab('list');
                setSelectedInterview(null);
              }}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Interviews
            </button>
            <span className="text-gray-400">/</span>
            <span className="text-gray-600">{selectedInterview.title}</span>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium capitalize">{activeTab}</span>
          </div>
        </div>

        {/* Tab Content */}
        <div className="max-w-7xl mx-auto px-6 py-6">
          {/* Sub Navigation */}
          <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
            {[
              { id: 'questions', label: 'Questions', icon: FileQuestion },
              { id: 'assignments', label: 'Assignments', icon: Users },
              { id: 'answers', label: 'Answers & Grading', icon: MessageSquare },
              { id: 'statistics', label: 'Statistics', icon: BarChart3 },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Render Active Component */}
          {activeTab === 'questions' && <InterviewQuestions interview={selectedInterview} />}
          {activeTab === 'assignments' && <InterviewAssignments interview={selectedInterview} />}
          {activeTab === 'answers' && <InterviewAnswers interview={selectedInterview} />}
          {activeTab === 'statistics' && <InterviewStatistics interview={selectedInterview} />}
        </div>
      </div>
    );
  }

  // ========================================
  // Main Interview List View
  // ========================================
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                <Video className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Interview Management</h1>
                <p className="text-sm text-gray-600 mt-1">
                  Create and manage interview templates
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/30 transition-all"
            >
              <Plus className="h-5 w-5" />
              Create Interview
            </button>
          </div>

          {/* Search */}
          <div className="mt-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search interviews..."
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Interview List */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredInterviews.length === 0 ? (
          <div className="text-center py-12">
            <Video className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Interviews Found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm ? 'Try adjusting your search' : 'Get started by creating your first interview'}
            </p>
            {!searchTerm && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors"
              >
                Create Interview
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInterviews.map((interview) => (
              <InterviewCard
                key={interview.interview_id}
                interview={interview}
                onDelete={handleDelete}
                onEdit={handleEdit}
                onViewDetails={handleViewDetails}
                onAttachJobPost={handleAttachJobPost}
                onDetachJobPost={handleDetachJobPost}
                getStatusBadge={getStatusBadge}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit Modals */}
      <CreateInterviewModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={() => {
          loadInterviews();
          setShowCreateModal(false);
        }}
      />

      <EditInterviewModal
        isOpen={showEditModal}
        interview={editingInterview}
        onClose={() => {
          setShowEditModal(false);
          setEditingInterview(null);
        }}
        onSuccess={() => {
          loadInterviews();
          setShowEditModal(false);
          setEditingInterview(null);
        }}
      />

      <AttachJobPostModal
        isOpen={showAttachModal}
        interview={attachingInterview}
        onClose={() => {
          setShowAttachModal(false);
          setAttachingInterview(null);
        }}
        onSuccess={() => {
          loadInterviews();
          setShowAttachModal(false);
          setAttachingInterview(null);
        }}
      />
    </div>
  );
}

// ========================================
// Interview Card Component
// ========================================
function InterviewCard({ interview, onDelete, onEdit, onViewDetails, onAttachJobPost, onDetachJobPost, getStatusBadge }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm hover:shadow-lg border border-gray-100 overflow-hidden transition-all h-full flex flex-col"
    >
      <div className="p-6 flex flex-col flex-1">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1" title={interview.title}>
              {interview.title}
            </h3>
            {getStatusBadge(interview.status)}
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2 min-h-[2.5rem]">
          {interview.description || 'No description'}
        </p>

        {/* Meta Info - Fixed height container */}
        <div className="space-y-2 mb-4 min-h-[4.5rem]">
          {interview.total_time_minutes && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{interview.total_time_minutes} minutes</span>
            </div>
          )}
          {interview.deadline && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">Deadline: {new Date(interview.deadline).toLocaleDateString()}</span>
            </div>
          )}
          {interview.job_post_id && (
            <div className="flex items-center gap-2 text-sm text-green-600">
              <LinkIcon className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">Linked to Job Post</span>
            </div>
          )}
        </div>

        {/* Actions - Push to bottom */}
        <div className="flex items-center gap-2 mt-auto pt-4 border-t border-gray-100">
          <button
            onClick={() => onViewDetails(interview)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors"
          >
            <Eye className="h-4 w-4" />
            View Details
          </button>
          <button
            onClick={() => onEdit(interview)}
            className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex-shrink-0"
            title="Edit"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(interview.interview_id)}
            className="p-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors flex-shrink-0"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
          {interview.job_post_id ? (
            <button
              onClick={() => onDetachJobPost(interview)}
              className="p-2 bg-orange-100 hover:bg-orange-200 text-orange-700 rounded-lg transition-colors flex-shrink-0"
              title="Detach from Job Post"
            >
              <Unlink className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={() => onAttachJobPost(interview)}
              className="p-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition-colors flex-shrink-0"
              title="Attach to Job Post"
            >
              <LinkIcon className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ========================================
// Create Interview Modal
// ========================================
function CreateInterviewModal({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'draft',
    total_time_minutes: '',
    deadline: '',
    job_post_id: '',
  });
  const [loading, setLoading] = useState(false);
  const [jobPosts, setJobPosts] = useState([]);

  useEffect(() => {
    if (isOpen) {
      loadJobPosts();
    }
  }, [isOpen]);

  const loadJobPosts = async () => {
    try {
      const data = await jobPostService.getJobPosts({ page: 1, limit: 100 });
      setJobPosts(data.job_posts || data.data || data);
    } catch (error) {
      console.error('Failed to load job posts:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const payload = {
        ...formData,
        total_time_minutes: formData.total_time_minutes ? parseInt(formData.total_time_minutes) : null,
      };
      // Remove job_post_id if empty
      if (!payload.job_post_id) {
        delete payload.job_post_id;
      }
      await employerInterviewService.createInterview(payload);
      toast.success('Interview created successfully');
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
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Create Interview</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Backend Developer Interview"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Describe the interview..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Total Time (minutes)
              </label>
              <input
                type="number"
                value={formData.total_time_minutes}
                onChange={(e) => setFormData({ ...formData, total_time_minutes: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="30"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Deadline
            </label>
            <input
              type="datetime-local"
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Job Post (Optional)
            </label>
            <select
              value={formData.job_post_id}
              onChange={(e) => setFormData({ ...formData, job_post_id: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">-- Select Job Post --</option>
              {jobPosts.map((job) => (
                <option key={job.job_post_id} value={job.job_post_id}>
                  {job.title}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Creating...' : 'Create Interview'}
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

// ========================================
// Edit Interview Modal (Similar structure)
// ========================================
function EditInterviewModal({ isOpen, interview, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'draft',
    total_time_minutes: '',
    deadline: '',
    job_post_id: '',
  });
  const [loading, setLoading] = useState(false);
  const [jobPosts, setJobPosts] = useState([]);

  useEffect(() => {
    if (isOpen) {
      loadJobPosts();
    }
  }, [isOpen]);

  const loadJobPosts = async () => {
    try {
      const data = await jobPostService.getJobPosts({ page: 1, limit: 100 });
      setJobPosts(data.job_posts || data.data || data);
    } catch (error) {
      console.error('Failed to load job posts:', error);
    }
  };

  useEffect(() => {
    if (interview) {
      setFormData({
        title: interview.title || '',
        description: interview.description || '',
        status: interview.status || 'draft',
        total_time_minutes: interview.total_time_minutes || '',
        deadline: interview.deadline ? interview.deadline.slice(0, 16) : '',
        job_post_id: interview.job_post_id || '',
      });
    }
  }, [interview]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const payload = {
        ...formData,
        total_time_minutes: formData.total_time_minutes ? parseInt(formData.total_time_minutes) : null,
      };
      // Remove job_post_id if empty
      if (!payload.job_post_id) {
        delete payload.job_post_id;
      }
      await employerInterviewService.updateInterview(interview.interview_id, payload);
      toast.success('Interview updated successfully');
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
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Edit Interview</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Same form fields as Create Modal */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Total Time (minutes)
              </label>
              <input
                type="number"
                value={formData.total_time_minutes}
                onChange={(e) => setFormData({ ...formData, total_time_minutes: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Deadline
            </label>
            <input
              type="datetime-local"
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Job Post (Optional)
            </label>
            <select
              value={formData.job_post_id}
              onChange={(e) => setFormData({ ...formData, job_post_id: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">-- Select Job Post --</option>
              {jobPosts.map((job) => (
                <option key={job.job_post_id} value={job.job_post_id}>
                  {job.title}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Updating...' : 'Update Interview'}
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

// ========================================
// Attach Job Post Modal
// ========================================
function AttachJobPostModal({ isOpen, interview, onClose, onSuccess }) {
  const [selectedJobPostId, setSelectedJobPostId] = useState('');
  const [loading, setLoading] = useState(false);
  const [jobPosts, setJobPosts] = useState([]);

  useEffect(() => {
    if (isOpen) {
      loadJobPosts();
      setSelectedJobPostId('');
    }
  }, [isOpen]);

  const loadJobPosts = async () => {
    try {
      const data = await jobPostService.getJobPosts({ page: 1, limit: 100 });
      setJobPosts(data.job_posts || data.data || data);
    } catch (error) {
      console.error('Failed to load job posts:', error);
      toast.error('Failed to load job posts');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedJobPostId) {
      toast.error('Please select a job post');
      return;
    }

    try {
      setLoading(true);
      await employerInterviewService.attachInterviewToJobPost(
        interview.interview_id,
        selectedJobPostId
      );
      toast.success('Interview attached to job post successfully');
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
        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full"
      >
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Attach to Job Post</h2>
          <p className="text-sm text-gray-600 mt-1">
            Link interview "{interview?.title}" to a job post
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Select Job Post *
            </label>
            <select
              value={selectedJobPostId}
              onChange={(e) => setSelectedJobPostId(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">-- Select Job Post --</option>
              {jobPosts.map((job) => (
                <option key={job.job_post_id} value={job.job_post_id}>
                  {job.title}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Candidates who apply to this job post will be assigned this interview
            </p>
          </div>

          <div className="flex items-center gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Attaching...' : 'Attach Interview'}
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

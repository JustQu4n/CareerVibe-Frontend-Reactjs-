/**
 * InterviewQuestions Component
 * Manage questions for interview sessions
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  FileQuestion,
  Edit2,
  Trash2,
  Clock,
  Award,
  Search,
  GripVertical
} from 'lucide-react';
import { toast } from 'sonner';
import interviewService from '../../services/interviewService';

export default function InterviewQuestions({ selectedInterview }) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [formData, setFormData] = useState({
    question_text: '',
    time_limit_seconds: '',
    max_score: ''
  });

  useEffect(() => {
    if (selectedInterview) {
      fetchQuestions();
    }
  }, [selectedInterview]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const data = await interviewService.getQuestions(selectedInterview.interview_id);
      setQuestions(Array.isArray(data) ? data : data.questions || []);
    } catch (error) {
      console.error('Error fetching questions:', error);
      toast.error('Failed to load questions');
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    
    if (!formData.question_text.trim()) {
      toast.error('Question text is required');
      return;
    }

    try {
      const payload = {
        question_text: formData.question_text,
        time_limit_seconds: formData.time_limit_seconds ? parseInt(formData.time_limit_seconds) : undefined,
        max_score: formData.max_score ? parseFloat(formData.max_score) : undefined
      };

      const newQuestion = await interviewService.createQuestion(selectedInterview.interview_id, payload);
      setQuestions([...questions, newQuestion]);
      setShowCreateModal(false);
      setFormData({ question_text: '', time_limit_seconds: '', max_score: '' });
      toast.success('Question created successfully');
    } catch (error) {
      console.error('Error creating question:', error);
      toast.error(error.response?.data?.message || 'Failed to create question');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    
    if (!selectedQuestion) return;

    try {
      const payload = {};
      if (formData.question_text) payload.question_text = formData.question_text;
      if (formData.time_limit_seconds !== '') payload.time_limit_seconds = parseInt(formData.time_limit_seconds) || null;
      if (formData.max_score !== '') payload.max_score = parseFloat(formData.max_score) || null;

      const updated = await interviewService.updateQuestion(
        selectedInterview.interview_id,
        selectedQuestion.question_id,
        payload
      );
      setQuestions(questions.map(q => q.question_id === selectedQuestion.question_id ? updated : q));
      setShowEditModal(false);
      setSelectedQuestion(null);
      setFormData({ question_text: '', time_limit_seconds: '', max_score: '' });
      toast.success('Question updated successfully');
    } catch (error) {
      console.error('Error updating question:', error);
      toast.error(error.response?.data?.message || 'Failed to update question');
    }
  };

  const handleDelete = async () => {
    if (!selectedQuestion) return;

    try {
      await interviewService.deleteQuestion(selectedInterview.interview_id, selectedQuestion.question_id);
      setQuestions(questions.filter(q => q.question_id !== selectedQuestion.question_id));
      setShowDeleteModal(false);
      setSelectedQuestion(null);
      toast.success('Question deleted successfully');
    } catch (error) {
      console.error('Error deleting question:', error);
      toast.error(error.response?.data?.message || 'Failed to delete question');
    }
  };

  const openEditModal = (question) => {
    setSelectedQuestion(question);
    setFormData({
      question_text: question.question_text,
      time_limit_seconds: question.time_limit_seconds || '',
      max_score: question.max_score || ''
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (question) => {
    setSelectedQuestion(question);
    setShowDeleteModal(true);
  };

  const formatTime = (seconds) => {
    if (!seconds) return 'No limit';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const filteredQuestions = questions.filter(q =>
    q.question_text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!selectedInterview) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <FileQuestion className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Interview Selected</h3>
        <p className="text-gray-600">Please select an interview session to manage questions</p>
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
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Create Button */}
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-blue-500/30 transition-all flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Add Question
          </button>
        </div>

        {/* Stats */}
        <div className="mt-4 flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <FileQuestion className="h-4 w-4 text-gray-500" />
            <span className="text-gray-600">Total Questions:</span>
            <span className="font-semibold text-gray-900">{questions.length}</span>
          </div>
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-gray-500" />
            <span className="text-gray-600">Total Points:</span>
            <span className="font-semibold text-gray-900">
              {questions.reduce((sum, q) => sum + (q.max_score || 0), 0)}
            </span>
          </div>
        </div>
      </div>

      {/* Questions List */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : filteredQuestions.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <FileQuestion className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No questions yet</h3>
          <p className="text-gray-600 mb-6">Add your first question to this interview session</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-blue-500/30 transition-all inline-flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Add Question
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredQuestions.map((question, index) => (
            <motion.div
              key={question.question_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all group"
            >
              <div className="p-6">
                <div className="flex items-start gap-4">
                  {/* Drag Handle */}
                  <div className="flex-shrink-0 pt-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-move">
                    <GripVertical className="h-5 w-5 text-gray-400" />
                  </div>

                  {/* Question Number */}
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                      <span className="text-white font-bold text-sm">Q{index + 1}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-900 font-medium mb-3 leading-relaxed">
                      {question.question_text}
                    </p>

                    {/* Meta */}
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      {question.time_limit_seconds && (
                        <div className="flex items-center gap-1.5 text-gray-600">
                          <Clock className="h-4 w-4 text-blue-500" />
                          <span>{formatTime(question.time_limit_seconds)}</span>
                        </div>
                      )}
                      {question.max_score && (
                        <div className="flex items-center gap-1.5 text-gray-600">
                          <Award className="h-4 w-4 text-amber-500" />
                          <span>{question.max_score} points</span>
                        </div>
                      )}
                      <div className="text-xs text-gray-500">
                        Created {new Date(question.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex-shrink-0 flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(question)}
                      className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => openDeleteModal(question)}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">Add Question</h2>
                <p className="text-sm text-gray-600 mt-1">Create a new question for this interview</p>
              </div>

              <form onSubmit={handleCreate} className="p-6 space-y-6">
                {/* Question Text */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Question <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    value={formData.question_text}
                    onChange={(e) => setFormData({ ...formData, question_text: e.target.value })}
                    placeholder="Enter the interview question..."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>

                {/* Time Limit */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time Limit (seconds)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.time_limit_seconds}
                    onChange={(e) => setFormData({ ...formData, time_limit_seconds: e.target.value })}
                    placeholder="e.g., 300 (5 minutes)"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">Leave empty for no time limit</p>
                </div>

                {/* Max Score */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum Score (points)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={formData.max_score}
                    onChange={(e) => setFormData({ ...formData, max_score: e.target.value })}
                    placeholder="e.g., 10"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-blue-500/30 transition-all"
                  >
                    Add Question
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {showEditModal && selectedQuestion && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowEditModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">Edit Question</h2>
                <p className="text-sm text-gray-600 mt-1">Update question details</p>
              </div>

              <form onSubmit={handleUpdate} className="p-6 space-y-6">
                {/* Question Text */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Question
                  </label>
                  <textarea
                    value={formData.question_text}
                    onChange={(e) => setFormData({ ...formData, question_text: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>

                {/* Time Limit */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time Limit (seconds)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.time_limit_seconds}
                    onChange={(e) => setFormData({ ...formData, time_limit_seconds: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Max Score */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum Score (points)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={formData.max_score}
                    onChange={(e) => setFormData({ ...formData, max_score: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-blue-500/30 transition-all"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Modal */}
      <AnimatePresence>
        {showDeleteModal && selectedQuestion && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowDeleteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                  <Trash2 className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Delete Question</h3>
                  <p className="text-sm text-gray-600">This action cannot be undone</p>
                </div>
              </div>

              <p className="text-gray-700 mb-6">
                Are you sure you want to delete this question? All associated answers will also be removed.
              </p>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

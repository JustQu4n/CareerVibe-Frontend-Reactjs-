/**
 * InterviewQuestions Component - Refactored
 * Quản lý câu hỏi với CRUD operations đầy đủ
 */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Edit,
  Trash2,
  Clock,
  Award,
  Hash,
  FileQuestion,
  GripVertical
} from 'lucide-react';
import { toast } from 'react-toastify';
import employerInterviewService from '@/services/employerInterviewService';

export default function InterviewQuestions({ interview }) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);

  useEffect(() => {
    loadQuestions();
  }, [interview]);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      const data = await employerInterviewService.getQuestions(interview.interview_id);
      setQuestions(data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (questionId) => {
    if (!window.confirm('Are you sure you want to delete this question?')) return;

    try {
      await employerInterviewService.deleteQuestion(interview.interview_id, questionId);
      toast.success('Question deleted successfully');
      loadQuestions();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleEdit = (question) => {
    setEditingQuestion(question);
    setShowEditModal(true);
  };

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
          <h2 className="text-2xl font-bold text-gray-900">Interview Questions</h2>
          <p className="text-sm text-gray-600 mt-1">
            Manage questions for: <span className="font-semibold">{interview.title}</span>
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/30 transition-all"
        >
          <Plus className="h-5 w-5" />
          Add Question
        </button>
      </div>

      {/* Questions List */}
      {questions.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <FileQuestion className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Questions Yet</h3>
          <p className="text-gray-600 mb-6">Get started by adding your first question</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors"
          >
            Add Question
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {questions.map((question, index) => (
            <QuestionCard
              key={question.question_id}
              question={question}
              index={index}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <CreateQuestionModal
        isOpen={showCreateModal}
        interview={interview}
        onClose={() => setShowCreateModal(false)}
        onSuccess={() => {
          loadQuestions();
          setShowCreateModal(false);
        }}
      />

      <EditQuestionModal
        isOpen={showEditModal}
        interview={interview}
        question={editingQuestion}
        onClose={() => {
          setShowEditModal(false);
          setEditingQuestion(null);
        }}
        onSuccess={() => {
          loadQuestions();
          setShowEditModal(false);
          setEditingQuestion(null);
        }}
      />
    </div>
  );
}

// ========================================
// Question Card Component
// ========================================
function QuestionCard({ question, index, onEdit, onDelete }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all"
    >
      <div className="p-6">
        <div className="flex items-start gap-4">
          {/* Drag Handle */}
          <div className="flex items-center gap-2 pt-1">
            <GripVertical className="h-5 w-5 text-gray-400" />
            <span className="text-lg font-bold text-gray-900">#{index + 1}</span>
          </div>

          {/* Content */}
          <div className="flex-1">
            <p className="text-gray-900 text-base leading-relaxed mb-4">
              {question.question_text}
            </p>

            <div className="flex flex-wrap items-center gap-4">
              {question.time_limit_seconds && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <span>{Math.floor(question.time_limit_seconds / 60)} minutes</span>
                </div>
              )}
              {question.max_score && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Award className="h-4 w-4 text-yellow-600" />
                  <span>{question.max_score} points</span>
                </div>
              )}
              {question.order_index !== undefined && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Hash className="h-4 w-4 text-purple-600" />
                  <span>Order: {question.order_index}</span>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(question)}
              className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={() => onDelete(question.question_id)}
              className="p-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ========================================
// Create Question Modal
// ========================================
function CreateQuestionModal({ isOpen, interview, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    question_text: '',
    time_limit_seconds: '',
    max_score: '',
    order_index: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await employerInterviewService.createQuestion(interview.interview_id, {
        ...formData,
        time_limit_seconds: formData.time_limit_seconds ? parseInt(formData.time_limit_seconds) : null,
        max_score: formData.max_score ? parseFloat(formData.max_score) : null,
        order_index: formData.order_index ? parseInt(formData.order_index) : null,
      });
      toast.success('Question created successfully');
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
          <h2 className="text-2xl font-bold text-gray-900">Add Question</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Question Text *
            </label>
            <textarea
              required
              value={formData.question_text}
              onChange={(e) => setFormData({ ...formData, question_text: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your question..."
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Time Limit (seconds)
              </label>
              <input
                type="number"
                value={formData.time_limit_seconds}
                onChange={(e) => setFormData({ ...formData, time_limit_seconds: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="300"
              />
              <p className="text-xs text-gray-500 mt-1">e.g., 300 = 5 minutes</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Max Score
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.max_score}
                onChange={(e) => setFormData({ ...formData, max_score: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="10"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Order Index
              </label>
              <input
                type="number"
                value={formData.order_index}
                onChange={(e) => setFormData({ ...formData, order_index: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="1"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Creating...' : 'Create Question'}
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
// Edit Question Modal
// ========================================
function EditQuestionModal({ isOpen, interview, question, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    question_text: '',
    time_limit_seconds: '',
    max_score: '',
    order_index: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (question) {
      setFormData({
        question_text: question.question_text || '',
        time_limit_seconds: question.time_limit_seconds || '',
        max_score: question.max_score || '',
        order_index: question.order_index || '',
      });
    }
  }, [question]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await employerInterviewService.updateQuestion(
        interview.interview_id,
        question.question_id,
        {
          ...formData,
          time_limit_seconds: formData.time_limit_seconds ? parseInt(formData.time_limit_seconds) : null,
          max_score: formData.max_score ? parseFloat(formData.max_score) : null,
          order_index: formData.order_index ? parseInt(formData.order_index) : null,
        }
      );
      toast.success('Question updated successfully');
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
          <h2 className="text-2xl font-bold text-gray-900">Edit Question</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Question Text *
            </label>
            <textarea
              required
              value={formData.question_text}
              onChange={(e) => setFormData({ ...formData, question_text: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Time Limit (seconds)
              </label>
              <input
                type="number"
                value={formData.time_limit_seconds}
                onChange={(e) => setFormData({ ...formData, time_limit_seconds: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Max Score
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.max_score}
                onChange={(e) => setFormData({ ...formData, max_score: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Order Index
              </label>
              <input
                type="number"
                value={formData.order_index}
                onChange={(e) => setFormData({ ...formData, order_index: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Updating...' : 'Update Question'}
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

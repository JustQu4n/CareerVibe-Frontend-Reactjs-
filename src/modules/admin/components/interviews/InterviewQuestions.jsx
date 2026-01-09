/**
 * InterviewQuestions Component - Refactored
 * Quản lý câu hỏi với CRUD operations đầy đủ
 */
import React, { useState, useEffect, useRef } from 'react';
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
import parseExcel from '@/utils/parseExcel';
import * as XLSX from 'xlsx';
import employerInterviewService from '@/services/employerInterviewService';

// Available evaluation criteria
const AVAILABLE_CRITERIA = [
  'Clarity of Expression',
  'Logical Thinking',
  'Learning Attitude & Growth Mindset',
  'Basic IT Awareness',
  'Professional Attitude & Honesty'
];

export default function InterviewQuestions({ interview }) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [classifyingAll, setClassifyingAll] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const fileInputRef = useRef();

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
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowImportModal(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold transition-all"
          >
            <FileQuestion className="h-4 w-4" />
            Import Excel
          </button>

          <button
            onClick={async () => {
              if (!questions || questions.length === 0) {
                toast.info('No questions to classify');
                return;
              }
              if (!window.confirm('Classify criteria for all questions using AI?')) return;
              try {
                setClassifyingAll(true);
                for (let i = 0; i < questions.length; i++) {
                  const q = questions[i];
                  toast.info(`Classifying question ${i + 1} / ${questions.length}...`);
                  try {
                    await employerInterviewService.classifyQuestionCriteria(interview.interview_id, q.question_id);
                  } catch (err) {
                    console.error('classify failed', q.question_id, err);
                  }
                }
                toast.success('Classification completed for all questions');
                await loadQuestions();
              } catch (err) {
                toast.error('Failed to classify all questions');
              } finally {
                setClassifyingAll(false);
              }
            }}
            disabled={classifyingAll}
            className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-all"
          >
            {classifyingAll ? 'Classifying...' : 'Classify All (AI)'}
          </button>

          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-sm shadow-blue-500/20 transition-all"
          >
            <Plus className="h-4 w-4" />
            Add Question
          </button>
        </div>
      </div>

      {/* Questions List */}
      {questions.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <FileQuestion className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Questions Yet</h3>
          <p className="text-gray-600 mb-6">Get started by adding your first question</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors"
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
              interview={interview}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onClassified={loadQuestions}
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

      <ImportExcelModal
        isOpen={showImportModal}
        interview={interview}
        onClose={() => setShowImportModal(false)}
        onSuccess={() => {
          loadQuestions();
          setShowImportModal(false);
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
function QuestionCard({ question, index, interview, onEdit, onDelete, onClassified }) {
  const [classifying, setClassifying] = useState(false);
  // Try multiple sources for criteria
  const [criteria, setCriteria] = useState(
    question.classified_criteria || question.criteria || []
  );

  const handleClassify = async () => {
    if (!interview || !question) return;
    try {
      setClassifying(true);
      const res = await employerInterviewService.classifyQuestionCriteria(
        interview.interview_id,
        question.question_id
      );
      // Expecting { question_id, question_text, criteria: [...], message }
      if (res?.criteria) setCriteria(res.criteria);
      toast.success(res?.message || 'Classification completed');
      if (onClassified) onClassified();
    } catch (err) {
      toast.error(err.message || 'Failed to classify criteria');
    } finally {
      setClassifying(false);
    }
  };

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
            <p className="text-gray-900 text-base font-bold leading-relaxed mb-4">
              {question.question_text}
            </p>

            {/* Criteria Section - Always visible */}
            <div className="mb-4 bg-slate-50 border border-slate-200 rounded-lg p-3">

              {criteria && criteria.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {criteria.map((c, i) => (
                    <span 
                      key={i} 
                      className="text-xs bg-white border border-slate-300 px-3 py-1.5 rounded-full text-slate-700 font-medium shadow-sm"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">
                  No criteria classified yet. Click the classify button to analyze this question.
                </p>
              )}
            </div>

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
              onClick={handleClassify}
              disabled={classifying}
              className="p-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-lg transition-colors flex items-center"
            >
              {classifying ? '...' : <FileQuestion className="h-4 w-4" />}
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
    criteria: [],
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
        criteria: formData.criteria || [],
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

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Evaluation Criteria
            </label>
            <div className="border border-gray-300 rounded-lg p-3 space-y-2 max-h-40 overflow-y-auto bg-gray-50">
              {AVAILABLE_CRITERIA.map((criterion) => (
                <label key={criterion} className="flex items-center gap-2 cursor-pointer hover:bg-white p-2 rounded transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.criteria.includes(criterion)}
                    onChange={(e) => {
                      const newCriteria = e.target.checked
                        ? [...formData.criteria, criterion]
                        : formData.criteria.filter(c => c !== criterion);
                      setFormData({ ...formData, criteria: newCriteria });
                    }}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{criterion}</span>
                </label>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-1">Select criteria for AI evaluation</p>
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
// Import Excel Modal
// ========================================
function ImportExcelModal({ isOpen, interview, onClose, onSuccess }) {
  const [file, setFile] = useState(null);
  const [parsed, setParsed] = useState([]);
  const [parsing, setParsing] = useState(false);
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });

  useEffect(() => {
    if (!isOpen) {
      setFile(null);
      setParsed([]);
      setParsing(false);
      setImporting(false);
      setProgress({ done: 0, total: 0 });
    }
  }, [isOpen]);

  const handleFile = async (f) => {
    if (!f) return;
    setParsing(true);
    try {
      const rows = await parseExcel(f);
      setParsed(rows);
    } catch (err) {
      toast.error('Failed to parse Excel file');
    } finally {
      setParsing(false);
    }
  };

  const handleImport = async () => {
    if (!parsed || parsed.length === 0) {
      toast.info('No questions to import');
      return;
    }

    setImporting(true);
    setProgress({ done: 0, total: parsed.length });
    try {
      for (let i = 0; i < parsed.length; i++) {
        const q = parsed[i];
        try {
          await employerInterviewService.createQuestion(interview.interview_id, {
            question_text: q.question_text,
            time_limit_seconds: q.time_limit_seconds || null,
            max_score: q.max_score || null,
            order_index: q.order_index || null,
          });
        } catch (err) {
          // continue on error for individual rows
          console.error('import row failed', i, err);
        }
        setProgress((p) => ({ ...p, done: p.done + 1 }));
      }

      toast.success('Import completed');
      onSuccess();
    } catch (err) {
      toast.error('Import failed');
    } finally {
      setImporting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Import Questions from Excel</h2>
          <button onClick={onClose} className="text-sm text-gray-500">Close</button>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-sm text-gray-600">Upload a .xlsx/.xls file. Columns accepted: question_text, time_limit_seconds, max_score, order_index (case-insensitive). The first sheet will be used.</p>

          <div className="flex items-center gap-3">
            <input
              type="file"
              accept=".xls,.xlsx"
              onChange={(e) => {
                const f = e.target.files?.[0];
                setFile(f);
                handleFile(f);
              }}
              className=""
            />
            <button
              onClick={() => {
                const sample = [
                  {
                    question_text: 'Example: Describe a challenge you solved',
                    time_limit_seconds: 300,
                    max_score: 10,
                    order_index: 1,
                  },
                ];
                const ws = XLSX.utils.json_to_sheet(sample);
                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, 'Questions');
                XLSX.writeFile(wb, 'interview_questions_template.xlsx');
              }}
              className="px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-200"
            >
              Download Template
            </button>
            {parsing && <div className="text-sm text-gray-500">Parsing...</div>}
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-semibold mb-2">Preview ({parsed.length})</h4>
            {parsed.length === 0 ? (
              <div className="text-sm text-gray-500">No rows parsed yet</div>
            ) : (
              <div className="space-y-2 max-h-52 overflow-y-auto">
                {parsed.slice(0, 20).map((r, i) => (
                  <div key={i} className="p-2 bg-white border rounded-lg">
                    <div className="font-medium">{r.question_text || '<empty>'}</div>
                    <div className="text-xs text-gray-500">Time: {r.time_limit_seconds ?? '-'}s • Score: {r.max_score ?? '-'} • Order: {r.order_index ?? '-'}</div>
                  </div>
                ))}
                {parsed.length > 20 && <div className="text-xs text-gray-500">Showing first 20 rows</div>}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 pt-4">
            <button
              onClick={handleImport}
              disabled={importing || parsed.length === 0}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {importing ? `Importing (${progress.done}/${progress.total})` : 'Import Questions'}
            </button>
            <button onClick={onClose} className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-xl">Cancel</button>
          </div>
        </div>
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
    criteria: [],
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (question) {
      setFormData({
        question_text: question.question_text || '',
        time_limit_seconds: question.time_limit_seconds || '',
        max_score: question.max_score || '',
        order_index: question.order_index || '',
        criteria: question.criteria || question.classified_criteria || [],
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
          criteria: formData.criteria || [],
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

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Evaluation Criteria
            </label>
            <div className="border border-gray-300 rounded-lg p-3 space-y-2 max-h-40 overflow-y-auto bg-gray-50">
              {AVAILABLE_CRITERIA.map((criterion) => (
                <label key={criterion} className="flex items-center gap-2 cursor-pointer hover:bg-white p-2 rounded transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.criteria.includes(criterion)}
                    onChange={(e) => {
                      const newCriteria = e.target.checked
                        ? [...formData.criteria, criterion]
                        : formData.criteria.filter(c => c !== criterion);
                      setFormData({ ...formData, criteria: newCriteria });
                    }}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{criterion}</span>
                </label>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-1">Select criteria for AI evaluation</p>
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

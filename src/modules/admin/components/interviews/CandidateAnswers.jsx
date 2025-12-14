/**
 * CandidateAnswers Component
 * View all candidate answers without grading interface
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  Award,
  Clock,
  User,
  FileText,
  CheckCircle,
  Eye,
  ChevronDown,
  ChevronUp,
  Calendar,
  Filter,
  Search,
  Download,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';
import interviewService from '../../services/interviewService';

export default function CandidateAnswers({ selectedInterview }) {
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [candidateInfo, setCandidateInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [answersLoading, setAnswersLoading] = useState(false);
  const [expandedAnswers, setExpandedAnswers] = useState({});
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (selectedInterview) {
      fetchCandidates();
    }
  }, [selectedInterview]);

  useEffect(() => {
    if (selectedCandidate) {
      fetchAnswers();
    }
  }, [selectedCandidate]);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const data = await interviewService.getCandidates(selectedInterview.interview_id);
      console.log('=== CANDIDATE DATA FROM API ===', data);
      const candidateList = Array.isArray(data) ? data : data.candidates || [];
      console.log('=== FIRST CANDIDATE ===', candidateList[0]);
      console.log('=== CANDIDATE OBJECT ===', candidateList[0]?.candidate);
      setCandidates(candidateList);
    } catch (error) {
      console.error('Error fetching candidates:', error);
      toast.error('Failed to load candidates');
      setCandidates([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnswers = async () => {
    try {
      setAnswersLoading(true);
      const data = await interviewService.getCandidateAnswers(
        selectedInterview.interview_id,
        selectedCandidate.candidate_interview_id
      );
      const answerList = Array.isArray(data) ? data : data.answers || [];
      setAnswers(answerList);
      // Extract candidate info from first answer
      if (answerList.length > 0 && answerList[0].candidate) {
        setCandidateInfo(answerList[0].candidate);
      }
    } catch (error) {
      console.error('Error fetching answers:', error);
      toast.error('Failed to load answers');
      setAnswers([]);
    } finally {
      setAnswersLoading(false);
    }
  };

  const toggleAnswerExpand = (answerId) => {
    setExpandedAnswers(prev => ({
      ...prev,
      [answerId]: !prev[answerId]
    }));
  };

  const formatTime = (seconds) => {
    if (!seconds && seconds !== 0) return 'N/A';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getStatusConfig = (status) => {
    const configs = {
      pending: { label: 'Pending', color: 'yellow', bgColor: 'bg-yellow-100', textColor: 'text-yellow-700' },
      in_progress: { label: 'In Progress', color: 'blue', bgColor: 'bg-blue-100', textColor: 'text-blue-700' },
      completed: { label: 'Completed', color: 'green', bgColor: 'bg-green-100', textColor: 'text-green-700' },
      graded: { label: 'Graded', color: 'purple', bgColor: 'bg-purple-100', textColor: 'text-purple-700' }
    };
    return configs[status] || configs.pending;
  };

  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = 
      candidate.candidate_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.application_id?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || candidate.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (!selectedInterview) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Interview Selected</h3>
        <p className="text-gray-600">Please select an interview session to view candidate answers</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Candidates Sidebar */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden sticky top-6">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <User className="h-5 w-5 text-blue-600" />
                Candidates
              </h3>
              <button
                onClick={fetchCandidates}
                className="p-1.5 hover:bg-white rounded-lg transition-colors"
                title="Refresh"
              >
                <RefreshCw className="h-4 w-4 text-gray-600" />
              </button>
            </div>

            {/* Search */}
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="graded">Graded</option>
            </select>
          </div>

          {/* Candidates List */}
          <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-sm text-gray-600 mt-3">Loading...</p>
              </div>
            ) : filteredCandidates.length === 0 ? (
              <div className="p-8 text-center">
                <User className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-sm text-gray-600">No candidates found</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredCandidates.map((candidate) => {
                  const statusConfig = getStatusConfig(candidate.status);
                  const isSelected = selectedCandidate?.candidate_interview_id === candidate.candidate_interview_id;

                  return (
                    <motion.button
                      key={candidate.candidate_interview_id}
                      whileHover={{ x: 4 }}
                      onClick={() => setSelectedCandidate(candidate)}
                      className={`
                        w-full p-4 text-left transition-colors
                        ${isSelected
                          ? 'bg-blue-50 border-l-4 border-blue-600'
                          : 'hover:bg-gray-50'
                        }
                      `}
                    >
                      <div className="flex items-start gap-3">
                        {(candidate.candidate?.avatar_url) ? (
                          <img
                            src={candidate.candidate.avatar_url}
                            alt={candidate.candidate?.full_name || 'Candidate'}
                            className="h-10 w-10 rounded-full object-cover flex-shrink-0 border-2 border-white shadow-sm"
                          />
                        ) : (isSelected && candidateInfo?.avatar_url) ? (
                          <img
                            src={candidateInfo.avatar_url}
                            alt={candidateInfo.full_name || 'Candidate'}
                            className="h-10 w-10 rounded-full object-cover flex-shrink-0 border-2 border-white shadow-sm"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-semibold text-sm">
                              {((candidate.candidate?.full_name && candidate.candidate.full_name.charAt(0)) || (isSelected && candidateInfo?.full_name && candidateInfo.full_name.charAt(0)) || candidate.candidate_id?.substring(0, 2) || 'C').toUpperCase()}
                            </span>
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate mb-0.5">
                            {candidate.candidate?.full_name || (isSelected && candidateInfo?.full_name) || candidate.candidate_id}
                          </p>
                          {(candidate.candidate?.email) ? (
                            <p className="text-xs text-gray-500 truncate mb-1">{candidate.candidate.email}</p>
                          ) : ((isSelected && candidateInfo?.email) ? (
                            <p className="text-xs text-gray-500 truncate mb-1">{candidateInfo.email}</p>
                          ) : null)}
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig.bgColor} ${statusConfig.textColor}`}>
                            {statusConfig.label}
                          </span>
                          {candidate.total_score !== null && candidate.total_score !== undefined && (
                            <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                              <Award className="h-3 w-3" />
                              <span>Score: {candidate.total_score}</span>
                            </div>
                          )}
                        </div>
                        {isSelected && (
                          <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Stats Footer */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="text-center">
              <p className="text-sm text-gray-600">Total Candidates</p>
              <p className="text-2xl font-bold text-gray-900">{candidates.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Answers Display */}
      <div className="lg:col-span-2">
        {!selectedCandidate ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <Eye className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a Candidate</h3>
            <p className="text-gray-600">Choose a candidate from the list to view their answers</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Candidate Info Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  {candidateInfo?.avatar_url ? (
                    <img
                      src={candidateInfo.avatar_url}
                      alt={candidateInfo.full_name || 'Candidate'}
                      className="h-14 w-14 rounded-full object-cover border-2 border-blue-200 shadow-lg"
                    />
                  ) : (
                    <div className="h-14 w-14 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-lg">
                        {candidateInfo?.full_name?.charAt(0).toUpperCase() || selectedCandidate.candidate_id.substring(0, 2).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {candidateInfo?.full_name || selectedCandidate.candidate_id}
                    </h2>
                    <p className="text-sm text-gray-600">
                      {candidateInfo?.email || ''}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Application ID: {selectedCandidate.application_id}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${getStatusConfig(selectedCandidate.status).bgColor} ${getStatusConfig(selectedCandidate.status).textColor}`}>
                    {getStatusConfig(selectedCandidate.status).label}
                  </span>
                </div>
              </div>

              {/* Summary Stats */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-1">Total Score</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {selectedCandidate.total_score !== null ? selectedCandidate.total_score : '-'}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-1">Assigned</p>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(selectedCandidate.assigned_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-1">Completed</p>
                  <p className="text-sm font-medium text-gray-900">
                    {selectedCandidate.completed_at 
                      ? new Date(selectedCandidate.completed_at).toLocaleDateString()
                      : 'Not yet'}
                  </p>
                </div>
              </div>
            </div>

            {/* Answers List */}
            {answersLoading ? (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading answers...</p>
              </div>
            ) : answers.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Answers Yet</h3>
                <p className="text-gray-600">This candidate hasn't submitted any answers</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Answers ({answers.length})
                  </h3>
                  <button
                    onClick={fetchAnswers}
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Refresh
                  </button>
                </div>

                {answers.map((answer, index) => {
                  const isExpanded = expandedAnswers[answer.interview_answer_id];

                  return (
                    <motion.div
                      key={answer.interview_answer_id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-blue-300 transition-all"
                    >
                      {/* Question Header */}
                      <div 
                        className="p-6 bg-gradient-to-r from-gray-50 to-blue-50 cursor-pointer"
                        onClick={() => toggleAnswerExpand(answer.interview_answer_id)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <span className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                                Q{index + 1}
                              </span>
                              {answer.score !== null && answer.score !== undefined && (
                                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium flex items-center gap-1">
                                  <CheckCircle className="h-3 w-3" />
                                  Graded
                                </span>
                              )}
                            </div>
                            <p className="text-gray-900 font-medium mb-3 leading-relaxed">
                              {answer.question || answer.question_text || 'Question not available'}
                            </p>
                            <div className="flex flex-wrap items-center gap-4 text-sm">
                              <span className="flex items-center gap-1.5 text-gray-600">
                                <Clock className="h-4 w-4 text-blue-500" />
                                {formatTime(answer.elapsed_seconds)}
                              </span>
                              {answer.score !== null && answer.score !== undefined && (
                                <span className="flex items-center gap-1.5 font-medium text-blue-600">
                                  <Award className="h-4 w-4 text-amber-500" />
                                  {answer.score} / {answer.question?.max_score || 'N/A'} points
                                </span>
                              )}
                              <span className="text-xs text-gray-500">
                                Answered: {new Date(answer.created_at).toLocaleString()}
                              </span>
                            </div>
                          </div>
                          <button className="p-2 hover:bg-white/50 rounded-lg transition-colors">
                            {isExpanded ? (
                              <ChevronUp className="h-5 w-5 text-gray-600" />
                            ) : (
                              <ChevronDown className="h-5 w-5 text-gray-600" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Answer Content */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <div className="p-6 space-y-6">
                              {/* Candidate Answer */}
                              <div>
                                <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                  <MessageSquare className="h-4 w-4 text-blue-600" />
                                  Candidate's Answer
                                </label>
                                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                  <p className="text-gray-900 whitespace-pre-wrap leading-relaxed">
                                    {answer.answer_text || 'No answer provided'}
                                  </p>
                                </div>
                              </div>

                              {/* Grading Info (if graded) */}
                              {answer.score !== null && answer.score !== undefined && (
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                  <div className="grid grid-cols-2 gap-4 mb-3">
                                    <div>
                                      <p className="text-xs text-blue-600 font-medium mb-1">Score Received</p>
                                      <p className="text-2xl font-bold text-blue-900">{answer.score}</p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-blue-600 font-medium mb-1">Maximum Score</p>
                                      <p className="text-2xl font-bold text-blue-900">{answer.question?.max_score || 'N/A'}</p>
                                    </div>
                                  </div>
                                  
                                  {answer.feedback && (
                                    <div className="mt-3 pt-3 border-t border-blue-200">
                                      <p className="text-xs text-blue-600 font-medium mb-1">Feedback</p>
                                      <p className="text-sm text-blue-900">{answer.feedback}</p>
                                    </div>
                                  )}
                                  
                                  {answer.graded_at && (
                                    <div className="mt-3 pt-3 border-t border-blue-200 text-xs text-blue-600">
                                      Graded on {new Date(answer.graded_at).toLocaleString()}
                                      {answer.graded_by && ` by ${answer.graded_by}`}
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* Answer Metadata */}
                              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                                <div>
                                  <p className="text-xs text-gray-600 mb-1">Time Taken</p>
                                  <p className="text-sm font-medium text-gray-900">
                                    {formatTime(answer.elapsed_seconds)}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-600 mb-1">Submitted At</p>
                                  <p className="text-sm font-medium text-gray-900">
                                    {new Date(answer.created_at).toLocaleString()}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

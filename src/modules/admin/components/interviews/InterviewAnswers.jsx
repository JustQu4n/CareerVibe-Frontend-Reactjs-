/**
 * InterviewAnswers Component
 * View and grade candidate answers
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
  Save,
  Eye,
  ChevronDown,
  ChevronUp,
  Calendar
} from 'lucide-react';
import { toast } from 'sonner';
import interviewService from '../../services/interviewService';

export default function InterviewAnswers({ selectedInterview }) {
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [candidateInfo, setCandidateInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expandedAnswers, setExpandedAnswers] = useState({});
  const [gradingData, setGradingData] = useState({});

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
      const data = await interviewService.getCandidates(selectedInterview.interview_id);
      const candidateList = Array.isArray(data) ? data : data.candidates || [];
      setCandidates(candidateList.filter(c => c.status === 'completed' || c.status === 'graded'));
    } catch (error) {
      console.error('Error fetching candidates:', error);
      toast.error('Failed to load candidates');
      setCandidates([]);
    }
  };

  const fetchAnswers = async () => {
    try {
      setLoading(true);
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
      
      // Initialize grading data
      const initialGrading = {};
      (Array.isArray(data) ? data : data.answers || []).forEach(answer => {
        initialGrading[answer.interview_answer_id] = {
          score: answer.score || '',
          feedback: answer.feedback || ''
        };
      });
      setGradingData(initialGrading);
    } catch (error) {
      console.error('Error fetching answers:', error);
      toast.error('Failed to load answers');
      setAnswers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleGrade = async (answerId) => {
    const grading = gradingData[answerId];
    
    if (!grading) return;

    try {
      const payload = {
        score: grading.score ? parseFloat(grading.score) : undefined,
        feedback: grading.feedback || undefined
      };

      await interviewService.gradeAnswer(
        selectedInterview.interview_id,
        selectedCandidate.candidate_interview_id,
        answerId,
        payload
      );

      // Update local state
      setAnswers(answers.map(a => 
        a.interview_answer_id === answerId 
          ? { ...a, score: payload.score, feedback: payload.feedback, graded_at: new Date().toISOString() }
          : a
      ));

      toast.success('Answer graded successfully');
      
      // Refresh candidate data to update total score
      fetchCandidates();
    } catch (error) {
      console.error('Error grading answer:', error);
      toast.error(error.response?.data?.message || 'Failed to grade answer');
    }
  };

  const toggleAnswerExpand = (answerId) => {
    setExpandedAnswers(prev => ({
      ...prev,
      [answerId]: !prev[answerId]
    }));
  };

  const updateGradingData = (answerId, field, value) => {
    setGradingData(prev => ({
      ...prev,
      [answerId]: {
        ...prev[answerId],
        [field]: value
      }
    }));
  };

  const formatTime = (seconds) => {
    if (!seconds && seconds !== 0) return 'N/A';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const calculateTotalScore = () => {
    return answers.reduce((sum, a) => sum + (a.score || 0), 0);
  };

  const calculateMaxScore = () => {
    return answers.reduce((sum, a) => sum + (a.question?.max_score || 0), 0);
  };

  if (!selectedInterview) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Interview Selected</h3>
        <p className="text-gray-600">Please select an interview session to view answers</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Candidates List */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden sticky top-6">
          <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <User className="h-5 w-5 text-blue-600" />
              Candidates ({candidates.length})
            </h3>
          </div>

          <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
            {candidates.length === 0 ? (
              <div className="p-8 text-center">
                <User className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-sm text-gray-600">No completed interviews</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {candidates.map((candidate) => (
                  <motion.button
                    key={candidate.candidate_interview_id}
                    whileHover={{ x: 4 }}
                    onClick={() => setSelectedCandidate(candidate)}
                    className={`
                      w-full p-4 text-left transition-colors
                      ${selectedCandidate?.candidate_interview_id === candidate.candidate_interview_id
                        ? 'bg-blue-50 border-l-4 border-blue-600'
                        : 'hover:bg-gray-50'
                      }
                    `}
                  >
                    <div className="flex items-start gap-3">
                      {(selectedCandidate?.candidate_interview_id === candidate.candidate_interview_id && candidateInfo?.avatar_url) ? (
                        <img
                          src={candidateInfo.avatar_url}
                          alt={candidateInfo.full_name || 'Candidate'}
                          className="h-10 w-10 rounded-full object-cover flex-shrink-0 border-2 border-white shadow-sm"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-semibold text-sm">
                            {(selectedCandidate?.candidate_interview_id === candidate.candidate_interview_id && candidateInfo?.full_name) ? candidateInfo.full_name.charAt(0).toUpperCase() : candidate.candidate_id.substring(0, 2).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate mb-1">
                          {(selectedCandidate?.candidate_interview_id === candidate.candidate_interview_id && candidateInfo?.full_name) || candidate.candidate_id}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Award className="h-3 w-3" />
                          <span>Score: {candidate.total_score || 0}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(candidate.completed_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      {candidate.status === 'graded' && (
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Answers & Grading */}
      <div className="lg:col-span-2">
        {!selectedCandidate ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <Eye className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a Candidate</h3>
            <p className="text-gray-600">Choose a candidate from the list to view and grade their answers</p>
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
                <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                  selectedCandidate.status === 'graded' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-blue-100 text-blue-700'
                }`}>
                  {selectedCandidate.status === 'graded' ? 'Graded' : 'Pending Grading'}
                </span>
              </div>

              {/* Score Summary */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-1">Total Score</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {selectedCandidate.total_score || 0}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-1">Completed At</p>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(selectedCandidate.completed_at).toLocaleString()}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-1">Result</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    selectedCandidate.result === 'pass' 
                      ? 'bg-green-100 text-green-700'
                      : selectedCandidate.result === 'fail'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-gray-100 text-gray-700'
                  }`}>
                    {selectedCandidate.result || 'Pending'}
                  </span>
                </div>
              </div>
            </div>

            {/* Answers List */}
            {loading ? (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading answers...</p>
              </div>
            ) : answers.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Answers Found</h3>
                <p className="text-gray-600">This candidate hasn't submitted any answers yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {answers.map((answer, index) => {
                  const isExpanded = expandedAnswers[answer.interview_answer_id];
                  const grading = gradingData[answer.interview_answer_id] || {};

                  return (
                    <motion.div
                      key={answer.interview_answer_id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-white rounded-xl border border-gray-200 overflow-hidden"
                    >
                      {/* Question Header */}
                      <div 
                        className="p-6 bg-gradient-to-r from-gray-50 to-blue-50 cursor-pointer"
                        onClick={() => toggleAnswerExpand(answer.interview_answer_id)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                                Q{index + 1}
                              </span>
                              {answer.graded_at && (
                                <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium flex items-center gap-1">
                                  <CheckCircle className="h-3 w-3" />
                                  Graded
                                </span>
                              )}
                            </div>
                            <p className="text-gray-900 font-medium mb-2 leading-relaxed">
                              {answer.question || answer.question_text || 'Question not available'}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {formatTime(answer.elapsed_seconds)}
                              </span>
                              {answer.score !== null && answer.score !== undefined && (
                                <span className="flex items-center gap-1 font-medium text-blue-600">
                                  <Award className="h-4 w-4" />
                                  {answer.score} points
                                </span>
                              )}
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

                      {/* Answer Content & Grading */}
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
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                  Candidate's Answer
                                </label>
                                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                  <p className="text-gray-900 whitespace-pre-wrap leading-relaxed">
                                    {answer.answer_text || 'No answer provided'}
                                  </p>
                                </div>
                              </div>

                              {/* Grading Form */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Score Input */}
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Score (points)
                                  </label>
                                  <input
                                    type="number"
                                    min="0"
                                    step="0.1"
                                    value={grading.score}
                                    onChange={(e) => updateGradingData(answer.interview_answer_id, 'score', e.target.value)}
                                    placeholder="Enter score"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  />
                                </div>

                                {/* Max Score Display */}
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Maximum Score
                                  </label>
                                  <div className="px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-700 font-medium">
                                    {answer.question?.max_score || 'Not set'}
                                  </div>
                                </div>
                              </div>

                              {/* Feedback */}
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Feedback
                                </label>
                                <textarea
                                  value={grading.feedback}
                                  onChange={(e) => updateGradingData(answer.interview_answer_id, 'feedback', e.target.value)}
                                  placeholder="Provide detailed feedback for the candidate..."
                                  rows={4}
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                />
                              </div>

                              {/* Grading Info */}
                              {answer.graded_at && (
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                  <p className="text-sm text-blue-900">
                                    <strong>Previously graded:</strong> {new Date(answer.graded_at).toLocaleString()}
                                    {answer.graded_by && ` by ${answer.graded_by}`}
                                  </p>
                                </div>
                              )}

                              {/* Save Button */}
                              <button
                                onClick={() => handleGrade(answer.interview_answer_id)}
                                className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-blue-500/30 transition-all flex items-center justify-center gap-2"
                              >
                                <Save className="h-5 w-5" />
                                Save Grade
                              </button>
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

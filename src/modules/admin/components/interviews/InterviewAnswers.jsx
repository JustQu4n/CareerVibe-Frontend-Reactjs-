/**
 * InterviewAnswers Component - Refactored
 * Xem và chấm điểm câu trả lời của candidates
 */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  User,
  FileQuestion,
  Award,
  Clock,
  CheckCircle,
  Save,
  ArrowLeft,
  Calendar,
  TrendingUp,
  Brain,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { toast } from 'react-toastify';
import employerInterviewService from '@/services/employerInterviewService';
import AIEvaluationPanel from './AIEvaluationPanel';
import BehaviorLogsPanel from './BehaviorLogsPanel';

export default function InterviewAnswers({ interview }) {
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [answersLoading, setAnswersLoading] = useState(false);
  const [aiEvaluation, setAiEvaluation] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [behaviorLogs, setBehaviorLogs] = useState([]);
  const [behaviorLoading, setBehaviorLoading] = useState(false);

  useEffect(() => {
    loadCandidates();
  }, [interview]);

  const loadCandidates = async () => {
    try {
      setLoading(true);
      const data = await employerInterviewService.getCandidates(interview.interview_id);
      // Only show candidates who have submitted
      const submittedCandidates = data.filter(c => c.status === 'submitted');
      setCandidates(submittedCandidates);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadCandidateAnswers = async (candidateInterviewId) => {
    try {
      setAnswersLoading(true);
      const data = await employerInterviewService.getCandidateAnswers(
        interview.interview_id,
        candidateInterviewId
      );
      console.log('Candidate Answers:', data);
      setAnswers(data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setAnswersLoading(false);
    }
  };

  const handleSelectCandidate = async (candidate) => {
    setSelectedCandidate(candidate);
    await loadCandidateAnswers(candidate.candidate_interview_id);
    // Auto-load AI evaluation if it exists
    loadAIEvaluation(candidate.candidate_interview_id);
    // Load behavior logs from backend
    loadBehaviorLogs(candidate.candidate_interview_id);
  };

  const handleBackToList = () => {
    setSelectedCandidate(null);
    setAnswers([]);
    setAiEvaluation(null);
    setShowAIPanel(false);
    setBehaviorLogs([]);
  };

  const loadAIEvaluation = async (candidateInterviewId) => {
    try {
      const data = await employerInterviewService.getAIEvaluation(candidateInterviewId);
      setAiEvaluation(data);
      setShowAIPanel(true);
    } catch (error) {
      // Silently fail - evaluation might not exist yet
      setAiEvaluation(null);
      setShowAIPanel(false);
    }
  };

  const loadBehaviorLogs = async (candidateInterviewId) => {
    try {
      setBehaviorLoading(true);
      const data = await employerInterviewService.getBehaviorLogs(
        interview.interview_id,
        candidateInterviewId
      );
      console.log('Behavior Logs Response:', data);
      // Backend returns { logs: [...], behavior_summary: {...}, risk_score: ... }
      if (data && data.logs) {
        setBehaviorLogs(data.logs);
      } else if (Array.isArray(data)) {
        setBehaviorLogs(data);
      } else {
        setBehaviorLogs([]);
      }
    } catch (error) {
      console.warn('Could not load behavior logs:', error.message);
      setBehaviorLogs([]);
    } finally {
      setBehaviorLoading(false);
    }
  };

  const handleAIScore = async () => {
    if (!selectedCandidate) return;

    try {
      setAiLoading(true);
      toast.info('AI is analyzing the interview answers...');
      
      const result = await employerInterviewService.scoreInterviewWithAI(
        selectedCandidate.candidate_interview_id
      );
      
      setAiEvaluation(result);
      setShowAIPanel(true);
      toast.success('AI evaluation completed successfully!');
      
      // Refresh candidates to update scores
      loadCandidates();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setAiLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Show candidate list
  if (!selectedCandidate) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div>
            <h2 className="text-2xl font-bold text-black">Candidate Answers & Grading</h2>
            <p className="text-sm text-black mt-1">
            Select a candidate to view and grade their answers for: <span className="font-semibold">{interview.title}</span>
          </p>
        </div>

        {/* Candidates List */}
        {candidates.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
              <MessageSquare className="h-16 w-16 text-black mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-black mb-2">No Submissions Yet</h3>
              <p className="text-black">
              No candidates have completed this interview yet
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {candidates.map((candidate) => (
              <CandidateCard
                key={candidate.candidate_interview_id}
                candidate={candidate}
                onSelect={handleSelectCandidate}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  // Show answers grading view
  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleBackToList}
          className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-black" />
        </button>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-black">Grading: {selectedCandidate.candidate?.full_name || 'Candidate'}</h2>
          <p className="text-sm text-black mt-1">Review and grade answers for <span className="font-semibold">{interview.title}</span></p>
        </div>
      </div>

      {/* Candidate Info Card */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {selectedCandidate.candidate?.avatar_url ? (
              <img
                src={selectedCandidate.candidate.avatar_url}
                alt={selectedCandidate.candidate.full_name}
                className="h-16 w-16 rounded-full object-cover border-4 border-white/30"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedCandidate.candidate.full_name || 'User')}&background=random`;
                }}
              />
            ) : (
              <div className="h-16 w-16 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold">
                {selectedCandidate.candidate?.full_name?.charAt(0)?.toUpperCase() || 'C'}
              </div>
            )}
            <div>
              <h3 className="text-xl font-bold">{selectedCandidate.candidate?.full_name || 'Unknown'}</h3>
              {selectedCandidate.candidate?.email && (
                <p className="text-blue-100 text-sm">
                  {selectedCandidate.candidate.email}
                </p>
              )}
              {selectedCandidate.candidate?.phone && (
                <p className="text-blue-100 text-sm">
                   {selectedCandidate.candidate.phone}
                </p>
              )}
              <p className="text-blue-200 text-xs mt-1">
                Completed: {selectedCandidate.completed_at ? new Date(selectedCandidate.completed_at).toLocaleString() : 'N/A'}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-3">
            <div className="text-right">
              <div className="text-3xl font-bold">
                {selectedCandidate.total_score !== null ? `${selectedCandidate.total_score}%` : '-'}
              </div>
              <p className="text-blue-100 text-sm">Current Score</p>
            </div>
            <button
              onClick={handleAIScore}
              disabled={aiLoading}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {aiLoading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Brain className="h-4 w-4" />
              )}
              <span className="font-semibold text-sm">
                {aiLoading ? 'Analyzing...' : aiEvaluation ? 'Re-evaluate with AI' : 'Evaluate with AI'}
              </span>
              <Sparkles className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* AI Evaluation Panel */}
      {showAIPanel && aiEvaluation && (
        <AIEvaluationPanel
          evaluation={aiEvaluation}
          loading={aiLoading}
        />
      )}

      {/* Behavior Logs Panel */}
      {selectedCandidate && (
        <BehaviorLogsPanel
          behaviorLogs={behaviorLogs}
          candidateName={selectedCandidate.candidate?.full_name || 'Candidate'}
          loading={behaviorLoading}
        />
      )}

      {/* Answers List */}
      {answersLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : answers.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <FileQuestion className="h-16 w-16 text-black mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-black mb-2">No Answers Found</h3>
          <p className="text-black">
            This candidate has not submitted any answers
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {answers.map((answer, index) => (
            <AnswerCard
              key={answer.interview_answer_id}
              answer={answer}
              index={index}
              interview={interview}
              candidateInterviewId={selectedCandidate.candidate_interview_id}
              onGradeSuccess={() => {
                loadCandidateAnswers(selectedCandidate.candidate_interview_id);
                loadCandidates(); // Refresh to update total score
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ========================================
// Candidate Card Component
// ========================================
function CandidateCard({ candidate, onSelect }) {
  const score = candidate.total_score;
  const hasScore = score !== null && score !== undefined;
  
  // Score color logic
  const getScoreColor = () => {
    if (!hasScore) return 'bg-gray-100 text-gray-600';
    if (score >= 25) return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    return 'bg-red-100 text-red-700 border-red-200';
  };

  const getScoreBadge = () => {
    if (!hasScore) return { icon: '⏳', label: 'Not graded', color: 'text-gray-500' };
    if (score >= 25) return { icon: '✅', label: 'Passed', color: 'text-emerald-600' };
    return { icon: '❌', label: 'Failed', color: 'text-red-600' };
  };

  const scoreBadge = getScoreBadge();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group bg-white rounded-2xl border-2 border-gray-200 hover:border-blue-500 hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
      onClick={() => onSelect(candidate)}
    >
      {/* Score Badge at Top */}
      <div className={`h-2 w-full ${hasScore ? (score >= 25 ? 'bg-emerald-500' : 'bg-red-500') : 'bg-gray-300'}`} />
      
      <div className="p-6">
        {/* Header with Avatar */}
        <div className="flex items-start gap-4 mb-5">
          {candidate.candidate?.avatar_url ? (
            <img
              src={candidate.candidate.avatar_url}
              alt={candidate.candidate.full_name}
              className="h-16 w-16 rounded-xl object-cover border-2 border-gray-200 group-hover:border-blue-500 transition-colors"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(candidate.candidate.full_name || 'User')}&background=random`;
              }}
            />
          ) : (
            <div className="h-16 w-16 rounded-xl bg-blue-100 border-2 border-blue-200 flex items-center justify-center text-blue-700 font-bold text-2xl group-hover:bg-blue-200 transition-colors">
              {candidate.candidate?.full_name?.charAt(0)?.toUpperCase() || 'C'}
            </div>
          )}
          
          {/* Score Display */}
          <div className="flex-1">
            <div className={`inline-flex items-center justify-center px-4 py-2 rounded-xl text-2xl font-bold border-2 ${getScoreColor()}`}>
              {hasScore ? `${score}%` : '—'}
            </div>
          </div>
        </div>

        {/* Candidate Info */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">
            {candidate.candidate?.full_name || 'Unknown Candidate'}
          </h3>
          
          {candidate.candidate?.email && (
            <p className="text-sm text-gray-600 mb-1 flex items-center gap-2 truncate">
 
              {candidate.candidate.email}
            </p>
          )}
          
          {candidate.candidate?.phone && (
            <p className="text-sm text-gray-600 mb-1 flex items-center gap-2">
           
              {candidate.candidate.phone}
            </p>
          )}
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-2 mb-4 px-3 py-2 bg-slate-50 rounded-lg border border-slate-200">
          <span className="text-lg">{scoreBadge.icon}</span>
          <div className="flex-1">
            <p className={`text-xs font-semibold ${scoreBadge.color}`}>
              {scoreBadge.label}
            </p>
          </div>
        </div>

        {/* Completion Date */}
        <div className="mb-4 px-3 py-2 bg-blue-50 rounded-lg border border-blue-100">
          <div className="flex items-center gap-2 text-xs text-blue-700">
            <Calendar className="h-3.5 w-3.5" />
            <span className="font-medium">
              Completed: {candidate.completed_at ? new Date(candidate.completed_at).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              }) : 'Not completed'}
            </span>
          </div>
        </div>

        {/* Action Button */}
        <button className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2 group-hover:bg-blue-700">
          <MessageSquare className="h-4 w-4" />
          View & Grade Answers
        </button>
      </div>
    </motion.div>
  );
}

// ========================================
// Answer Card Component
// ========================================
function AnswerCard({ answer, index, interview, candidateInterviewId, onGradeSuccess }) {
  const [isEditing, setIsEditing] = useState(false);
  const [gradeData, setGradeData] = useState({
    score: answer.score || '',
    feedback: answer.feedback || '',
  });
  const [saving, setSaving] = useState(false);

  const handleSaveGrade = async () => {
    try {
      setSaving(true);
      await employerInterviewService.gradeAnswer(
        interview.interview_id,
        candidateInterviewId,
        answer.interview_answer_id,
        {
          score: gradeData.score ? parseFloat(gradeData.score) : null,
          feedback: gradeData.feedback,
        }
      );
      toast.success('Grade saved successfully');
      setIsEditing(false);
      onGradeSuccess();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  const isGraded = answer.score !== null && answer.score !== undefined;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
    >
      {/* Question Section */}
      <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 border-b border-gray-200">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
            {index + 1}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-black mb-2">
              {answer.question|| 'Question'}
            </h3>
            <div className="flex items-center gap-4 text-sm text-black">
              {answer.max_score && (
                <div className="flex items-center gap-1">
                  <Award className="h-4 w-4 text-yellow-600" />
                  <span>Max: {answer.max_score} points</span>
                </div>
              )}
              {answer.elapsed_seconds && (
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <span>Time: {Math.floor(answer.elapsed_seconds / 60)}m {answer.elapsed_seconds % 60}s</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Answer Section */}
      <div className="p-6">
        <h4 className="text-sm font-semibold text-black mb-2">Candidate's Answer:</h4>
        <div className="bg-gray-50 rounded-lg p-4 mb-4 border border-gray-200">
          <p className="text-black whitespace-pre-wrap leading-relaxed">
            {answer.answer_text || <span className="text-black italic">No answer provided</span>}
          </p>
        </div>

        {/* Grading Section */}
        <div className="border-t border-gray-200 pt-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-semibold text-black">Grading:</h4>
            {isGraded && !isEditing && (
              <span className="flex items-center gap-1 text-green-600 text-sm font-semibold">
                <CheckCircle className="h-4 w-4" />
                Graded
              </span>
            )}
          </div>

          {isEditing || !isGraded ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Score (out of {answer.max_score || 100})
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max={answer.max_score || 100}
                  value={gradeData.score}
                  onChange={(e) => setGradeData({ ...gradeData, score: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter score"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Feedback
                </label>
                <textarea
                  value={gradeData.feedback}
                  onChange={(e) => setGradeData({ ...gradeData, feedback: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Provide feedback to the candidate..."
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleSaveGrade}
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Save className="h-4 w-4" />
                  {saving ? 'Saving...' : 'Save Grade'}
                </button>
                {isGraded && (
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setGradeData({
                        score: answer.score || '',
                        feedback: answer.feedback || '',
                      });
                    }}
                    className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-black font-semibold rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-4">
                <div>
                  <span className="text-sm text-black">Score:</span>
                  <span className="ml-2 text-2xl font-bold text-green-700">
                    {answer.score} / {answer.max_score || 100}
                  </span>
                </div>
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-white hover:bg-gray-50 text-black font-semibold rounded-lg border border-gray-300 transition-colors"
                >
                  Edit Grade
                </button>
              </div>
              
              {answer.feedback && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h5 className="text-sm font-semibold text-black mb-2">Feedback:</h5>
                  <p className="text-black text-sm leading-relaxed">{answer.feedback}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

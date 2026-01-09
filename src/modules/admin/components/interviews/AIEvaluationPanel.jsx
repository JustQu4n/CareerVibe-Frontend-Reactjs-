/**
 * AIEvaluationPanel Component
 * Hiển thị kết quả đánh giá AI cho interview
 */
import React from 'react';
import { motion } from 'framer-motion';
import {
  Brain,
  TrendingUp,
  Star,
  CheckCircle,
  AlertCircle,
  Award,
  Target,
  BarChart3,
  MessageSquare,
  Clock,
  Lightbulb
} from 'lucide-react';

export default function AIEvaluationPanel({ evaluation, loading }) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <div className="flex items-center justify-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          <p className="text-black">AI is analyzing the interview...</p>
        </div>
      </div>
    );
  }

  if (!evaluation) {
    return null;
  }

  const {
    totalScore,
    recommendation,
    criteria,
    summary,
    detailedFeedback,
    modelUsed,
    createdAt
  } = evaluation;

  // Helper để lấy màu recommendation
  const getRecommendationColor = (rec) => {
    switch (rec) {
      case 'PASS':
        return 'text-green-700 bg-green-50 border-green-200';
      case 'FAIL':
        return 'text-red-700 bg-red-50 border-red-200';
      default:
        return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  // Helper để lấy icon recommendation
  const getRecommendationIcon = (rec) => {
    switch (rec) {
      case 'PASS':
        return <CheckCircle className="h-6 w-6" />;
      case 'FAIL':
        return <AlertCircle className="h-6 w-6" />;
      default:
        return <Target className="h-6 w-6" />;
    }
  };

  // Helper để format recommendation text
  const getRecommendationText = (rec) => {
    const map = {
      'PASS': 'Pass',
      'FAIL': 'Fail'
    };
    return map[rec] || rec;
  };

  // Helper để tính điểm trung bình các criteria
  const criteriaEntries = criteria ? Object.entries(criteria) : [];
  const maxScore = 10; // Mỗi criteria có max 10 điểm

  // Convert detailedFeedback object to array, excluding group2Analysis
  let feedbackArray = [];
  let group2Analysis = null;
  
  if (detailedFeedback && typeof detailedFeedback === 'object') {
    if (Array.isArray(detailedFeedback)) {
      // If it's already an array, use it directly
      feedbackArray = detailedFeedback;
    } else {
      // If it's an object, extract numeric keys and group2Analysis
      group2Analysis = detailedFeedback.group2Analysis;
      feedbackArray = Object.keys(detailedFeedback)
        .filter(key => key !== 'group2Analysis' && !isNaN(key))
        .sort((a, b) => Number(a) - Number(b))
        .map(key => detailedFeedback[key]);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header with AI Badge */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl shadow-lg p-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
              <Brain className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold">AI Evaluation Results</h3>
              <p className="text-purple-100 text-xs">
                Analyzed by OpenAI model • {createdAt ? new Date(createdAt).toLocaleDateString() : ''}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Score Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Total Score Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
              <Award className="h-5 w-5 text-blue-600" />
            </div>
            <h4 className="text-base font-semibold text-black">Total Score</h4>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-blue-600">{totalScore}</span>
            <span className="text-xl text-black mb-1">/ 50</span>
          </div>
          <div className="mt-3 bg-gray-100 rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500"
              style={{ width: `${(totalScore / 50) * 100}%` }}
            />
          </div>
        </div>

        {/* Recommendation Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-8 w-8 rounded-lg bg-purple-100 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </div>
            <h4 className="text-base font-semibold text-black">Recommendation</h4>
          </div>
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border-2 ${getRecommendationColor(recommendation)}`}>
            {getRecommendationIcon(recommendation)}
            <span className="text-xl font-bold">
              {getRecommendationText(recommendation)}
            </span>
          </div>
        </div>
      </div>

      {/* Criteria Breakdown */}
      {criteriaEntries.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-green-600" />
            </div>
            <h4 className="text-lg font-semibold text-black">Evaluation Criteria</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {criteriaEntries.map(([key, value]) => (
              <div key={key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-black capitalize">
                    {key.replace(/_/g, ' ')}
                  </span>
                  <span className="text-lg font-bold text-black">
                    {value} / {maxScore}
                  </span>
                </div>
                <div className="bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      value >= 8 ? 'bg-green-500' :
                      value >= 6 ? 'bg-yellow-500' :
                      value >= 4 ? 'bg-orange-500' :
                      'bg-red-500'
                    }`}
                    style={{ width: `${(value / maxScore) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Summary */}
      {summary && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center">
              <MessageSquare className="h-6 w-6 text-indigo-600" />
            </div>
            <h4 className="text-lg font-semibold text-black">Overall Summary</h4>
          </div>
          <p className="text-black leading-relaxed">{summary}</p>
        </div>
      )}

      {/* Detailed Feedback */}
      {feedbackArray && feedbackArray.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-lg bg-yellow-100 flex items-center justify-center">
              <Lightbulb className="h-6 w-6 text-yellow-600" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900">Detailed Feedback by Question</h4>
          </div>
          <div className="space-y-6">
            {feedbackArray.map((feedback, index) => {
              // Calculate average score from scores object if available
              const scores = feedback.scores || {};
              const scoreValues = Object.values(scores).filter(v => v !== null && v !== undefined);
              const avgScore = scoreValues.length > 0 
                ? (scoreValues.reduce((a, b) => a + b, 0) / scoreValues.length).toFixed(1)
                : feedback.score || 0;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow"
                >
                  {/* Question Header */}
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
                      <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                        Q{feedback.questionIndex + 1}
                      </div>
                      <span className="font-semibold text-black">Question {feedback.questionIndex + 1}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-black">Avg Score:</span>
                      <span className={`text-2xl font-bold ${
                        avgScore >= 8 ? 'text-green-600' :
                        avgScore >= 6 ? 'text-yellow-600' :
                        avgScore >= 4 ? 'text-orange-600' :
                        'text-red-600'
                      }`}>
                        {avgScore}/10
                      </span>
                    </div>
                  </div>

                  {/* Question Criteria */}
                  {feedback.questionCriteria && feedback.questionCriteria.length > 0 && (
                    <div className="mb-4">
                      <h5 className="text-sm font-semibold text-black mb-2 flex items-center gap-2">
                        <Target className="h-4 w-4" />
                        Evaluation Criteria
                      </h5>
                      <div className="flex flex-wrap gap-2">
                        {feedback.questionCriteria.map((criterion, idx) => (
                          <span key={idx} className="text-xs bg-slate-100 border border-slate-200 px-2 py-1 rounded-full text-black">
                            {criterion}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Individual Scores */}
                  {scores && Object.keys(scores).length > 0 && (
                    <div className="mb-4">
                      <h5 className="text-sm font-semibold text-black mb-2 flex items-center gap-2">
                        <BarChart3 className="h-4 w-4" />
                        Score Breakdown
                      </h5>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {Object.entries(scores).map(([key, value]) => (
                          <div key={key} className="bg-slate-50 rounded-lg p-3">
                            <div className="text-xs text-black mb-1 capitalize">
                              {key === 'itAwareness' ? 'IT Awareness' : 
                               key === 'clarity' ? 'Clarity' : 
                               key === 'logic' ? 'Logical Thinking' : key}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`text-xl font-bold ${
                                value === null ? 'text-gray-400' :
                                value >= 8 ? 'text-green-600' :
                                value >= 6 ? 'text-yellow-600' :
                                'text-orange-600'
                              }`}>
                                {value !== null ? value : 'N/A'}
                              </span>
                              {value !== null && <span className="text-sm text-black">/10</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Strengths */}
                  {feedback.strengths && feedback.strengths.length > 0 && (
                    <div className="mb-4">
                      <h5 className="text-sm font-semibold text-green-700 mb-2 flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        Strengths
                      </h5>
                      <ul className="space-y-1">
                        {feedback.strengths.map((strength, idx) => (
                          <li key={idx} className="text-sm text-black flex items-start gap-2">
                            <span className="text-green-500 mt-0.5">✓</span>
                            <span>{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Weaknesses */}
                  {feedback.weaknesses && feedback.weaknesses.length > 0 && (
                    <div className="mb-4">
                      <h5 className="text-sm font-semibold text-orange-700 mb-2 flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        Areas for Improvement
                      </h5>
                      <ul className="space-y-1">
                        {feedback.weaknesses.map((weakness, idx) => (
                          <li key={idx} className="text-sm text-black flex items-start gap-2">
                            <span className="text-orange-500 mt-0.5">!</span>
                            <span>{weakness}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Group 2 Analysis - Displayed once at the end */}
      {group2Analysis && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <Star className="h-6 w-6 text-purple-600" />
            </div>
            <h4 className="text-lg font-semibold text-black">Attitude & Professional Skills Analysis</h4>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-5 border border-purple-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Learning Attitude */}
              {group2Analysis.learningAttitude && (
                <div className="bg-white rounded-lg p-4 border border-purple-100">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-black">Learning Attitude & Growth Mindset</span>
                    <span className={`text-2xl font-bold ${
                      group2Analysis.learningAttitude.score >= 8 ? 'text-green-600' :
                      group2Analysis.learningAttitude.score >= 6 ? 'text-yellow-600' :
                      'text-orange-600'
                    }`}>
                      {group2Analysis.learningAttitude.score}/10
                    </span>
                  </div>
                  {group2Analysis.learningAttitude.evidence && 
                   group2Analysis.learningAttitude.evidence.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-black mb-2">Evidence:</p>
                      <ul className="space-y-1.5">
                        {group2Analysis.learningAttitude.evidence.map((item, idx) => (
                          <li key={idx} className="text-sm text-black flex items-start gap-2">
                            <span className="text-purple-500 mt-0.5">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Professional Attitude */}
              {group2Analysis.professionalAttitude && (
                <div className="bg-white rounded-lg p-4 border border-purple-100">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-black">Professional Attitude & Honesty</span>
                    <span className={`text-2xl font-bold ${
                      group2Analysis.professionalAttitude.score >= 8 ? 'text-green-600' :
                      group2Analysis.professionalAttitude.score >= 6 ? 'text-yellow-600' :
                      'text-orange-600'
                    }`}>
                      {group2Analysis.professionalAttitude.score}/10
                    </span>
                  </div>
                  {group2Analysis.professionalAttitude.evidence && 
                   group2Analysis.professionalAttitude.evidence.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-black mb-2">Evidence:</p>
                      <ul className="space-y-1.5">
                        {group2Analysis.professionalAttitude.evidence.map((item, idx) => (
                          <li key={idx} className="text-sm text-black flex items-start gap-2">
                            <span className="text-purple-500 mt-0.5">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

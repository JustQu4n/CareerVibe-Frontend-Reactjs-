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
          <p className="text-gray-600">AI is analyzing the interview...</p>
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
      case 'STRONG_PASS':
        return 'text-green-700 bg-green-50 border-green-200';
      case 'PASS':
        return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'POTENTIAL':
        return 'text-yellow-700 bg-yellow-50 border-yellow-200';
      case 'WEAK':
        return 'text-orange-700 bg-orange-50 border-orange-200';
      case 'FAIL':
        return 'text-red-700 bg-red-50 border-red-200';
      default:
        return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  // Helper để lấy icon recommendation
  const getRecommendationIcon = (rec) => {
    switch (rec) {
      case 'STRONG_PASS':
      case 'PASS':
        return <CheckCircle className="h-6 w-6" />;
      case 'POTENTIAL':
        return <Star className="h-6 w-6" />;
      case 'WEAK':
      case 'FAIL':
        return <AlertCircle className="h-6 w-6" />;
      default:
        return <Target className="h-6 w-6" />;
    }
  };

  // Helper để format recommendation text
  const getRecommendationText = (rec) => {
    const map = {
      'STRONG_PASS': 'Strong Pass',
      'PASS': 'Pass',
      'POTENTIAL': 'Potential',
      'WEAK': 'Weak',
      'FAIL': 'Fail'
    };
    return map[rec] || rec;
  };

  // Helper để tính điểm trung bình các criteria
  const criteriaEntries = criteria ? Object.entries(criteria) : [];
  const maxScore = 10; // Mỗi criteria có max 10 điểm

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header with AI Badge */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl shadow-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center">
              <Brain className="h-7 w-7" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">AI Evaluation Results</h3>
              <p className="text-purple-100 text-sm">
                Analyzed by {modelUsed || 'AI Model'} • {createdAt ? new Date(createdAt).toLocaleDateString() : ''}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Score Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Total Score Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Award className="h-6 w-6 text-blue-600" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900">Total Score</h4>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-5xl font-bold text-blue-600">{totalScore}</span>
            <span className="text-2xl text-gray-400 mb-2">/ 50</span>
          </div>
          <div className="mt-4 bg-gray-100 rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500"
              style={{ width: `${(totalScore / 50) * 100}%` }}
            />
          </div>
        </div>

        {/* Recommendation Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900">Recommendation</h4>
          </div>
          <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg border-2 ${getRecommendationColor(recommendation)}`}>
            {getRecommendationIcon(recommendation)}
            <span className="text-2xl font-bold">
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
            <h4 className="text-lg font-semibold text-gray-900">Evaluation Criteria</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {criteriaEntries.map(([key, value]) => (
              <div key={key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 capitalize">
                    {key.replace(/_/g, ' ')}
                  </span>
                  <span className="text-lg font-bold text-gray-900">
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
            <h4 className="text-lg font-semibold text-gray-900">Overall Summary</h4>
          </div>
          <p className="text-gray-700 leading-relaxed">{summary}</p>
        </div>
      )}

      {/* Detailed Feedback */}
      {detailedFeedback && detailedFeedback.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-lg bg-yellow-100 flex items-center justify-center">
              <Lightbulb className="h-6 w-6 text-yellow-600" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900">Detailed Feedback by Question</h4>
          </div>
          <div className="space-y-6">
            {detailedFeedback.map((feedback, index) => (
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
                      Q{feedback.questionIndex}
                    </div>
                    <span className="font-semibold text-gray-900">Question {feedback.questionIndex}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Score:</span>
                    <span className={`text-2xl font-bold ${
                      feedback.score >= 8 ? 'text-green-600' :
                      feedback.score >= 6 ? 'text-yellow-600' :
                      feedback.score >= 4 ? 'text-orange-600' :
                      'text-red-600'
                    }`}>
                      {feedback.score}/10
                    </span>
                  </div>
                </div>

                {/* Strengths */}
                {feedback.strengths && feedback.strengths.length > 0 && (
                  <div className="mb-4">
                    <h5 className="text-sm font-semibold text-green-700 mb-2 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      Strengths
                    </h5>
                    <ul className="space-y-1">
                      {feedback.strengths.map((strength, idx) => (
                        <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                          <span className="text-green-500 mt-0.5">✓</span>
                          <span>{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Weaknesses */}
                {feedback.weaknesses && feedback.weaknesses.length > 0 && (
                  <div>
                    <h5 className="text-sm font-semibold text-orange-700 mb-2 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      Areas for Improvement
                    </h5>
                    <ul className="space-y-1">
                      {feedback.weaknesses.map((weakness, idx) => (
                        <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                          <span className="text-orange-500 mt-0.5">!</span>
                          <span>{weakness}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

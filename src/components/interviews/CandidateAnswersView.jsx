/**
 * Candidate Answers View
 * Hiển thị câu trả lời của ứng viên với thông tin candidate
 */
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft,
  Clock,
  CheckCircle2,
  User,
  Mail,
  Phone,
  Award,
  Loader2,
  Save
} from 'lucide-react';
import { toast } from 'react-toastify';
import { getCandidateAnswers, gradeAnswer } from '@/services/employerInterviewService';
import { motion } from 'framer-motion';

const CandidateAnswersView = ({ 
  interviewId, 
  candidateInterviewId,
  onBack 
}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [gradingAnswerId, setGradingAnswerId] = useState(null);
  const [scores, setScores] = useState({});
  const [comments, setComments] = useState({});

  useEffect(() => {
    loadAnswers();
  }, [interviewId, candidateInterviewId]);

  const loadAnswers = async () => {
    try {
      setLoading(true);
      const result = await getCandidateAnswers(interviewId, candidateInterviewId);
      setData(result);
      
      // Initialize scores and comments
      const initialScores = {};
      const initialComments = {};
      result.answers?.forEach(answer => {
        initialScores[answer.answer_id] = answer.score || 0;
        initialComments[answer.answer_id] = answer.grading_comment || '';
      });
      setScores(initialScores);
      setComments(initialComments);
    } catch (error) {
      console.error('Error loading answers:', error);
      toast.error('Không thể tải câu trả lời');
    } finally {
      setLoading(false);
    }
  };

  const handleGrade = async (answerId) => {
    try {
      setGradingAnswerId(answerId);
      await gradeAnswer(interviewId, candidateInterviewId, answerId, {
        score: scores[answerId],
        grading_comment: comments[answerId],
      });
      toast.success('Đã lưu chấm điểm');
      await loadAnswers(); // Reload to get updated total score
    } catch (error) {
      console.error('Error grading answer:', error);
      toast.error('Không thể chấm điểm');
    } finally {
      setGradingAnswerId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!data) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-slate-600">Không tìm thấy dữ liệu</p>
        </CardContent>
      </Card>
    );
  }

  const { candidate, candidateInterview, questions, answers } = data;
  const totalScore = answers?.reduce((sum, a) => sum + (a.score || 0), 0) || 0;
  const maxScore = questions?.reduce((sum, q) => sum + q.max_score, 0) || 100;

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button
        onClick={onBack}
        variant="outline"
        className="gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Quay lại
      </Button>

      {/* Candidate Info Card */}
      <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
        <CardContent className="p-6">
          <div className="flex items-start gap-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              {candidate?.avatar_url ? (
                <img
                  src={candidate.avatar_url}
                  alt={candidate.full_name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(candidate.full_name)}&background=random&size=128`;
                  }}
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-3xl border-4 border-white shadow-lg">
                  {candidate?.full_name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-slate-900 mb-3">
                {candidate?.full_name}
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-slate-700">
                  <Mail className="w-4 h-4 text-blue-500" />
                  <span className="text-sm">{candidate?.email}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <Phone className="w-4 h-4 text-green-500" />
                  <span className="text-sm">{candidate?.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <User className="w-4 h-4 text-purple-500" />
                  <span className="text-sm">ID: {candidate?.user_id?.slice(0, 13)}...</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={
                    candidateInterview?.status === 'submitted' 
                      ? 'bg-green-100 text-green-700'
                      : 'bg-amber-100 text-amber-700'
                  }>
                    {candidateInterview?.status === 'submitted' ? (
                      <>
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Đã nộp
                      </>
                    ) : (
                      <>
                        <Clock className="w-3 h-3 mr-1" />
                        {candidateInterview?.status}
                      </>
                    )}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Score */}
            <div className="text-center bg-white rounded-xl p-4 shadow-md min-w-[120px]">
              <Award className="w-8 h-8 mx-auto mb-2 text-amber-500" />
              <p className="text-sm text-slate-600 mb-1">Tổng điểm</p>
              <p className="text-3xl font-bold text-blue-600">
                {totalScore}
              </p>
              <p className="text-sm text-slate-500">/ {maxScore}</p>
              <div className="mt-2 w-full bg-slate-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    (totalScore / maxScore * 100) >= 80 ? 'bg-green-500' :
                    (totalScore / maxScore * 100) >= 60 ? 'bg-amber-500' :
                    'bg-red-500'
                  }`}
                  style={{ width: `${(totalScore / maxScore * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Answers */}
      <div className="space-y-4">
        {questions?.map((question, index) => {
          const answer = answers?.find(a => a.question_id === question.question_id);
          
          return (
            <motion.div
              key={question.question_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="border-2">
                <CardHeader className="bg-slate-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge variant="outline" className="text-sm">
                          Câu {index + 1}
                        </Badge>
                        <Badge className="bg-blue-100 text-blue-700">
                          {question.max_score} điểm
                        </Badge>
                      </div>
                      <CardTitle className="text-lg">
                        {question.question_text}
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  {/* Answer */}
                  <div>
                    <label className="text-sm font-semibold text-slate-700 mb-2 block">
                      📝 Câu trả lời của ứng viên:
                    </label>
                    <div className="bg-slate-50 p-4 rounded-lg border-2">
                      <p className="text-slate-800 whitespace-pre-wrap">
                        {answer?.answer_text || '(Không có câu trả lời)'}
                      </p>
                    </div>
                    {answer?.elapsed_seconds && (
                      <p className="text-xs text-slate-500 mt-2">
                        ⏱ Thời gian: {Math.floor(answer.elapsed_seconds / 60)}:{(answer.elapsed_seconds % 60).toString().padStart(2, '0')}
                      </p>
                    )}
                  </div>

                  {/* Grading Section */}
                  <div className="pt-4 border-t">
                    <label className="text-sm font-semibold text-slate-700 mb-2 block">
                      ⭐ Chấm điểm:
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Score Input */}
                      <div>
                        <label className="text-xs text-slate-600 mb-1 block">
                          Điểm số (0-{question.max_score})
                        </label>
                        <input
                          type="number"
                          min="0"
                          max={question.max_score}
                          value={scores[answer?.answer_id] || 0}
                          onChange={(e) => setScores({
                            ...scores,
                            [answer?.answer_id]: Math.min(question.max_score, Math.max(0, Number(e.target.value)))
                          })}
                          className="w-full px-4 py-2 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                      </div>

                      {/* Comment */}
                      <div>
                        <label className="text-xs text-slate-600 mb-1 block">
                          Nhận xét
                        </label>
                        <Textarea
                          value={comments[answer?.answer_id] || ''}
                          onChange={(e) => setComments({
                            ...comments,
                            [answer?.answer_id]: e.target.value
                          })}
                          placeholder="Nhận xét của bạn..."
                          rows={2}
                          className="resize-none"
                        />
                      </div>
                    </div>

                    {/* Save Button */}
                    <Button
                      onClick={() => handleGrade(answer?.answer_id)}
                      disabled={gradingAnswerId === answer?.answer_id}
                      className="mt-3 gap-2"
                    >
                      {gradingAnswerId === answer?.answer_id ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Đang lưu...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          Lưu chấm điểm
                        </>
                      )}
                    </Button>

                    {/* Current Grade Display */}
                    {answer?.score !== undefined && answer?.grading_comment && (
                      <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm font-semibold text-green-900">
                          ✓ Đã chấm: {answer.score}/{question.max_score} điểm
                        </p>
                        {answer.grading_comment && (
                          <p className="text-sm text-green-700 mt-1">
                            {answer.grading_comment}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default CandidateAnswersView;

/**
 * Interview Session Container
 * Main component that manages the entire interview flow
 */
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useInterview } from '@/hooks/useInterview';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  AlertCircle, 
  Loader2, 
  Play, 
  ShieldAlert,
  Clock 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import QuestionCard from './QuestionCard';
import InterviewComplete from './InterviewComplete';

const InterviewSession = () => {
  const { candidateInterviewId } = useParams();
  const navigate = useNavigate();
  const [showStartScreen, setShowStartScreen] = useState(true);
  const [preventLeave, setPreventLeave] = useState(false);

  const {
    loading,
    interviewData,
    currentQuestionIndex,
    currentQuestion,
    answers,
    sessionStarted,
    sessionCompleted,
    progress,
    totalQuestions,
    loadInterviewDetails,
    startInterview,
    updateAnswer,
    nextQuestion,
    submitInterview,
  } = useInterview(candidateInterviewId);

  // Load interview details on mount
  useEffect(() => {
    loadInterviewDetails();
  }, [loadInterviewDetails]);

  // Prevent accidental page leave during interview
  useEffect(() => {
    if (sessionStarted && !sessionCompleted) {
      setPreventLeave(true);

      const handleBeforeUnload = (e) => {
        e.preventDefault();
        e.returnValue = '';
        return '';
      };

      window.addEventListener('beforeunload', handleBeforeUnload);
      
      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
        setPreventLeave(false);
      };
    }
  }, [sessionStarted, sessionCompleted]);

  // Handle start interview
  const handleStartInterview = async () => {
    try {
      await startInterview();
      setShowStartScreen(false);
    } catch (error) {
      console.error('Failed to start interview:', error);
    }
  };

  // Handle answer submission (next question)
  const handleSubmitAnswer = async (answerText, elapsedSeconds) => {
    // Update answer in state
    updateAnswer(answerText, elapsedSeconds);
    
    // If last question, submit entire interview with updated answer
    if (currentQuestionIndex === totalQuestions - 1) {
      // Create updated answers array immediately
      const updatedAnswers = [...interviewData.questions.map((q, index) => {
        if (index === currentQuestionIndex) {
          return {
            question_id: q.question_id,
            answer_text: answerText,
            elapsed_seconds: elapsedSeconds,
          };
        }
        // Get from existing answers array
        return {
          question_id: q.question_id,
          answer_text: answers[index]?.answer_text || '',
          elapsed_seconds: answers[index]?.elapsed_seconds || 0,
        };
      })];
      
      await submitInterview(updatedAnswers);
    } else {
      // Move to next question
      nextQuestion();
    }
  };

  // Handle auto-submit when time's up
  const handleAutoSubmit = async (answerText, elapsedSeconds) => {
    // Update answer in state
    updateAnswer(answerText, elapsedSeconds);
    
    // Auto move to next or submit
    if (currentQuestionIndex === totalQuestions - 1) {
      // Create updated answers array immediately
      const updatedAnswers = [...interviewData.questions.map((q, index) => {
        if (index === currentQuestionIndex) {
          return {
            question_id: q.question_id,
            answer_text: answerText,
            elapsed_seconds: elapsedSeconds,
          };
        }
        // Get from existing answers array
        return {
          question_id: q.question_id,
          answer_text: answers[index]?.answer_text || '',
          elapsed_seconds: answers[index]?.elapsed_seconds || 0,
        };
      })];
      
      await submitInterview(updatedAnswers);
    } else {
      nextQuestion();
    }
  };

  // Loading state
  if (loading && !interviewData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-8 text-center space-y-4">
            <Loader2 className="w-12 h-12 mx-auto animate-spin text-blue-600" />
            <p className="text-slate-600">Đang tải thông tin bài interview...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Session completed
  if (sessionCompleted) {
    return <InterviewComplete interviewData={interviewData} />;
  }

  // Start screen
  if (showStartScreen && !sessionStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-2xl"
        >
          <Card className="border-2 shadow-xl">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', duration: 0.5 }}
                className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 mx-auto"
              >
                <Play className="w-10 h-10" />
              </motion.div>
              <h1 className="text-3xl font-bold text-center mb-2">
                {interviewData?.candidateInterview?.interview_id || 'Bài Interview'}
              </h1>
              <p className="text-blue-50 text-center">
                Sẵn sàng để bắt đầu làm bài?
              </p>
            </div>

            <CardContent className="p-8 space-y-6">
              {/* Interview Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg text-center">
                  <Clock className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                  <p className="text-sm text-slate-600">Tổng thời gian</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {Math.floor(
                      (interviewData?.questions?.reduce(
                        (sum, q) => sum + q.time_limit_seconds,
                        0
                      ) || 0) / 60
                    )}{' '}
                    phút
                  </p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg text-center">
                  <AlertCircle className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                  <p className="text-sm text-slate-600">Số câu hỏi</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {totalQuestions} câu
                  </p>
                </div>
              </div>

              {/* Important Rules */}
              <Alert className="border-2 border-amber-200 bg-amber-50">
                <ShieldAlert className="h-5 w-5 text-amber-600" />
                <AlertDescription className="ml-2">
                  <p className="font-semibold text-amber-900 mb-2">
                    📋 Quy tắc quan trọng:
                  </p>
                  <ul className="text-sm text-amber-800 space-y-1 list-disc ml-4">
                    <li>Mỗi câu hỏi có thời gian giới hạn riêng</li>
                    <li>Không thể quay lại câu trước đó</li>
                    <li>Tự động nộp khi hết thời gian</li>
                    <li>Không được refresh hoặc đóng trang</li>
                  </ul>
                </AlertDescription>
              </Alert>

              {/* Deadline */}
              {interviewData?.candidateInterview?.deadline_at && (
                <div className="bg-slate-100 p-4 rounded-lg">
                  <p className="text-sm font-semibold text-slate-900 mb-1">
                    ⏰ Hạn nộp bài:
                  </p>
                  <p className="text-sm text-slate-700">
                    {new Date(
                      interviewData.candidateInterview.deadline_at
                    ).toLocaleString('vi-VN')}
                  </p>
                </div>
              )}

              {/* Start Button */}
              <Button
                onClick={handleStartInterview}
                disabled={loading}
                className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {loading ? (
                  <span className="flex items-center">
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Đang khởi động...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Play className="w-5 h-5 mr-2" />
                    Bắt đầu làm bài
                  </span>
                )}
              </Button>

              <Button
                variant="ghost"
                onClick={() => navigate(-1)}
                disabled={loading}
                className="w-full"
              >
                Quay lại
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Interview in progress
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-6">
        <Card className="border-2">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Đang làm bài Interview
              </h2>
              <p className="text-sm text-slate-600">
                Câu {currentQuestionIndex + 1} / {totalQuestions}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">
                {Math.round(progress)}%
              </div>
              <p className="text-xs text-slate-600">Tiến độ</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <QuestionCard
            question={currentQuestion}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={totalQuestions}
            onSubmitAnswer={handleSubmitAnswer}
            onAutoSubmit={handleAutoSubmit}
            isLastQuestion={currentQuestionIndex === totalQuestions - 1}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default InterviewSession;

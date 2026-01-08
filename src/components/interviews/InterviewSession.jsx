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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-96 shadow-lg">
          <CardContent className="p-8 text-center space-y-4">
            <Loader2 className="w-12 h-12 mx-auto animate-spin text-purple-600" />
            <p className="text-gray-600 font-medium">Loading interview information...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check if already submitted
  if (interviewData?.candidateInterview?.status === 'SUBMITTED') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardContent className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <ShieldAlert className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              Interview Completed
            </h2>
            <p className="text-gray-600">
              You have already submitted this interview. You cannot retake it.
            </p>
            <Button
              onClick={() => navigate(-1)}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white"
            >
              Go Back
            </Button>
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-2xl"
        >
          <Card className="shadow-xl border border-gray-200">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white rounded-t-lg">
              <h1 className="text-lg font-bold text-center mb-2 text-blue-50/90">
                {interviewData?.title || interviewData?.candidateInterview?.title || 'Interview'}
              </h1>
              <h1 className="text-white text-center text-xl font-semibold">
                Ready to start?
              </h1>
            </div>

            <CardContent className="p-8 space-y-6">
              {/* Interview Info */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-blue-50 rounded-lg text-center border border-blue-100">
                  <Clock className="w-6 h-6 mx-auto mb-1.5 text-blue-600" />
                  <p className="text-xs text-gray-600 font-medium mb-1">Total Time</p>
                  <p className="text-xl font-bold text-gray-900">
                    {Math.floor(
                      (interviewData?.questions?.reduce(
                        (sum, q) => sum + q.time_limit_seconds,
                        0
                      ) || 0) / 60
                    )}{' '}
                    min
                  </p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg text-center border border-blue-100">
                  <AlertCircle className="w-6 h-6 mx-auto mb-1.5 text-blue-600" />
                  <p className="text-xs text-gray-600 font-medium mb-1">Questions</p>
                  <p className="text-xl font-bold text-gray-900">
                    {totalQuestions}
                  </p>
                </div>
              </div>

              {/* Important Rules */}
              <Alert className="border border-amber-200 bg-amber-50">
                <ShieldAlert className="h-5 w-5 text-amber-600" />
                <AlertDescription className="ml-2">
                  <p className="font-semibold text-amber-900 mb-2">
                    📋 Important Rules:
                  </p>
                  <ul className="text-sm text-amber-800 space-y-1.5 list-disc ml-4">
                    <li>Each question has its own time limit</li>
                    <li>Cannot go back to previous questions</li>
                    <li>Auto-submit when time runs out</li>
                    <li>Do not refresh or close the page</li>
                  </ul>
                </AlertDescription>
              </Alert>

              {/* Deadline */}
              {interviewData?.candidateInterview?.deadline_at && (
                <div className="bg-gray-100 p-4 rounded-lg border border-gray-200">
                  <p className="text-sm font-semibold text-gray-900 mb-1">
                    ⏰ Deadline:
                  </p>
                  <p className="text-sm text-gray-700">
                    {new Date(
                      interviewData.candidateInterview.deadline_at
                    ).toLocaleString('en-US')}
                  </p>
                </div>
              )}

              {/* Start Button */}
              <Button
                onClick={handleStartInterview}
                disabled={loading}
                className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              >
                {loading ? (
                  <span className="flex items-center">
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Starting...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Play className="w-5 h-5 mr-2" />
                    Start Interview
                  </span>
                )}
              </Button>

              <Button
                variant="ghost"
                onClick={() => navigate(-1)}
                disabled={loading}
                className="w-full hover:bg-gray-100 border-black border"
              >
                Go Back
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Interview in progress
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-6">
        <Card className="shadow-md border border-gray-200">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Interview in Progress
              </h2>
              <p className="text-sm text-gray-600 mt-0.5">
                Question {currentQuestionIndex + 1} / {totalQuestions}
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-purple-600">
                {Math.round(progress)}%
              </div>
              <p className="text-xs text-gray-600 mt-0.5">Progress</p>
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

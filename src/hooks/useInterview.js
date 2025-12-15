/**
 * Interview Hook
 * Manage interview state and logic
 */
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import interviewService from '@/services/interview.service';

export const useInterview = (candidateInterviewId) => {
  const [loading, setLoading] = useState(false);
  const [interviewData, setInterviewData] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [sessionCompleted, setSessionCompleted] = useState(false);

  /**
   * Load interview details
   */
  const loadInterviewDetails = useCallback(async () => {
    if (!candidateInterviewId) return;

    try {
      setLoading(true);
      const data = await interviewService.getInterviewDetails(candidateInterviewId);
      setInterviewData(data);

      // Initialize answers array
      if (data.questions) {
        setAnswers(
          data.questions.map((q) => ({
            question_id: q.question_id,
            answer_text: '',
            elapsed_seconds: 0,
          }))
        );
      }

      // Check if already started
      if (data.candidateInterview?.status === 'in_progress') {
        setSessionStarted(true);
      }
    } catch (error) {
      console.error('Error loading interview:', error);
      toast.error('Không thể tải thông tin bài interview');
    } finally {
      setLoading(false);
    }
  }, [candidateInterviewId]);

  /**
   * Start interview session
   */
  const startInterview = async () => {
    try {
      setLoading(true);
      await interviewService.startInterview(candidateInterviewId);
      setSessionStarted(true);
      toast.success('Bắt đầu làm bài interview');
    } catch (error) {
      console.error('Error starting interview:', error);
      toast.error('Không thể bắt đầu interview');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update answer for current question
   */
  const updateAnswer = (answerText, elapsedSeconds) => {
    setAnswers((prev) => {
      const updated = [...prev];
      updated[currentQuestionIndex] = {
        ...updated[currentQuestionIndex],
        answer_text: answerText,
        elapsed_seconds: elapsedSeconds,
      };
      return updated;
    });
  };

  /**
   * Move to next question
   */
  const nextQuestion = () => {
    if (currentQuestionIndex < (interviewData?.questions?.length || 0) - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  /**
   * Submit interview
   * @param {Array} updatedAnswers - Optional updated answers array to use instead of state
   */
  const submitInterview = async (updatedAnswers = null) => {
    try {
      setLoading(true);
      const answersToSubmit = updatedAnswers || answers;
      await interviewService.submitInterview(candidateInterviewId, answersToSubmit);
      setSessionCompleted(true);
      toast.success('Đã nộp bài thành công!');
    } catch (error) {
      console.error('Error submitting interview:', error);
      toast.error('Không thể nộp bài');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Calculate progress percentage
   */
  const progress = interviewData?.questions
    ? ((currentQuestionIndex + 1) / interviewData.questions.length) * 100
    : 0;

  return {
    loading,
    interviewData,
    currentQuestionIndex,
    currentQuestion: interviewData?.questions?.[currentQuestionIndex],
    answers,
    sessionStarted,
    sessionCompleted,
    progress,
    totalQuestions: interviewData?.questions?.length || 0,
    loadInterviewDetails,
    startInterview,
    updateAnswer,
    nextQuestion,
    submitInterview,
  };
};

/**
 * Hook for interview preview (before accepting)
 */
export const useInterviewPreview = (interviewId) => {
  const [loading, setLoading] = useState(false);
  const [previewData, setPreviewData] = useState(null);

  const loadPreview = useCallback(async () => {
    if (!interviewId) return;

    try {
      setLoading(true);
      const data = await interviewService.previewInterview(interviewId);
      setPreviewData(data);
    } catch (error) {
      console.error('Error loading preview:', error);
      toast.error('Không thể tải thông tin interview');
    } finally {
      setLoading(false);
    }
  }, [interviewId]);

  const acceptInterview = async (applicationId) => {
    try {
      setLoading(true);
      const result = await interviewService.acceptInterview(interviewId, applicationId);
      toast.success('Đã chấp nhận làm bài interview');
      return result;
    } catch (error) {
      console.error('Error accepting interview:', error);
      toast.error('Không thể chấp nhận interview');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    previewData,
    loadPreview,
    acceptInterview,
  };
};

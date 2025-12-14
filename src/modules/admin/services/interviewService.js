/**
 * Interview API Service
 * Handles all interview-related API calls
 */
import apiClient from '@/api/client';

// Base endpoint
const BASE_URL = 'http://localhost:5000/api/employer/interviews';

/**
 * Interview Session APIs
 */
export const interviewService = {
  // Create interview session
  createInterview: async (data) => {
    const response = await apiClient.post(BASE_URL, data);
    return response.data;
  },

  // Get all interviews
  getInterviews: async () => {
    const response = await apiClient.get(BASE_URL);
    return response.data;
  },

  // Get single interview
  getInterview: async (interviewId) => {
    const response = await apiClient.get(`${BASE_URL}/${interviewId}`);
    return response.data;
  },

  // Update interview
  updateInterview: async (interviewId, data) => {
    const response = await apiClient.patch(`${BASE_URL}/${interviewId}`, data);
    return response.data;
  },

  // Delete interview
  deleteInterview: async (interviewId) => {
    const response = await apiClient.delete(`${BASE_URL}/${interviewId}`);
    return response.data;
  },

  /**
   * Question APIs
   */
  // Create question
  createQuestion: async (interviewId, data) => {
    const response = await apiClient.post(`${BASE_URL}/${interviewId}/questions`, data);
    return response.data;
  },

  // Get all questions
  getQuestions: async (interviewId) => {
    const response = await apiClient.get(`${BASE_URL}/${interviewId}/questions`);
    return response.data;
  },

  // Get single question
  getQuestion: async (interviewId, questionId) => {
    const response = await apiClient.get(`${BASE_URL}/${interviewId}/questions/${questionId}`);
    return response.data;
  },

  // Update question
  updateQuestion: async (interviewId, questionId, data) => {
    const response = await apiClient.patch(`${BASE_URL}/${interviewId}/questions/${questionId}`, data);
    return response.data;
  },

  // Delete question
  deleteQuestion: async (interviewId, questionId) => {
    const response = await apiClient.delete(`${BASE_URL}/${interviewId}/questions/${questionId}`);
    return response.data;
  },

  /**
   * Candidate Assignment APIs
   */
  // Get candidate assignments
  getCandidates: async (interviewId) => {
    const response = await apiClient.get(`${BASE_URL}/${interviewId}/candidates`);
    return response.data;
  },

  // Assign interview to candidate
  assignInterview: async (interviewId, data) => {
    const response = await apiClient.post(`${BASE_URL}/${interviewId}/assign`, data);
    return response.data;
  },

  /**
   * Answer APIs
   */
  // Get answers for candidate
  getCandidateAnswers: async (interviewId, candidateInterviewId) => {
    const response = await apiClient.get(`${BASE_URL}/${interviewId}/candidates/${candidateInterviewId}/answers`);
    return response.data;
  },

  // Grade an answer
  gradeAnswer: async (interviewId, candidateInterviewId, answerId, data) => {
    const response = await apiClient.patch(
      `${BASE_URL}/${interviewId}/candidates/${candidateInterviewId}/answers/${answerId}/grade`,
      data
    );
    return response.data;
  }
};

export default interviewService;

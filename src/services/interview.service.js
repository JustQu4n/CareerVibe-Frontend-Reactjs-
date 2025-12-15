/**
 * Interview Service
 * Handle all interview-related API calls for job seekers
 */
import apiClient from '@/api/client';

const interviewService = {
  /**
   * Preview interview details before accepting
   * @param {string} interviewId - Interview ID
   * @returns {Promise<Object>} Interview preview data
   */
  previewInterview: async (interviewId) => {
    const response = await apiClient.get(`/api/jobseeker/interviews/preview/${interviewId}`);
    return response.data;
  },

  /**
   * Accept interview (self-assign)
   * @param {string} interviewId - Interview ID
   * @param {string} applicationId - Application ID
   * @returns {Promise<Object>} Candidate interview data
   */
  acceptInterview: async (interviewId, applicationId) => {
    const response = await apiClient.post(`/api/jobseeker/interviews/${interviewId}/accept`, {
      application_id: applicationId,
    });
    return response.data;
  },

  /**
   * Get list of interviews assigned to current user
   * @returns {Promise<Array>} List of candidate interviews
   */
  getMyInterviews: async () => {
    const response = await apiClient.get('/api/jobseeker/interviews');
    return response.data;
  },

  /**
   * Get interview details with questions
   * @param {string} candidateInterviewId - Candidate Interview ID
   * @returns {Promise<Object>} Interview details and questions
   */
  getInterviewDetails: async (candidateInterviewId) => {
    const response = await apiClient.get(`/api/jobseeker/interviews/${candidateInterviewId}`);
    return response.data;
  },

  /**
   * Start interview session
   * @param {string} candidateInterviewId - Candidate Interview ID
   * @returns {Promise<Object>} Updated candidate interview (status = in_progress)
   */
  startInterview: async (candidateInterviewId) => {
    const response = await apiClient.post(`/api/jobseeker/interviews/${candidateInterviewId}/start`);
    return response.data;
  },

  /**
   * Submit interview answers
   * @param {string} candidateInterviewId - Candidate Interview ID
   * @param {Array} answers - Array of answer objects
   * @returns {Promise<Object>} Submit result
   */
  submitInterview: async (candidateInterviewId, answers) => {
    const response = await apiClient.post(
      `/api/jobseeker/interviews/${candidateInterviewId}/submit`,
      { answers }
    );
    return response.data;
  },

  /**
   * Get interview answers for completed interview
   * @param {string} candidateInterviewId - Candidate Interview ID
   * @returns {Promise<Array>} List of answers
   */
  getInterviewAnswers: async (candidateInterviewId) => {
    const response = await apiClient.get(
      `/api/jobseeker/interviews/${candidateInterviewId}/answers`
    );
    return response.data;
  },
};

export default interviewService;

/**
 * Interview Service
 * Xử lý tất cả API calls liên quan đến interviews cho jobseeker
 */
import apiClient from '@/api/client';

const INTERVIEW_API_BASE = '/api/jobseeker';

/**
 * Lấy danh sách Applications có Interview
 * @returns {Promise<Array>} Danh sách applications có interview
 */
export const getApplicationsWithInterviews = async () => {
  try {
    const response = await apiClient.get(`${INTERVIEW_API_BASE}/applications/with-interviews`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Lấy danh sách Interview của mình
 * @returns {Promise<Array>} Danh sách candidate interviews
 */
export const getMyInterviews = async () => {
  try {
    const response = await apiClient.get(`${INTERVIEW_API_BASE}/interviews`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Lấy lịch sử Interview đã làm (với điểm và feedback)
 * @returns {Promise<Array>} Lịch sử interviews với điểm và feedback
 */
export const getInterviewHistory = async () => {
  try {
    const response = await apiClient.get(`${INTERVIEW_API_BASE}/interviews/history`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Accept interview assignment (bắt đầu interview)
 * @param {string} candidateInterviewId - ID của candidate interview
 * @returns {Promise<Object>} Response data
 */
export const acceptInterview = async (candidateInterviewId) => {
  try {
    const response = await apiClient.post(`${INTERVIEW_API_BASE}/interviews/${candidateInterviewId}/accept`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default {
  getApplicationsWithInterviews,
  getMyInterviews,
  getInterviewHistory,
  acceptInterview,
};

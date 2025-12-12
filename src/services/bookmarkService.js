/**
 * Bookmark/Saved Jobs Service
 * Xử lý API calls liên quan đến việc lưu/bookmark jobs
 */
import apiClient from '@/api/client';

const SAVED_JOBS_API_BASE = '/api/jobseeker/saved';

/**
 * Lưu một job
 * @param {string} jobId - ID của job cần lưu
 * @param {string} token - Auth token
 * @returns {Promise<Object>} - Response data
 */
export const saveJob = async (jobId /*, token */) => {
  try {
    const response = await apiClient.post(`${SAVED_JOBS_API_BASE}/save-job`, { jobId });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Bỏ lưu một job
 * @param {string} jobId - ID của job cần bỏ lưu
 * @param {string} token - Auth token
 * @returns {Promise<Object>} - Response data
 */
export const unsaveJob = async (jobId /*, token */) => {
  try {
    const response = await apiClient.delete(`${SAVED_JOBS_API_BASE}/unsave-job/${jobId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Lấy danh sách tất cả jobs đã lưu
 * @param {string} token - Auth token
 * @returns {Promise<Object>} - Saved jobs data
 */
export const getSavedJobs = async (/* token */) => {
  try {
    const response = await apiClient.get(`${SAVED_JOBS_API_BASE}/jobs`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Kiểm tra xem job có được lưu hay không
 * @param {string} jobId - ID của job
 * @param {string} token - Auth token
 * @returns {Promise<boolean>} - True nếu đã lưu, false nếu chưa
 */
export const checkJobSaved = async (jobId /*, token */) => {
  try {
    const response = await apiClient.get(`${SAVED_JOBS_API_BASE}/check/${jobId}`);
    return response.data.isSaved;
  } catch (error) {
    throw error;
  }
};

export default {
  saveJob,
  unsaveJob,
  getSavedJobs,
  checkJobSaved,
};

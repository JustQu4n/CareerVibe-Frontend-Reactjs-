/**
 * Job Service
 * Xử lý tất cả API calls liên quan đến jobs
 */
import apiClient from '@/api/client';
import { JOB_API_ENDPOINT } from '@/utils/data';

/**
 * Lấy chi tiết một job theo ID
 * @param {string} jobId - ID của job
 * @returns {Promise<Object>} - Job data
 */
export const getJobById = async (jobId) => {
  try {
    const response = await apiClient.get(`/api/jobseeker/job-posts/${jobId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Lấy danh sách tất cả jobs
 * @param {Object} filters - Bộ lọc (optional)
 * @returns {Promise<Object>} - Jobs data
 */
export const getAllJobs = async (filters = {}) => {
  try {
    const response = await apiClient.get('/api/jobseeker/job-posts', { params: filters });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Lấy danh sách jobs liên quan
 * @param {string} jobId - ID của job hiện tại
 * @returns {Promise<Object>} - Related jobs data
 */
export const getRelatedJobs = async (jobId) => {
  try {
    const response = await apiClient.get(`/api/jobseeker/job-posts/${jobId}/related`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Tìm kiếm jobs
 * @param {Object} searchParams - Tham số tìm kiếm
 * @returns {Promise<Object>} - Search results
 */
export const searchJobs = async (searchParams) => {
  try {
    const response = await apiClient.get('/api/jobseeker/job-posts/search', { params: searchParams });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Apply cho một job
 * @param {string} jobId - ID của job
 * @param {Object} applicationData - Dữ liệu ứng tuyển
 * @returns {Promise<Object>} - Application response
 */
export const applyForJob = async (jobId, applicationData) => {
  try {
    const response = await apiClient.post(`/api/jobseeker/job-posts/${jobId}/apply`, applicationData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default {
  getJobById,
  getAllJobs,
  getRelatedJobs,
  searchJobs,
  applyForJob,
};

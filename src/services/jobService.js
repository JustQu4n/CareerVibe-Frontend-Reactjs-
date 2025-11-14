/**
 * Job Service
 * Xử lý tất cả API calls liên quan đến jobs
 */
import axios from 'axios';
import { JOB_API_ENDPOINT } from '@/utils/data';

/**
 * Lấy chi tiết một job theo ID
 * @param {string} jobId - ID của job
 * @returns {Promise<Object>} - Job data
 */
export const getJobById = async (jobId) => {
  try {
    const response = await axios.get(`${JOB_API_ENDPOINT}/${jobId}`, {
      withCredentials: true,
    });
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
    const response = await axios.get(JOB_API_ENDPOINT, {
      params: filters,
      withCredentials: true,
    });
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
    const response = await axios.get(`${JOB_API_ENDPOINT}/${jobId}/related`, {
      withCredentials: true,
    });
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
    const response = await axios.get(`${JOB_API_ENDPOINT}/search`, {
      params: searchParams,
      withCredentials: true,
    });
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
    const response = await axios.post(
      `${JOB_API_ENDPOINT}/${jobId}/apply`,
      applicationData,
      { withCredentials: true }
    );
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

/**
 * Application Service
 * Xử lý tất cả API calls liên quan đến job applications
 */
import apiClient from '@/api/client';

const APPLICATION_API_BASE = '/api/applications';
const JOBSEEKER_API_BASE = '/api/jobseeker/applications';

/**
 * Submit job application
 * @param {string} jobPostId - Job post ID
 * @param {Object} applicationData - Application form data
 * @param {File} cvFile - CV file
 * @returns {Promise<Object>} Response data
 */
export const submitApplication = async (jobPostId, applicationData, cvFile) => {
  const formData = new FormData();
  formData.append("job_post_id", jobPostId);
  formData.append("cover_letter", applicationData.coverLetter || "");
  formData.append("resume", cvFile);

  try {
    const response = await apiClient.post(`${JOBSEEKER_API_BASE}/submit`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    // Enhanced error handling
    if (error.response?.status === 401) {
      throw new Error('Authentication failed. Please log in again.');
    } else if (error.response?.status === 404) {
      throw new Error('API endpoint not found. Please contact support.');
    } else {
      throw new Error(error.response?.data?.message || 'Failed to submit application');
    }
  }
};

/**
 * Lấy tất cả applications của jobseeker (API cũ - deprecated)
 * @param {string} jobseekerId - ID của jobseeker
 * @returns {Promise<Object>} Applications data
 */
export const getJobseekerApplications = async (jobseekerId) => {
  try {
    const response = await apiClient.get(`${APPLICATION_API_BASE}/jobseeker/${jobseekerId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Lấy history applications của jobseeker (API mới)
 * @param {string} jobseekerId - ID của jobseeker
 * @returns {Promise<Object>} Applications data with jobPost details
 */
export const getJobseekerHistoryApplications = async (jobseekerId) => {
  try {
    const response = await apiClient.get(`${JOBSEEKER_API_BASE}/history-applications/${jobseekerId}`);
    return response.data; // { data: [], total: number }
  } catch (error) {
    throw error;
  }
};

/**
 * Lấy chi tiết một application
 * @param {string} applicationId - ID của application
 * @returns {Promise<Object>} Application data
 */
export const getApplicationById = async (applicationId) => {
  try {
    const response = await apiClient.get(`${APPLICATION_API_BASE}/${applicationId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Withdraw/rút lại application
 * @param {string} applicationId - ID của application
 * @returns {Promise<Object>} Response data
 */
export const withdrawApplication = async (applicationId) => {
  try {
    const response = await apiClient.delete(`${APPLICATION_API_BASE}/${applicationId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Update application status (dành cho recruiter/admin)
 * @param {string} applicationId - ID của application
 * @param {string} status - New status
 * @returns {Promise<Object>} Response data
 */
export const updateApplicationStatus = async (applicationId, status) => {
  try {
    const response = await apiClient.patch(`${APPLICATION_API_BASE}/${applicationId}/status`, { status });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default {
  submitApplication,
  getJobseekerApplications,
  getJobseekerHistoryApplications,
  getApplicationById,
  withdrawApplication,
  updateApplicationStatus,
};

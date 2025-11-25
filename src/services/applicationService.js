/**
 * Application Service
 * Xử lý tất cả API calls liên quan đến job applications
 */
import axios from 'axios';

const APPLICATION_API_BASE = 'http://localhost:5000/api/applications';
const JOBSEEKER_API_BASE = 'http://localhost:5000/api/jobseeker/applications';

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

  const token = localStorage.getItem('accessToken');

  try {
    const response = await axios.post(
      `${JOBSEEKER_API_BASE}/submit`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${token}`
        },
        withCredentials: true,
      }
    );
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
    const response = await axios.get(`${APPLICATION_API_BASE}/jobseeker/${jobseekerId}`, {
      withCredentials: true,
    });
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
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(
      `${JOBSEEKER_API_BASE}/history-applications/${jobseekerId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );
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
    const response = await axios.get(`${APPLICATION_API_BASE}/${applicationId}`, {
      withCredentials: true,
    });
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
    const response = await axios.delete(`${APPLICATION_API_BASE}/${applicationId}`, {
      withCredentials: true,
    });
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
    const response = await axios.patch(
      `${APPLICATION_API_BASE}/${applicationId}/status`,
      { status },
      { withCredentials: true }
    );
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

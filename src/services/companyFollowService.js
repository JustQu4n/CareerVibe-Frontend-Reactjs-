/**
 * Company Follow Service
 * Handles all company follow/unfollow related API calls
 */
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const COMPANY_FOLLOW_API_BASE = `${API_BASE_URL}/api/jobseeker/company`;

/**
 * Follow a company
 * @param {string} companyId - Company ID to follow
 * @param {string} token - Auth token
 * @returns {Promise<Object>} - Response data
 */
export const followCompany = async (companyId, token) => {
  try {
    const response = await axios.post(
      `${COMPANY_FOLLOW_API_BASE}/follow-company/${companyId}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Unfollow a company
 * @param {string} companyId - Company ID to unfollow
 * @param {string} token - Auth token
 * @returns {Promise<Object>} - Response data
 */
export const unfollowCompany = async (companyId, token) => {
  try {
    const response = await axios.delete(
      `${COMPANY_FOLLOW_API_BASE}/unfollow-company/${companyId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get list of followed companies
 * @param {string} token - Auth token
 * @param {Object} params - Query params (page, limit)
 * @returns {Promise<Object>} - Followed companies data
 */
export const getFollowedCompanies = async (token, params = {}) => {
  try {
    const { page = 1, limit = 10 } = params;
    const response = await axios.get(`${COMPANY_FOLLOW_API_BASE}/companies`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { page, limit },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Check if company is followed
 * @param {string} companyId - Company ID
 * @param {string} token - Auth token
 * @returns {Promise<Object>} - { isFollowed: boolean, followedAt: date | null }
 */
export const checkCompanyFollowed = async (companyId, token) => {
  try {
    const response = await axios.get(`${COMPANY_FOLLOW_API_BASE}/check/${companyId}`, {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default {
  followCompany,
  unfollowCompany,
  getFollowedCompanies,
  checkCompanyFollowed,
};

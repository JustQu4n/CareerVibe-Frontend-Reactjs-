/**
 * Job Post Service
 * Handles all employer job post-related API calls
 */

import apiClient from '@/api/client';
import { API_ENDPOINTS } from '@/config/api.config';

export const jobPostService = {
  /**
   * Create new job post
   * @param {Object} jobPostData - Job post data
   * @returns {Promise} API response
   */
  createJobPost: async (jobPostData) => {
    try {
      const response = await apiClient.post(
        API_ENDPOINTS.EMPLOYER.JOB_POSTS,
        jobPostData
      );
      return response.data;
    } catch (error) {
      console.error('Error creating job post:', error);
      throw error;
    }
  },

  /**
   * Get all job posts for employer (with pagination)
   * @param {Object} params - Query parameters { page, limit }
   * @returns {Promise} API response
   */
  getJobPosts: async (params = {}) => {
    try {
      const { page = 1, limit = 10 } = params;
      const response = await apiClient.get(
        `${API_ENDPOINTS.EMPLOYER.JOB_POSTS}?page=${page}&limit=${limit}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching job posts:', error);
      throw error;
    }
  },

  /**
   * Get job post by ID
   * @param {string} jobPostId - Job post UUID
   * @returns {Promise} API response
   */
  getJobPostById: async (jobPostId) => {
    try {
      const response = await apiClient.get(
        API_ENDPOINTS.EMPLOYER.JOB_POST_DETAIL(jobPostId)
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching job post:', error);
      throw error;
    }
  },

  /**
   * Update job post
   * @param {string} jobPostId - Job post UUID
   * @param {Object} updateData - Updated job post data (all fields optional)
   * @returns {Promise} API response
   */
  updateJobPost: async (jobPostId, updateData) => {
    try {
      const response = await apiClient.patch(
        API_ENDPOINTS.EMPLOYER.JOB_POST_DETAIL(jobPostId),
        updateData
      );
      return response.data;
    } catch (error) {
      console.error('Error updating job post:', error);
      throw error;
    }
  },

  /**
   * Delete job post
   * @param {string} jobPostId - Job post UUID
   * @returns {Promise} API response
   */
  deleteJobPost: async (jobPostId) => {
    try {
      const response = await apiClient.delete(
        API_ENDPOINTS.EMPLOYER.JOB_POST_DETAIL(jobPostId)
      );
      return response.data;
    } catch (error) {
      console.error('Error deleting job post:', error);
      throw error;
    }
  },

  /**
   * Get job post statistics
   * @returns {Promise} API response with statistics
   */
  getStatistics: async () => {
    try {
      const response = await apiClient.get(
        API_ENDPOINTS.EMPLOYER.JOB_POST_STATISTICS
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching job post statistics:', error);
      throw error;
    }
  },
};

export default jobPostService;

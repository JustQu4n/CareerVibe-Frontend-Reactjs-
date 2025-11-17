/**
 * Experience Service
 * Handles all experience-related API calls
 */

import apiClient from '@/api/client';
import { API_ENDPOINTS } from '@/config/api.config';

export const experienceService = {
  /**
   * Create new experience
   * @param {Object} experienceData - Experience data
   * @returns {Promise} API response
   */
  createExperience: async (experienceData) => {
    try {
      const response = await apiClient.post(
        API_ENDPOINTS.USER.EXPERIENCES,
        experienceData
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Update existing experience
   * @param {string} experienceId - Experience ID
   * @param {Object} experienceData - Updated experience data
   * @returns {Promise} API response
   */
  updateExperience: async (experienceId, experienceData) => {
    try {
      const response = await apiClient.put(
        API_ENDPOINTS.USER.EXPERIENCE_DETAIL(experienceId),
        experienceData
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Delete experience
   * @param {string} experienceId - Experience ID
   * @returns {Promise} API response
   */
  deleteExperience: async (experienceId) => {
    try {
      const response = await apiClient.delete(
        API_ENDPOINTS.USER.EXPERIENCE_DETAIL(experienceId)
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default experienceService;

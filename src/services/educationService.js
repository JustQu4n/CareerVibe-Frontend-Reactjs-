/**
 * Education Service
 * Handles all education-related API calls
 */

import apiClient from '@/api/client';
import { API_ENDPOINTS } from '@/config/api.config';

export const educationService = {
  /**
   * Create new education
   * @param {Object} educationData - Education data
   * @returns {Promise} API response
   */
  createEducation: async (educationData) => {
    try {
      const response = await apiClient.post(
        API_ENDPOINTS.USER.EDUCATIONS,
        educationData
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Update existing education
   * @param {string} educationId - Education ID
   * @param {Object} educationData - Updated education data
   * @returns {Promise} API response
   */
  updateEducation: async (educationId, educationData) => {
    try {
      const response = await apiClient.put(
        API_ENDPOINTS.USER.EDUCATION_DETAIL(educationId),
        educationData
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Delete education
   * @param {string} educationId - Education ID
   * @returns {Promise} API response
   */
  deleteEducation: async (educationId) => {
    try {
      const response = await apiClient.delete(
        API_ENDPOINTS.USER.EDUCATION_DETAIL(educationId)
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default educationService;

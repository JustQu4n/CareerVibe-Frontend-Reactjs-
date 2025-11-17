/**
 * Project Service
 * Handles all project-related API calls
 */

import apiClient from '@/api/client';
import { API_ENDPOINTS } from '@/config/api.config';

export const projectService = {
  /**
   * Create new project
   * @param {Object} projectData - Project data
   * @returns {Promise} API response
   */
  createProject: async (projectData) => {
    try {
      const response = await apiClient.post(
        API_ENDPOINTS.USER.PROJECTS,
        projectData
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Update existing project
   * @param {string} projectId - Project ID
   * @param {Object} projectData - Updated project data
   * @returns {Promise} API response
   */
  updateProject: async (projectId, projectData) => {
    try {
      const response = await apiClient.put(
        API_ENDPOINTS.USER.PROJECT_DETAIL(projectId),
        projectData
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Delete project
   * @param {string} projectId - Project ID
   * @returns {Promise} API response
   */
  deleteProject: async (projectId) => {
    try {
      const response = await apiClient.delete(
        API_ENDPOINTS.USER.PROJECT_DETAIL(projectId)
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default projectService;

/**
 * Skill Service
 * Handles all skill-related API calls
 */

import apiClient from '@/api/client';
import { API_ENDPOINTS } from '@/config/api.config';

export const skillService = {
  /**
   * Get all available skills (master list)
   * @returns {Promise} API response
   */
  getAvailableSkills: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.USER.SKILLS_AVAILABLE);
      return response;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get user's skills
   * @returns {Promise} API response
   */
  getUserSkills: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.USER.SKILLS);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Add skill to profile
   * @param {Object} skillData - Skill data { skill_id, endorsement_count }
   * @returns {Promise} API response
   */
  addSkill: async (skillData) => {
    try {
      const response = await apiClient.post(
        API_ENDPOINTS.USER.SKILLS,
        skillData
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Update skill endorsement count
   * @param {string} skillId - Skill ID
   * @param {Object} skillData - Updated skill data
   * @returns {Promise} API response
   */
  updateSkill: async (skillId, skillData) => {
    try {
      const response = await apiClient.put(
        API_ENDPOINTS.USER.SKILL_DETAIL(skillId),
        skillData
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Delete skill from profile
   * @param {string} skillId - Skill ID
   * @returns {Promise} API response
   */
  deleteSkill: async (skillId) => {
    try {
      const response = await apiClient.delete(
        API_ENDPOINTS.USER.SKILL_DETAIL(skillId)
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get single skill
   * @param {string} skillId - Skill ID
   * @returns {Promise} API response
   */
  getSkill: async (skillId) => {
    try {
      const response = await apiClient.get(
        API_ENDPOINTS.USER.SKILL_DETAIL(skillId)
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default skillService;

/**
 * Profile Service
 * Centralized API calls for profile-related operations
 * This service layer abstracts all profile CRUD operations
 */

import apiClient from '@/api/client';
import { API_ENDPOINTS } from '@/config/api.config';

export const profileService = {
  /**
   * Get jobseeker profile by user ID
   * @param {string} userId - User ID
   * @returns {Promise} Profile data
   */
  getProfile: async (userId) => {
    try {
      const response = await apiClient.get(
        API_ENDPOINTS.USER.JOBSEEKER_PROFILE(userId)
      );
      return response.data?.data || null;
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  },

  /**
   * Update jobseeker profile
   * @param {string} userId - User ID
   * @param {Object} profileData - Profile data to update
   * @returns {Promise} Updated profile data
   */
  updateProfile: async (userId, profileData) => {
    try {
      const response = await apiClient.put(
        API_ENDPOINTS.USER.JOBSEEKER_PROFILE(userId),
        profileData
      );
      return response.data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },

  /**
   * Update avatar
   * @param {File} avatarFile - Avatar file
   * @returns {Promise} Response
   */
  updateAvatar: async (avatarFile) => {
    try {
      const formData = new FormData();
      formData.append('avatar', avatarFile);

      const response = await apiClient.patch(
        API_ENDPOINTS.USER.AVATAR_UPDATE,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error uploading avatar:', error);
      throw error;
    }
  },
};

export default profileService;

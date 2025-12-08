/**
 * Authentication Service
 * Handles all authentication-related API calls
 */
import apiClient from '../api/client';
import { API_ENDPOINTS } from '../config/api.config';

/**
 * Login user
 * @param {Object} credentials - User credentials
 * @param {string} credentials.email - User email
 * @param {string} credentials.password - User password
 * @returns {Promise} API response
 */
export const loginUser = async (credentials) => {
  try {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Register new jobseeker
 * @param {FormData} userData - User registration data (FormData for file upload)
 * @returns {Promise} API response
 */
export const registerUser = async (userData) => {
  try {
    console.log('Registering user with FormData');
    // Debug: log FormData fields
    if (userData instanceof FormData) {
      console.log('FormData contents:');
      for (let pair of userData.entries()) {
        console.log(`  ${pair[0]}: ${pair[1] instanceof File ? `[File: ${pair[1].name}]` : pair[1]}`);
      }
    }
    // Send as multipart/form-data
    const response = await apiClient.post(API_ENDPOINTS.AUTH.REGISTER_JOBSEEKER, userData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Registration error:', error.response?.data || error.message);
    // Log detailed validation errors if present
    if (error.response?.data?.message) {
      console.error('Backend validation errors:', error.response.data.message);
    }
    throw error;
  }
};

/**
 * Login recruiter/employer
 * @param {Object} credentials - Recruiter credentials
 * @param {string} credentials.email - Recruiter email
 * @param {string} credentials.password - Recruiter password
 * @returns {Promise} API response
 */
export const loginRecruiter = async (credentials) => {
  try {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN_EMPLOYER, credentials);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Register new recruiter
 * @param {Object} userData - Recruiter registration data
 * @returns {Promise} API response
 */
export const registerRecruiter = async (userData) => {
  try {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.REGISTER_RECRUITER, userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Logout user
 * @returns {Promise} API response
 * @description
 * Attempts to logout user on server-side.
 * If fails, caller should still clear client-side state.
 */
export const logoutUser = async () => {
  try {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT, {}, {
      // Ensure credentials are sent
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    // Log error for debugging but don't block logout
    console.warn('Server logout failed:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Get current user profile
 * @returns {Promise} API response
 */
export const getUserProfile = async () => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.USER.PROFILE);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Update user profile
 * @param {Object} profileData - Updated profile data
 * @returns {Promise} API response
 */
export const updateUserProfile = async (profileData) => {
  try {
    const response = await apiClient.put(API_ENDPOINTS.USER.UPDATE_PROFILE, profileData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Request password reset
 * @param {string} email - User email
 * @returns {Promise} API response
 */
export const forgotPassword = async (email) => {
  try {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Reset password with token
 * @param {Object} data - Reset password data
 * @param {string} data.token - Reset token
 * @param {string} data.password - New password
 * @returns {Promise} API response
 */
export const resetPassword = async (data) => {
  try {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Verify email with token
 * @param {string} token - Verification token from email
 * @returns {Promise} API response
 */
export const verifyEmail = async (token) => {
  try {
    const response = await apiClient.get(`${API_ENDPOINTS.AUTH.VERIFY_EMAIL}?token=${token}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Resend verification email
 * @param {string} token - Original verification token
 * @returns {Promise} API response
 */
export const resendVerificationEmail = async (token) => {
  try {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.RESEND_VERIFICATION, { token });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default {
  loginUser,
  loginRecruiter,
  registerUser,
  registerRecruiter,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerificationEmail,
};

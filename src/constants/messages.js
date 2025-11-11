/**
 * Application Messages Constants
 * Centralized messages for consistency across the app
 */

export const AUTH_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful',
  LOGIN_FAILED: 'Login failed',
  LOGOUT_SUCCESS: 'Logged out successfully',
  REGISTER_SUCCESS: 'Registration successful',
  REGISTER_FAILED: 'Registration failed',
  USER_DATA_NOT_FOUND: 'User data not found in response',
  SESSION_EXPIRED: 'Your session has expired. Please login again.',
  UNAUTHORIZED: 'You are not authorized to access this resource',
};

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
};

export const SUCCESS_MESSAGES = {
  PROFILE_UPDATED: 'Profile updated successfully',
  APPLICATION_SUBMITTED: 'Application submitted successfully',
  JOB_SAVED: 'Job saved successfully',
};

export default {
  AUTH_MESSAGES,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
};

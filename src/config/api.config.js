/**
 * API Configuration
 * Centralized API endpoints and base configuration
 */

// Base API URL - should be moved to environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

/**
 * API Endpoints
 */
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/api/auth/login`,
    REGISTER_JOBSEEKER: `${API_BASE_URL}/api/auth/register-jobseeker`,
    REGISTER_RECRUITER: `${API_BASE_URL}/api/auth/register-recruiter`,
    LOGOUT: `${API_BASE_URL}/api/auth/logout`,
    REFRESH_TOKEN: `${API_BASE_URL}/api/auth/refresh`,
    FORGOT_PASSWORD: `${API_BASE_URL}/api/auth/forgot-password`,
    RESET_PASSWORD: `${API_BASE_URL}/api/auth/reset-password`,
  },
  
  USER: {
    PROFILE: `${API_BASE_URL}/api/auth/profile`,
    UPDATE_PROFILE: `${API_BASE_URL}/api/auth/profile`,
  },
  
  JOBS: {
    LIST: `${API_BASE_URL}/api/job-posts`,
    DETAIL: (id) => `${API_BASE_URL}/api/job-posts/${id}`,
    SEARCH: `${API_BASE_URL}/api/job-posts/search`,
  },
  
  APPLICATIONS: {
    LIST: `${API_BASE_URL}/api/applications`,
    SUBMIT: `${API_BASE_URL}/api/applications`,
    DETAIL: (id) => `${API_BASE_URL}/api/applications/${id}`,
  },
  
  COMPANIES: {
    LIST: `${API_BASE_URL}/api/employer/companies`,
    DETAIL: (id) => `${API_BASE_URL}/api/employer/companies/${id}`,
  },
  
  EMPLOYER: {
    JOB_POSTS: `${API_BASE_URL}/api/employer/jobposts`,
  },
};

/**
 * Legacy endpoints - for backward compatibility
 * TODO: Migrate all components to use API_ENDPOINTS
 */
export const USER_API_ENDPOINT = `${API_BASE_URL}/api/auth`;
export const JOB_API_ENDPOINT = `${API_BASE_URL}/api/job-posts`;
export const APPLICATION_API_ENDPOINT = `${API_BASE_URL}/api/applications`;
export const COMPANY_API_ENDPOINT = `${API_BASE_URL}/api/employer/companies`;
export const EMPLOYER_POST_API_ENDPOINT = `${API_BASE_URL}/api/employer/jobposts`;

/**
 * Company API endpoints (extended)
 */
export const COMPANY = {
  GET_ALL: `${COMPANY_API_ENDPOINT}/name`,
  GET_BY_ID: `${COMPANY_API_ENDPOINT}`,
  CREATE: `${COMPANY_API_ENDPOINT}/register`,
  UPDATE: `${COMPANY_API_ENDPOINT}/update`,
};

export default API_ENDPOINTS;

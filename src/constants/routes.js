/**
 * Application Routes Constants
 * Centralized route paths for easier maintenance and type safety
 */

export const ROUTES = {
  // Public routes
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  REGISTER_RECRUITER: '/register-recruiter',
  FORGOT_PASSWORD: '/forgot-password',
  
  // Protected routes
  PROFILE: '/profile',
  EDIT_PROFILE: '/profile/edit',
  BROWSE: '/browse',
  JOBS: '/jobs',
  APPLICATIONS: '/applications',
  SAVED_ITEMS: '/saved-items',
  
  // Admin routes
  ADMIN: {
    DASHBOARD: '/admin',
    JOBS: '/admin/jobs',
    COMPANIES: '/admin/companies',
    APPLICANTS: '/admin/applicants',
  },
};

export default ROUTES;

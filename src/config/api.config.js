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
    LOGIN_EMPLOYER: `${API_BASE_URL}/api/auth/login`,
    REGISTER_JOBSEEKER: `${API_BASE_URL}/api/auth/register`,
    REGISTER_RECRUITER: `${API_BASE_URL}/api/auth/register-recruiter`,
    LOGOUT: `${API_BASE_URL}/api/auth/logout`,
    REFRESH_TOKEN: `${API_BASE_URL}/api/auth/refresh`,
    FORGOT_PASSWORD: `${API_BASE_URL}/api/auth/forgot-password`,
    RESET_PASSWORD: `${API_BASE_URL}/api/auth/reset-password`,
    VERIFY_EMAIL: `${API_BASE_URL}/api/auth/verify-email`,
    RESEND_VERIFICATION: `${API_BASE_URL}/api/auth/resend-verification`,
  },
  
  USER: {
    PROFILE: `${API_BASE_URL}/api/auth/profile`,
    UPDATE_PROFILE: `${API_BASE_URL}/api/auth/profile`,
    JOBSEEKER_PROFILE: (id) => `${API_BASE_URL}/api/jobseeker/profile/${id}`,
    AVATAR_UPDATE: `${API_BASE_URL}/api/jobseeker/profile/avatar`,
    // Experience endpoints - Try these alternatives if 404:
    // Option 1: Original (from requirements)
    EXPERIENCES: `${API_BASE_URL}/api/jobseeker/profile/experiences`,
    EXPERIENCE_DETAIL: (id) => `${API_BASE_URL}/api/jobseeker/profile/experiences/${id}`,
    // Option 2: Uncomment if backend uses different path
    // EXPERIENCES: `${API_BASE_URL}/api/experiences`,
    // EXPERIENCE_DETAIL: (id) => `${API_BASE_URL}/api/experiences/${id}`,
    // Option 3: Uncomment if no /profile in path
    // EXPERIENCES: `${API_BASE_URL}/api/jobseeker/experiences`,
    // EXPERIENCE_DETAIL: (id) => `${API_BASE_URL}/api/jobseeker/experiences/${id}`,
    // Education endpoints
    EDUCATIONS: `${API_BASE_URL}/api/jobseeker/profile/educations`,
    EDUCATION_DETAIL: (id) => `${API_BASE_URL}/api/jobseeker/profile/educations/${id}`,
    // Project endpoints
    PROJECTS: `${API_BASE_URL}/api/jobseeker/profile/projects`,
    PROJECT_DETAIL: (id) => `${API_BASE_URL}/api/jobseeker/profile/projects/${id}`,
    // Skill endpoints
    SKILLS: `${API_BASE_URL}/api/jobseeker/profile/skills`,
    SKILLS_AVAILABLE: `${API_BASE_URL}/api/jobseeker/profile/skills/available`,
    SKILL_DETAIL: (id) => `${API_BASE_URL}/api/jobseeker/profile/skills/${id}`,
  },
  
  JOBS: {
    LIST: `${API_BASE_URL}/api/job-posts`,
    DETAIL: (id) => `${API_BASE_URL}/api/job-posts/${id}`,
    SEARCH: `${API_BASE_URL}/api/job-posts/search`,
  },

  RECOMMENDATIONS: {
    BY_JOBSEEKER: (jobSeekerId) => `http://127.0.0.1:8000/recommendations/${jobSeekerId}`,
  },
  
  APPLICATIONS: {
    LIST: `${API_BASE_URL}/api/applications`,
    SUBMIT: `${API_BASE_URL}/api/applications`,
    DETAIL: (id) => `${API_BASE_URL}/api/applications/${id}`,
    JOBSEEKER_HISTORY: (jobSeekerId) => `${API_BASE_URL}/api/jobseeker/applications/history-applications/${jobSeekerId}`,
  },
  
  SAVED_JOBS: {
    SAVE: (jobId) => `${API_BASE_URL}/api/jobseeker/saved/save-job/${jobId}`,
    UNSAVE: (jobId) => `${API_BASE_URL}/api/jobseeker/saved/unsave-job/${jobId}`,
    CHECK: (jobId) => `${API_BASE_URL}/api/jobseeker/saved/check/${jobId}`,
    LIST: `${API_BASE_URL}/api/jobseeker/saved/jobs`,
  },
  
  INTERVIEWS: {
    // Jobseeker endpoints
    GET_QUESTIONS: (candidateInterviewId) => `${API_BASE_URL}/api/jobseeker/interviews/${candidateInterviewId}`,
    START: (candidateInterviewId) => `${API_BASE_URL}/api/jobseeker/interviews/${candidateInterviewId}/start`,
    SUBMIT: (candidateInterviewId) => `${API_BASE_URL}/api/jobseeker/interviews/${candidateInterviewId}/submit`,
  },
  
  COMPANIES: {
    LIST: `${API_BASE_URL}/api/employer/companies`,
    DETAIL: (id) => `${API_BASE_URL}/api/employer/companies/${id}`,
    JOBSEEKER_DETAIL: (id) => `${API_BASE_URL}/api/jobseeker/company/detail/${id}`,
    FOLLOW: (id) => `${API_BASE_URL}/api/jobseeker/company/follow-company/${id}`,
    UNFOLLOW: (id) => `${API_BASE_URL}/api/jobseeker/company/unfollow-company/${id}`,
    FOLLOWED_LIST: `${API_BASE_URL}/api/jobseeker/company/companies`,
    CHECK_FOLLOW: (id) => `${API_BASE_URL}/api/jobseeker/company/check/${id}`,
  },
  
  EMPLOYER: {
    // Job Posts endpoints
    JOB_POSTS: `${API_BASE_URL}/api/employer/job-posts`,
    JOB_POST_DETAIL: (id) => `${API_BASE_URL}/api/employer/job-posts/${id}`,
    JOB_POST_STATISTICS: `${API_BASE_URL}/api/employer/job-posts/statistics`,
    
    // Legacy endpoint (backward compatibility)
    LEGACY_JOB_POSTS: `${API_BASE_URL}/api/employer/jobposts`,
    
    // Interview endpoints for Employer
    INTERVIEWS: {
      LIST: `${API_BASE_URL}/api/employer/interviews`,
      CREATE: `${API_BASE_URL}/api/employer/interviews`,
      DETAIL: (interviewId) => `${API_BASE_URL}/api/employer/interviews/${interviewId}`,
      UPDATE: (interviewId) => `${API_BASE_URL}/api/employer/interviews/${interviewId}`,
      DELETE: (interviewId) => `${API_BASE_URL}/api/employer/interviews/${interviewId}`,
      ATTACH_JOBPOST: (interviewId) => `${API_BASE_URL}/api/employer/interviews/${interviewId}/attach-jobpost`,
      DETACH_JOBPOST: (interviewId) => `${API_BASE_URL}/api/employer/interviews/${interviewId}/detach-jobpost`,
      STATISTICS: (interviewId) => `${API_BASE_URL}/api/employer/interviews/${interviewId}/statistics`,
      
      // Questions
      QUESTIONS: {
        LIST: (interviewId) => `${API_BASE_URL}/api/employer/interviews/${interviewId}/questions`,
        CREATE: (interviewId) => `${API_BASE_URL}/api/employer/interviews/${interviewId}/questions`,
        UPDATE: (interviewId, questionId) => `${API_BASE_URL}/api/employer/interviews/${interviewId}/questions/${questionId}`,
        DELETE: (interviewId, questionId) => `${API_BASE_URL}/api/employer/interviews/${interviewId}/questions/${questionId}`,
      },
      
      // Assignments & Candidates
      ASSIGN: (interviewId) => `${API_BASE_URL}/api/employer/interviews/${interviewId}/assign`,
      CANDIDATES: (interviewId) => `${API_BASE_URL}/api/employer/interviews/${interviewId}/candidates`,
      CANDIDATE_ANSWERS: (interviewId, candidateInterviewId) => `${API_BASE_URL}/api/employer/interviews/${interviewId}/candidates/${candidateInterviewId}/answers`,
      GRADE_ANSWER: (interviewId, candidateInterviewId, answerId) => `${API_BASE_URL}/api/employer/interviews/${interviewId}/candidates/${candidateInterviewId}/answers/${answerId}/grade`,
    },
    // Employer profile endpoints
    PROFILE: {
      GET: (id) => `${API_BASE_URL}/api/employer/profile/${id}`,
      UPDATE: `${API_BASE_URL}/api/employer/profile`,
      AVATAR_UPDATE: `${API_BASE_URL}/api/employer/profile/avatar`,
      DELETE: `${API_BASE_URL}/api/employer/profile`,
      COMPANY_UPDATE: (companyId) => `${API_BASE_URL}/api/employer/companies/${companyId}`,
      COMPANY_AVATAR_UPDATE: (companyId) => `${API_BASE_URL}/api/employer/companies/${companyId}/avatar`
    },
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

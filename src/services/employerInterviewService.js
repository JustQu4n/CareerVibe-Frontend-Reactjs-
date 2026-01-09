/**
 * Employer Interview Service
 * Xử lý tất cả API calls liên quan đến interview management cho employer
 */
import apiClient from '@/api/client';
import API_ENDPOINTS from '@/config/api.config';

// ========================================
// Interview CRUD
// ========================================

/**
 * Lấy danh sách interviews của employer
 */
export const getInterviews = async () => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.EMPLOYER.INTERVIEWS.LIST);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch interviews');
  }
};

/**
 * Tạo interview mới
 */
export const createInterview = async (data) => {
  try {
    const response = await apiClient.post(API_ENDPOINTS.EMPLOYER.INTERVIEWS.CREATE, data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create interview');
  }
};

/**
 * Xem chi tiết interview (với questions và assignments)
 */
export const getInterviewDetail = async (interviewId) => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.EMPLOYER.INTERVIEWS.DETAIL(interviewId));
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch interview details');
  }
};

/**
 * Cập nhật interview
 */
export const updateInterview = async (interviewId, data) => {
  try {
    const response = await apiClient.patch(API_ENDPOINTS.EMPLOYER.INTERVIEWS.UPDATE(interviewId), data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update interview');
  }
};

/**
 * Xóa interview
 */
export const deleteInterview = async (interviewId) => {
  try {
    const response = await apiClient.delete(API_ENDPOINTS.EMPLOYER.INTERVIEWS.DELETE(interviewId));
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete interview');
  }
};

/**
 * Gán interview cho job post
 */
export const attachInterviewToJobPost = async (interviewId, jobPostId) => {
  try {
    const response = await apiClient.post(
      API_ENDPOINTS.EMPLOYER.INTERVIEWS.ATTACH_JOBPOST(interviewId),
      { job_post_id: jobPostId }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to attach interview to job post');
  }
};

/**
 * Gỡ interview khỏi job post
 */
export const detachInterviewFromJobPost = async (interviewId) => {
  try {
    const response = await apiClient.post(API_ENDPOINTS.EMPLOYER.INTERVIEWS.DETACH_JOBPOST(interviewId));
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to detach interview from job post');
  }
};

/**
 * Lấy thống kê interview
 */
export const getInterviewStatistics = async (interviewId) => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.EMPLOYER.INTERVIEWS.STATISTICS(interviewId));
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch interview statistics');
  }
};

// ========================================
// Questions Management
// ========================================

/**
 * Lấy danh sách câu hỏi
 */
export const getQuestions = async (interviewId) => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.EMPLOYER.INTERVIEWS.QUESTIONS.LIST(interviewId));
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch questions');
  }
};

/**
 * Tạo câu hỏi mới
 */
export const createQuestion = async (interviewId, data) => {
  try {
    const response = await apiClient.post(
      API_ENDPOINTS.EMPLOYER.INTERVIEWS.QUESTIONS.CREATE(interviewId),
      data
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create question');
  }
};

/**
 * Cập nhật câu hỏi
 */
export const updateQuestion = async (interviewId, questionId, data) => {
  try {
    const response = await apiClient.patch(
      API_ENDPOINTS.EMPLOYER.INTERVIEWS.QUESTIONS.UPDATE(interviewId, questionId),
      data
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update question');
  }
};

/**
 * Xóa câu hỏi
 */
export const deleteQuestion = async (interviewId, questionId) => {
  try {
    const response = await apiClient.delete(
      API_ENDPOINTS.EMPLOYER.INTERVIEWS.QUESTIONS.DELETE(interviewId, questionId)
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete question');
  }
};

/**
 * Classify question criteria using AI
 * POST /employer/interviews/:interviewId/questions/:questionId/classify-criteria
 */
export const classifyQuestionCriteria = async (interviewId, questionId) => {
  try {
    const url = `/api/employer/interviews/${interviewId}/questions/${questionId}/classify-criteria`;
    const response = await apiClient.post(url);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to classify question criteria');
  }
};

// ========================================
// Assignments & Candidates
// ========================================

/**
 * Gán interview cho ứng viên
 */
export const assignInterview = async (interviewId, data) => {
  try {
    const response = await apiClient.post(
      API_ENDPOINTS.EMPLOYER.INTERVIEWS.ASSIGN(interviewId),
      data
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to assign interview');
  }
};

/**
 * Mời candidate bằng email (direct invitation)
 */
export const inviteCandidate = async (interviewId, data) => {
  try {
    const response = await apiClient.post(
      API_ENDPOINTS.EMPLOYER.INTERVIEWS.INVITE_CANDIDATE(interviewId),
      data
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to invite candidate');
  }
};

/**
 * Lấy danh sách ứng viên đã làm interview
 */
export const getCandidates = async (interviewId) => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.EMPLOYER.INTERVIEWS.CANDIDATES(interviewId));
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch candidates');
  }
};

/**
 * Xem câu trả lời của ứng viên
 */
export const getCandidateAnswers = async (interviewId, candidateInterviewId) => {
  try {
    const response = await apiClient.get(
      API_ENDPOINTS.EMPLOYER.INTERVIEWS.CANDIDATE_ANSWERS(interviewId, candidateInterviewId)
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch candidate answers');
  }
};

/**
 * Send congratulations email to candidate
 * POST /api/employer/interviews/{interviewId}/candidates/{candidateInterviewId}/send-congratulations
 */
export const sendCongratulations = async (interviewId, candidateInterviewId) => {
  try {
    const url = `/api/employer/interviews/${interviewId}/candidates/${candidateInterviewId}/send-congratulations`;
    const response = await apiClient.post(url);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to send congratulations email');
  }
};

/**
 * Get candidate behavior logs
 * GET /api/employer/interviews/{interviewId}/candidates/{candidateInterviewId}/behavior-logs
 */
export const getBehaviorLogs = async (interviewId, candidateInterviewId) => {
  try {
    const response = await apiClient.get(
      `/api/employer/interviews/${interviewId}/candidates/${candidateInterviewId}/behavior-logs`
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch behavior logs');
  }
};

/**
 * Get behavior summary for all candidates in an interview
 * GET /api/employer/interviews/{interviewId}/behavior-summary
 */
export const getBehaviorSummary = async (interviewId) => {
  try {
    const response = await apiClient.get(
      `/api/employer/interviews/${interviewId}/behavior-summary`
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch behavior summary');
  }
};

/**
 * Chấm điểm câu trả lời
 */
export const gradeAnswer = async (interviewId, candidateInterviewId, answerId, data) => {
  try {
    const response = await apiClient.patch(
      API_ENDPOINTS.EMPLOYER.INTERVIEWS.GRADE_ANSWER(interviewId, candidateInterviewId, answerId),
      data
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to grade answer');
  }
};

/**
 * Chấm điểm interview bằng AI
 */
export const scoreInterviewWithAI = async (candidateInterviewId) => {
  try {
    const response = await apiClient.post(
      API_ENDPOINTS.EMPLOYER.INTERVIEWS.AI_SCORE,
      { candidateInterviewId }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to score interview with AI');
  }
};

/**
 * Lấy kết quả đánh giá AI
 */
export const getAIEvaluation = async (candidateInterviewId) => {
  try {
    const response = await apiClient.get(
      API_ENDPOINTS.EMPLOYER.INTERVIEWS.AI_EVALUATION(candidateInterviewId)
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch AI evaluation');
  }
};

export default {
  // Interview CRUD
  getInterviews,
  createInterview,
  getInterviewDetail,
  updateInterview,
  deleteInterview,
  attachInterviewToJobPost,
  detachInterviewFromJobPost,
  getInterviewStatistics,
  
  // Questions
  getQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  
  // Assignments & Grading
  assignInterview,
  inviteCandidate,
  getCandidates,
  getCandidateAnswers,
  gradeAnswer,
  
  // AI Scoring
  scoreInterviewWithAI,
  getAIEvaluation,
  sendCongratulations,
  getBehaviorLogs,
  getBehaviorSummary,
  classifyQuestionCriteria,
};

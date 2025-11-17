/**
 * Company Service
 * Handles all company-related API calls
 */
import apiClient from '@/api/client';
import { API_ENDPOINTS } from '@/config/api.config';

/**
 * Get all companies by name
 * @returns {Promise<Array>} List of companies
 */
export const getAllCompanies = async () => {
  const response = await apiClient.get(API_ENDPOINTS.COMPANY.GET_ALL);
  return response.data;
};

/**
 * Search companies by name
 * @param {string} searchTerm - Search term
 * @returns {Promise<Array>} Filtered companies
 */
export const searchCompaniesByName = async (searchTerm) => {
  const response = await getAllCompanies();
  const allCompanies = response.data || [];
  
  if (!searchTerm || searchTerm.length < 2) {
    return [];
  }
  
  return allCompanies.filter((company) =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
};

/**
 * Get company by ID
 * @param {string} companyId - Company ID
 * @returns {Promise<Object>} Company data
 */
export const getCompanyById = async (companyId) => {
  const response = await apiClient.get(`${API_ENDPOINTS.COMPANY.GET_BY_ID}/${companyId}`);
  return response.data;
};

/**
 * Get company details with job posts (for jobseekers)
 * @param {string} companyId - Company ID
 * @returns {Promise<Object>} Company details with job posts
 */
export const getCompanyDetails = async (companyId) => {
  const token = localStorage.getItem('accessToken');
  const response = await apiClient.get(
    `${API_ENDPOINTS.COMPANIES.JOBSEEKER_DETAIL(companyId)}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  
  // API returns { data: {...} } structure
  if (response.data && response.data.data) {
    const companyData = response.data.data;
    
    // Company info to attach to each job
    const companyInfo = {
      company_id: companyData.company_id,
      name: companyData.name,
      industry: companyData.industry,
      location: companyData.location,
      logo_url: companyData.logo_url,
    };
    
    // Attach company info to each job post for JobCard compatibility
    const jobPostsWithCompany = (companyData.jobPosts || []).map(job => ({
      ...job,
      company: companyInfo,
    }));
    
    // Transform to match expected format
    return {
      company: {
        company_id: companyData.company_id,
        name: companyData.name,
        industry: companyData.industry,
        description: companyData.description,
        location: companyData.location,
        website: companyData.website,
        logo_url: companyData.logo_url,
        created_at: companyData.created_at,
        updated_at: companyData.updated_at,
      },
      jobPosts: jobPostsWithCompany,
      activeJobPostsCount: companyData.activeJobPostsCount || 0,
    };
  } else {
    throw new Error('Failed to fetch company details');
  }
};

export default {
  getAllCompanies,
  searchCompaniesByName,
  getCompanyById,
  getCompanyDetails,
};

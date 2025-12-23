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
      cover_url: companyData.cover_url || companyData.cover || companyData.cover_image || null,
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
        overview: companyData.overview,
        benefits: companyData.benefits,
        vision: companyData.vision,
        mission: companyData.mission,
        innovation: companyData.innovation,
        sustainability: companyData.sustainability,
        location: companyData.location,
        website: companyData.website,
        employees_range: companyData.employees_range,
        founded_at: companyData.founded_at,
        // map to common keys used by UI
        logo_url: companyData.logo_url,
        cover_url: companyData.cover_url || companyData.cover || companyData.cover_image || null,
        email: companyData.contact_email || companyData.contact_email_address || null,
        phone: companyData.contact_phone || null,
        address: companyData.contact_address || null,
        created_at: companyData.founded_at || companyData.created_at,
        updated_at: companyData.updated_at,
      },
      jobPosts: jobPostsWithCompany,
      activeJobPostsCount: companyData.activeJobPostsCount || 0,
    };
  } else {
    throw new Error('Failed to fetch company details');
  }
};

/**
 * Jobseeker: search companies by keyword (backend endpoint)
 * @param {string} keyword
 */
export const jobseekerSearchCompanies = async (keyword) => {
  if (!keyword || String(keyword).trim().length < 1) return { data: [] };
  const response = await apiClient.get('/api/jobseeker/company/search', {
    params: { keyword },
  });
  return response.data || { data: [] };
};

/**
 * Jobseeker: list companies (backend endpoint)
 */
export const jobseekerListCompanies = async () => {
  const response = await apiClient.get('/api/jobseeker/company/list');
  return response.data || { data: [] };
};

export default {
  getAllCompanies,
  searchCompaniesByName,
  getCompanyById,
  getCompanyDetails,
};

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

export default {
  getAllCompanies,
  searchCompaniesByName,
  getCompanyById,
};

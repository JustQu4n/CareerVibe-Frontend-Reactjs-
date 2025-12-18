/**
 * Employer Profile Service
 * Handles API calls for employer profile (admin module)
 */
import apiClient from '@/api/client';
import { API_ENDPOINTS } from '@/config/api.config';

const BASE = API_ENDPOINTS.EMPLOYER;

const employerService = {
  // Get employer profile by id (public)
  getProfile: async (id) => {
    const url = BASE.PROFILE.GET(id);
    const res = await apiClient.get(url);
    return res.data;
  },

  // Update profile (position, company_id)
  updateProfile: async (payload) => {
    const res = await apiClient.put(BASE.PROFILE.UPDATE, payload);
    return res.data;
  },

  // Patch avatar using multipart/form-data
  updateAvatar: async (formData) => {
    const res = await apiClient.patch(BASE.PROFILE.AVATAR_UPDATE, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  // Delete employer profile
  deleteProfile: async () => {
    const res = await apiClient.delete(BASE.PROFILE.DELETE);
    return res.data;
  },

  // Update company information
  updateCompany: async (companyId, payload) => {
    const url = BASE.PROFILE.COMPANY_UPDATE(companyId);
    const res = await apiClient.put(url, payload);
    return res.data;
  },

  // Update company avatar/logo
  updateCompanyAvatar: async (companyId, formData) => {
    const url = BASE.PROFILE.COMPANY_AVATAR_UPDATE(companyId);
    const res = await apiClient.patch(url, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  }
  ,
  // Get dashboard stats for employer
  getDashboardStats: async () => {
    // Endpoint requires Authorization header handled by apiClient
    const url = BASE.STATS.DASHBOARD;
    const res = await apiClient.get(url);
    return res.data;
  }
};

export default employerService;

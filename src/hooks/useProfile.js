/**
 * Custom hook for managing profile data and operations
 * Centralized profile state management and data fetching logic
 */

import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import apiClient from '@/api/client';
import { API_ENDPOINTS } from '@/config/api.config';
import { toast } from 'react-toastify';

/**
 * useProfile hook
 * @returns {Object} Profile data and operations
 */
export const useProfile = () => {
  const { user: authUser } = useSelector((store) => store.auth);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * Fetch profile data from API
   * Memoized to prevent unnecessary re-fetches
   */
  const fetchProfile = useCallback(async () => {
    if (!authUser?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await apiClient.get(
        API_ENDPOINTS.USER.JOBSEEKER_PROFILE(authUser.id)
      );

      if (response.data?.data) {
        setProfileData(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  }, [authUser?.id]);

  /**
   * Refresh profile data
   * Used after CRUD operations on profile sections
   */
  const refreshProfile = useCallback(async () => {
    if (!authUser?.id) return;

    try {
      const response = await apiClient.get(
        API_ENDPOINTS.USER.JOBSEEKER_PROFILE(authUser.id)
      );

      if (response.data?.data) {
        setProfileData(response.data.data);
      }
    } catch (error) {
      console.error('Error refreshing profile:', error);
    }
  }, [authUser?.id]);

  // Fetch profile on mount or when authUser changes
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    profileData,
    loading,
    authUser,
    refreshProfile,
  };
};

export default useProfile;

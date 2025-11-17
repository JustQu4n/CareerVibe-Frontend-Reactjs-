import { useState, useEffect, useCallback } from 'react';
import { followCompany, unfollowCompany, checkCompanyFollowed } from '@/services/companyFollowService';
import { toast } from 'react-toastify';

/**
 * useCompanyFollow Hook
 * Custom hook để quản lý follow/unfollow company
 * 
 * @param {string} companyId - ID của company
 * @returns {Object} { isFollowed, loading, toggleFollow, checkFollowStatus }
 */
const useCompanyFollow = (companyId) => {
  const [isFollowed, setIsFollowed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);

  /**
   * Check if company is followed
   */
  const checkFollowStatus = useCallback(async () => {
    if (!companyId) return;

    try {
      setCheckingStatus(true);
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        setCheckingStatus(false);
        return;
      }

      const response = await checkCompanyFollowed(companyId, token);
      setIsFollowed(response.isFollowed || false);
    } catch (error) {
      console.error('Error checking follow status:', error);
      setIsFollowed(false);
    } finally {
      setCheckingStatus(false);
    }
  }, [companyId]);

  /**
   * Toggle follow/unfollow
   */
  const toggleFollow = useCallback(async () => {
    const token = localStorage.getItem('accessToken');

    if (!token) {
      toast.error('Please login to follow companies');
      return;
    }

    try {
      setLoading(true);

      if (isFollowed) {
        // Unfollow
        await unfollowCompany(companyId, token);
        setIsFollowed(false);
        toast.success('Company unfollowed successfully');
      } else {
        // Follow
        await followCompany(companyId, token);
        setIsFollowed(true);
        toast.success('Company followed successfully');
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update follow status';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [companyId, isFollowed]);

  // Check follow status on mount
  useEffect(() => {
    checkFollowStatus();
  }, [checkFollowStatus]);

  return {
    isFollowed,
    loading,
    checkingStatus,
    toggleFollow,
    checkFollowStatus,
  };
};

export default useCompanyFollow;

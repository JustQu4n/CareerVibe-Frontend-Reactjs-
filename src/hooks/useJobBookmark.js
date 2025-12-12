import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '@/api/client';
import { toast } from 'sonner';
import { API_ENDPOINTS } from '@/config/api.config';

/**
 * useJobBookmark Hook
 * Custom hook để quản lý bookmark/save job
 * 
 * @param {string} jobId - ID của job
 * @param {Object} user - Thông tin user hiện tại
 * @returns {Object} - { bookmarked, toggleBookmark, loading }
 */
const useJobBookmark = (jobId, user) => {
  const navigate = useNavigate();
  const [bookmarked, setBookmarked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkSavedStatus = async () => {
      if (!user || !jobId) return;

      try {
        const response = await apiClient.get(API_ENDPOINTS.SAVED_JOBS.CHECK(jobId));
        setBookmarked(response.data.isSaved || false);
      } catch (err) {
        setBookmarked(false);
      }
    };

    checkSavedStatus();
  }, [jobId, user]);

  const toggleBookmark = useCallback(async () => {
    if (!user) {
      toast.error('Please login to save jobs');
      navigate('/login', { state: { from: `/view-job-detail/${jobId}` } });
      return;
    }

    if (loading) return;

      try {
        setLoading(true);

        if (bookmarked) {
          await apiClient.delete(API_ENDPOINTS.SAVED_JOBS.UNSAVE(jobId));

          setBookmarked(false);
          toast.success('Job removed from saved list');
        } else {
          await apiClient.post(API_ENDPOINTS.SAVED_JOBS.SAVE(jobId), {});

          setBookmarked(true);
          toast.success('Job saved successfully');
        }
      } catch (err) {
        const errorMessage = err.response?.data?.message || 'Failed to update saved jobs';
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
  }, [jobId, user, bookmarked, navigate, loading]);

  return { bookmarked, toggleBookmark, loading };
};

export default useJobBookmark;

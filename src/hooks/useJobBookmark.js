import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
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
        const token = localStorage.getItem('accessToken');
        const response = await axios.get(API_ENDPOINTS.SAVED_JOBS.CHECK(jobId), {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
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
      const token = localStorage.getItem('accessToken');

      if (bookmarked) {
        await axios.delete(API_ENDPOINTS.SAVED_JOBS.UNSAVE(jobId), {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });

        setBookmarked(false);
        toast.success('Job removed from saved list');
      } else {
        await axios.post(API_ENDPOINTS.SAVED_JOBS.SAVE(jobId), {}, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });

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

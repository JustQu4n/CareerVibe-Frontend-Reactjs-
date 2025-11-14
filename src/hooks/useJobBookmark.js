import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';

/**
 * useJobBookmark Hook
 * Custom hook để quản lý bookmark/save job
 * 
 * @param {string} jobId - ID của job
 * @param {Object} user - Thông tin user hiện tại
 * @returns {Object} - { bookmarked, toggleBookmark }
 */
const useJobBookmark = (jobId, user) => {
  const navigate = useNavigate();
  const [bookmarked, setBookmarked] = useState(false);

  /**
   * Toggle bookmark status
   * Lưu hoặc bỏ lưu job
   */
  const toggleBookmark = useCallback(async () => {
    // Kiểm tra user đã login chưa
    if (!user) {
      toast.error('Please login to save jobs');
      navigate('/login', { state: { from: `/view-job-detail/${jobId}` } });
      return;
    }

    try {
      const token = localStorage.getItem('token');

      if (bookmarked) {
        // Unsave job
        await axios.delete(
          `http://localhost:5000/api/jobseeker/saved/unsave-job/${jobId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );

        setBookmarked(false);
        toast.success('Job removed from saved list');
      } else {
        // Save job
        await axios.post(
          `http://localhost:5000/api/jobseeker/saved/save-job`,
          { jobId },
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );

        setBookmarked(true);
        toast.success('Job saved successfully');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to update saved jobs';
      toast.error(errorMessage);
    }
  }, [jobId, user, bookmarked, navigate]);

  return { bookmarked, toggleBookmark };
};

export default useJobBookmark;

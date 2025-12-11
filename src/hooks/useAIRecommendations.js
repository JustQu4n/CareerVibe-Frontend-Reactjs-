/**
 * Custom Hook: useAIRecommendations
 * Fetches AI-powered job recommendations from Python recommendation service
 */
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { API_ENDPOINTS } from '@/config/api.config';
import apiClient from '@/api/client';

const useAIRecommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const { user } = useSelector((store) => store.auth);
  const jobSeekerId = user?.job_seeker_id || user?.jobSeekerId;

  useEffect(() => {
    const fetchRecommendations = async () => {
      // Only fetch if user is logged in and is a jobseeker
      if (!jobSeekerId || user?.role === 'Recruiter') {
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const res = await apiClient.get(API_ENDPOINTS.RECOMMENDATIONS.BY_JOBSEEKER(jobSeekerId));
        setRecommendations(res.data || []);
      } catch (err) {
        console.error('Error fetching AI recommendations:', err);
        const message = err?.response?.data?.message || err.message || 'Failed to load recommendations';
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, [jobSeekerId, user?.role]);

  return {
    recommendations,
    isLoading,
    error,
    hasRecommendations: recommendations.length > 0,
  };
};

export default useAIRecommendations;

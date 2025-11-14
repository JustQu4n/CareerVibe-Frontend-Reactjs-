import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { setSingleJob } from '@/redux/jobSlice';
import { JOB_API_ENDPOINT } from '@/utils/data';

/**
 * useJobDetails Hook
 * Custom hook để fetch và quản lý job details
 * 
 * @param {string} jobId - ID của job cần fetch
 * @returns {Object} - { loading, error, job }
 */
const useJobDetails = (jobId) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [job, setJob] = useState(null);

  useEffect(() => {
    if (!jobId) {
      setError('Job ID is required');
      return;
    }

    const fetchJobDetails = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(`${JOB_API_ENDPOINT}/${jobId}`, {
          withCredentials: true,
        });

        if (response.data.success) {
          const jobData = response.data.job;
          // Update Redux store
          dispatch(setSingleJob(jobData));
          // Update local state
          setJob(jobData);
        } else {
          setError('Failed to fetch job details.');
        }
      } catch (err) {
        const errorMessage = err.response?.data?.message || err.message || 'An error occurred.';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [jobId, dispatch]);

  return { loading, error, job };
};

export default useJobDetails;

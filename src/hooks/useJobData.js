import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * useJobData Hook
 * Quản lý job data từ location state hoặc Redux
 * 
 * @param {Object} singleJob - Single job từ Redux
 * @returns {Object} Job data
 */
const useJobData = (singleJob) => {
  const location = useLocation();
  
  const [jobData, setJobData] = useState({
    title: "",
    company: { name: "" }
  });

  useEffect(() => {
    // Priority: location state > Redux singleJob
    if (location.state?.jobData) {
      setJobData(location.state.jobData);
    } else if (singleJob) {
      setJobData({
        title: singleJob.title,
        company: { name: singleJob.company_id?.name || "Company" }
      });
    }
  }, [location.state, singleJob]);

  return jobData;
};

export default useJobData;

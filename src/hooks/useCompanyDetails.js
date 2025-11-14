import { useState, useEffect } from 'react';
import { getCompanyDetails } from '@/services/companyService';

/**
 * useCompanyDetails Hook
 * Custom hook để fetch và quản lý company details
 * 
 * @param {string} companyId - ID của company
 * @returns {Object} { companyData, loading, error, refetch }
 */
const useCompanyDetails = (companyId) => {
  const [companyData, setCompanyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCompanyDetails = async () => {
    if (!companyId) {
      setError('Company ID is required');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const data = await getCompanyDetails(companyId);
      setCompanyData(data);
    } catch (err) {
      setError(err.message || 'An error occurred while fetching company details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanyDetails();
  }, [companyId]);

  return {
    companyData,
    loading,
    error,
    refetch: fetchCompanyDetails
  };
};

export default useCompanyDetails;

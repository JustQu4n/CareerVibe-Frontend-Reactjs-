import { useState, useMemo, useCallback } from 'react';
import { filterApplications } from '@/utils/applicationHelpers';

/**
 * useApplicationFilters Hook
 * Custom hook để quản lý filtering và searching applications
 * 
 * @param {Array} applications - Danh sách applications
 * @returns {Object} Filter state và handlers
 */
const useApplicationFilters = (applications = []) => {
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Filtered applications - memoized để tránh re-calculate
  const filteredApplications = useMemo(() => {
    return filterApplications(applications, filterStatus, searchTerm);
  }, [applications, filterStatus, searchTerm]);

  // Handler để thay đổi filter status
  const handleFilterChange = useCallback((status) => {
    setFilterStatus(status);
  }, []);

  // Handler để thay đổi search term
  const handleSearchChange = useCallback((term) => {
    setSearchTerm(term);
  }, []);

  // Handler để clear tất cả filters
  const handleClearFilters = useCallback(() => {
    setFilterStatus('all');
    setSearchTerm('');
  }, []);

  return {
    filterStatus,
    searchTerm,
    filteredApplications,
    handleFilterChange,
    handleSearchChange,
    handleClearFilters,
  };
};

export default useApplicationFilters;

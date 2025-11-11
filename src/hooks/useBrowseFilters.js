/**
 * Custom Hook: useBrowseFilters
 * Manages all filter state and logic for the Browse page
 */

import { useState, useCallback, useMemo, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import { DEFAULT_FILTERS, PAGINATION_CONFIG } from '@/constants/browse.constants';
import { filterJobs, sortJobs, countAppliedFilters } from '@/utils/jobFilters';

/**
 * Hook for managing browse filters and job filtering logic
 * @param {Array} allJobs - All available jobs from Redux store
 * @returns {Object} Filter state and handlers
 */
const useBrowseFilters = (allJobs = []) => {
  const dispatch = useDispatch();

  // Filter states
  const [search, setSearch] = useState(DEFAULT_FILTERS.search);
  const [location, setLocation] = useState(DEFAULT_FILTERS.location);
  const [jobType, setJobType] = useState(DEFAULT_FILTERS.jobType);
  const [salary, setSalary] = useState(DEFAULT_FILTERS.salary);
  const [experience, setExperience] = useState(DEFAULT_FILTERS.experience);
  const [datePosted, setDatePosted] = useState(DEFAULT_FILTERS.datePosted);
  const [sortBy, setSortBy] = useState(DEFAULT_FILTERS.sortBy);
  
  // UI states
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('list');
  const [currentPage, setCurrentPage] = useState(1);

  /**
   * Create filters object
   */
  const filters = useMemo(
    () => ({
      search,
      location,
      jobType,
      salary,
      experience,
      datePosted,
      sortBy,
    }),
    [search, location, jobType, salary, experience, datePosted, sortBy]
  );

  /**
   * Filter and sort jobs
   */
  const processedJobs = useMemo(() => {
    const filtered = filterJobs(allJobs, filters);
    return sortJobs(filtered, sortBy);
  }, [allJobs, filters, sortBy]);

  /**
   * Paginated jobs
   */
  const paginatedJobs = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGINATION_CONFIG.ITEMS_PER_PAGE;
    const endIndex = startIndex + PAGINATION_CONFIG.ITEMS_PER_PAGE;
    return processedJobs.slice(startIndex, endIndex);
  }, [processedJobs, currentPage]);

  /**
   * Count applied filters
   */
  const appliedFiltersCount = useMemo(
    () => countAppliedFilters(filters),
    [filters]
  );

  /**
   * Calculate total pages
   */
  const totalPages = useMemo(
    () => Math.ceil(processedJobs.length / PAGINATION_CONFIG.ITEMS_PER_PAGE),
    [processedJobs.length]
  );

  /**
   * Reset all filters to default
   */
  const resetFilters = useCallback(() => {
    setSearch(DEFAULT_FILTERS.search);
    setLocation(DEFAULT_FILTERS.location);
    setJobType(DEFAULT_FILTERS.jobType);
    setSalary(DEFAULT_FILTERS.salary);
    setExperience(DEFAULT_FILTERS.experience);
    setDatePosted(DEFAULT_FILTERS.datePosted);
    setSortBy(DEFAULT_FILTERS.sortBy);
    setCurrentPage(1);
  }, []);

  /**
   * Toggle filters panel
   */
  const toggleFilters = useCallback(() => {
    setShowFilters((prev) => !prev);
  }, []);

  /**
   * Change view mode (list/grid)
   */
  const changeViewMode = useCallback((mode) => {
    setViewMode(mode);
  }, []);

  /**
   * Handle pagination
   */
  const goToPage = useCallback((page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const nextPage = useCallback(() => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  }, [currentPage, totalPages, goToPage]);

  const prevPage = useCallback(() => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  }, [currentPage, goToPage]);

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      dispatch(setSearchedQuery(''));
    };
  }, [dispatch]);

  /**
   * Reset page when filters change
   */
  useEffect(() => {
    setCurrentPage(1);
  }, [search, location, jobType, salary, experience, datePosted, sortBy]);

  return {
    // Filter states
    search,
    location,
    jobType,
    salary,
    experience,
    datePosted,
    sortBy,
    
    // Filter setters
    setSearch,
    setLocation,
    setJobType,
    setSalary,
    setExperience,
    setDatePosted,
    setSortBy,
    
    // UI states
    showFilters,
    viewMode,
    
    // UI handlers
    toggleFilters,
    changeViewMode,
    resetFilters,
    
    // Processed data
    filteredJobs: paginatedJobs,
    totalJobs: processedJobs.length,
    appliedFiltersCount,
    
    // Pagination
    currentPage,
    totalPages,
    goToPage,
    nextPage,
    prevPage,
  };
};

export default useBrowseFilters;

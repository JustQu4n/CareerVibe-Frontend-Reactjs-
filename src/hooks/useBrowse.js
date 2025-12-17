/**
 * Custom Hook: useBrowse
 * Manages job browsing with server-side filtering, search, and pagination
 */

import { useState, useEffect, useCallback } from 'react';
import apiClient from '@/api/client';

const ITEMS_PER_PAGE = 12;

/**
 * Hook for browse page with server-side filtering
 */
const useBrowse = () => {
  // Filter states
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState('');
  const [level, setLevel] = useState('');
  const [experience, setExperience] = useState('');
  const [salaryRange, setSalaryRange] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [companyId, setCompanyId] = useState('');
  const [skills, setSkills] = useState([]);
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('DESC');
  
  // Pagination
  const [page, setPage] = useState(1);
  const [limit] = useState(ITEMS_PER_PAGE);
  
  // Data states
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Meta data
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);
  
  // UI states
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('list');

  /**
   * Build query parameters for API
   */
  const buildQueryParams = useCallback(() => {
    const params = {
      page,
      limit,
    };

    if (keyword) params.keyword = keyword;
    if (location) params.location = location;
    if (jobType) params.job_type = jobType;
    if (level) params.level = level;
    if (experience) params.experience = experience;
    if (salaryRange) params.salary_range = salaryRange;
    if (categoryId) params.category_id = categoryId;
    if (companyId) params.company_id = companyId;
    if (skills.length > 0) params.skills = skills.join(',');
    if (sortBy) params.sort_by = sortBy;
    if (sortOrder) params.sort_order = sortOrder;

    return params;
  }, [keyword, location, jobType, level, experience, salaryRange, categoryId, companyId, skills, sortBy, sortOrder, page, limit]);

  /**
   * Fetch jobs from API
   */
  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = buildQueryParams();
      const response = await apiClient.get('/api/jobseeker/job-posts', { params });

      const data = response.data?.data || [];
      const meta = response.data?.meta || {};

      setJobs(Array.isArray(data) ? data : []);
      setTotal(meta.total || 0);
      setTotalPages(meta.totalPages || 0);
      setHasNextPage(meta.hasNextPage || false);
      setHasPreviousPage(meta.hasPreviousPage || false);
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setError(err.response?.data?.message || 'Failed to load jobs');
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }, [buildQueryParams]);

  /**
   * Fetch jobs when filters or page change
   */
  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  /**
   * Reset filters
   */
  const resetFilters = useCallback(() => {
    setKeyword('');
    setLocation('');
    setJobType('');
    setLevel('');
    setExperience('');
    setSalaryRange('');
    setCategoryId('');
    setCompanyId('');
    setSkills([]);
    setSortBy('created_at');
    setSortOrder('DESC');
    setPage(1);
  }, []);

  /**
   * Apply search
   */
  const handleSearch = useCallback((searchKeyword, searchLocation) => {
    setKeyword(searchKeyword);
    setLocation(searchLocation);
    setPage(1); // Reset to first page
  }, []);

  /**
   * Toggle filters panel
   */
  const toggleFilters = useCallback(() => {
    setShowFilters(prev => !prev);
  }, []);

  /**
   * Change view mode
   */
  const changeViewMode = useCallback((mode) => {
    setViewMode(mode);
  }, []);

  /**
   * Pagination handlers
   */
  const goToPage = useCallback((pageNumber) => {
    setPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const nextPage = useCallback(() => {
    if (hasNextPage) {
      setPage(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [hasNextPage]);

  const prevPage = useCallback(() => {
    if (hasPreviousPage) {
      setPage(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [hasPreviousPage]);

  /**
   * Count applied filters
   */
  const appliedFiltersCount = useCallback(() => {
    let count = 0;
    if (keyword) count++;
    if (location) count++;
    if (jobType) count++;
    if (level) count++;
    if (experience) count++;
    if (salaryRange) count++;
    if (categoryId) count++;
    if (companyId) count++;
    if (skills.length > 0) count++;
    return count;
  }, [keyword, location, jobType, level, experience, salaryRange, categoryId, companyId, skills]);

  return {
    // Filter states
    keyword,
    location,
    jobType,
    level,
    experience,
    salaryRange,
    categoryId,
    companyId,
    skills,
    sortBy,
    sortOrder,
    
    // Filter setters
    setKeyword,
    setLocation,
    setJobType,
    setLevel,
    setExperience,
    setSalaryRange,
    setCategoryId,
    setCompanyId,
    setSkills,
    setSortBy,
    setSortOrder,
    
    // Data
    jobs,
    loading,
    error,
    
    // Meta
    total,
    page,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    
    // UI states
    showFilters,
    viewMode,
    
    // Actions
    handleSearch,
    resetFilters,
    toggleFilters,
    changeViewMode,
    goToPage,
    nextPage,
    prevPage,
    fetchJobs,
    appliedFiltersCount: appliedFiltersCount(),
  };
};

export default useBrowse;

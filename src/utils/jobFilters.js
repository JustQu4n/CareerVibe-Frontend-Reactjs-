/**
 * Job Filtering Utilities
 * Pure functions for filtering, sorting, and counting jobs
 */

import { DEFAULT_FILTERS } from '@/constants/browse.constants';

/**
 * Check if a job date is within the selected date range
 * @param {string} dateString - Job creation date
 * @param {string} range - Date range filter value
 * @returns {boolean} - Whether the date is within range
 */
export const isWithinDateRange = (dateString, range) => {
  if (range === "Any") return true;
  
  const jobDate = new Date(dateString);
  const today = new Date();
  const daysDiff = Math.floor((today - jobDate) / (1000 * 60 * 60 * 24));
  
  switch (range) {
    case "Today":
      return daysDiff < 1;
    case "Last 3 days":
      return daysDiff <= 3;
    case "Last week":
      return daysDiff <= 7;
    case "Last month":
      return daysDiff <= 30;
    default:
      return true;
  }
};

/**
 * Filter jobs based on search criteria
 * @param {Array} jobs - Array of job objects
 * @param {Object} filters - Filter criteria
 * @returns {Array} - Filtered jobs
 */
export const filterJobs = (jobs, filters) => {
  return jobs.filter((job) => {
    // Search filter
    const matchesSearch =
      !filters.search ||
      job.title?.toLowerCase().includes(filters.search.toLowerCase());

    // Job type filter
    const matchesType =
      filters.jobType === "All" || job.type === filters.jobType;

    // Location filter
    const matchesLocation =
      !filters.location ||
      job.location?.toLowerCase().includes(filters.location.toLowerCase());

    // Salary filter
    const matchesSalary =
      job.salary >= filters.salary[0] && job.salary <= filters.salary[1];

    // Experience filter
    const matchesExperience =
      filters.experience === "Any" || job.experience === filters.experience;

    // Date posted filter
    const matchesDate =
      filters.datePosted === "Any" ||
      isWithinDateRange(job.created_at, filters.datePosted);

    return (
      matchesSearch &&
      matchesType &&
      matchesLocation &&
      matchesSalary &&
      matchesExperience &&
      matchesDate
    );
  });
};

/**
 * Sort jobs based on selected criteria
 * @param {Array} jobs - Array of job objects
 * @param {string} sortBy - Sort criteria
 * @returns {Array} - Sorted jobs
 */
export const sortJobs = (jobs, sortBy) => {
  const sortedJobs = [...jobs];

  switch (sortBy) {
    case "newest":
      return sortedJobs.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
    case "salary_high":
      return sortedJobs.sort((a, b) => b.salary - a.salary);
    case "salary_low":
      return sortedJobs.sort((a, b) => a.salary - b.salary);
    case "relevance":
    default:
      return sortedJobs; // Keep original order for relevance
  }
};

/**
 * Count the number of applied filters (excluding defaults)
 * @param {Object} filters - Current filter values
 * @returns {number} - Count of applied filters
 */
export const countAppliedFilters = (filters) => {
  let count = 0;

  if (filters.jobType !== DEFAULT_FILTERS.jobType) count++;
  if (filters.location !== DEFAULT_FILTERS.location) count++;
  if (
    filters.salary[0] > DEFAULT_FILTERS.salary[0] ||
    filters.salary[1] < DEFAULT_FILTERS.salary[1]
  ) {
    count++;
  }
  if (filters.experience !== DEFAULT_FILTERS.experience) count++;
  if (filters.datePosted !== DEFAULT_FILTERS.datePosted) count++;

  return count;
};

/**
 * Format salary for display
 * @param {number} salary - Salary amount
 * @returns {string} - Formatted salary string
 */
export const formatSalary = (salary) => {
  return `$${salary.toLocaleString()}`;
};

/**
 * Get pagination data
 * @param {number} totalItems - Total number of items
 * @param {number} currentPage - Current page number
 * @param {number} itemsPerPage - Items per page
 * @returns {Object} - Pagination metadata
 */
export const getPaginationData = (totalItems, currentPage, itemsPerPage) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

  return {
    totalPages,
    startIndex,
    endIndex,
    hasNext: currentPage < totalPages,
    hasPrev: currentPage > 1,
  };
};

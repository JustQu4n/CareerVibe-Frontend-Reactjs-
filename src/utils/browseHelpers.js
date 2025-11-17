/**
 * Browse page utility functions
 * Helper functions for job filtering and date calculations
 */

/**
 * Check if a date is within the selected date range
 * @param {string} dateString - ISO date string to check
 * @param {string} range - Date range filter value (Today, Last 3 days, etc.)
 * @returns {boolean} True if date is within range
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
 * Count how many filters are currently applied (non-default values)
 * @param {Object} filters - Current filter state
 * @returns {number} Number of active filters
 */
export const countAppliedFilters = (filters) => {
  let count = 0;

  if (filters.filter !== "All") count++;
  if (filters.location?.trim() !== "") count++;
  if (filters.salary[0] > 0 || filters.salary[1] < 200000) count++;
  if (filters.experience !== "Any") count++;
  if (filters.datePosted !== "Any") count++;

  return count;
};

/**
 * Filter jobs based on all active filters
 * @param {Array} jobs - Array of job objects
 * @param {Object} filters - Filter criteria
 * @returns {Array} Filtered job array
 */
export const filterJobs = (jobs, filters) => {
  return jobs.filter((job) => {
    // Title/keyword search
    const matchesSearch =
      !filters.search ||
      job.title?.toLowerCase().includes(filters.search.toLowerCase());

    // Job type filter
    const matchesType =
      filters.filter === "All" || job.type === filters.filter;

    // Location filter
    const matchesLocation =
      !filters.location ||
      job.location?.toLowerCase().includes(filters.location.toLowerCase());

    // Salary range filter
    const matchesSalary =
      job.salary >= filters.salary[0] && job.salary <= filters.salary[1];

    // Experience level filter
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
 * @param {Array} jobs - Array of job objects to sort
 * @param {string} sortBy - Sort criteria (newest, salary_high, salary_low, relevance)
 * @returns {Array} Sorted job array
 */
export const sortJobs = (jobs, sortBy) => {
  const sortedJobs = [...jobs]; // Create a copy to avoid mutation

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
      return sortedJobs; // Default: no specific sorting
  }
};

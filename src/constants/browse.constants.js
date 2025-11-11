/**
 * Browse Page Constants
 * Contains all static data and configuration for job browsing
 */

/**
 * Job type filter options
 */
export const JOB_TYPES = [
  "All",
  "Full Time",
  "Part Time",
  "Remote",
  "Contract",
  "Internship",
];

/**
 * Experience level options
 */
export const EXPERIENCE_OPTIONS = [
  "Any",
  "Entry Level",
  "1-3 years",
  "3-5 years",
  "5+ years",
];

/**
 * Date posted filter options
 */
export const DATE_OPTIONS = [
  "Any",
  "Today",
  "Last 3 days",
  "Last week",
  "Last month",
];

/**
 * Sort options for job listings
 */
export const SORT_OPTIONS = [
  { value: "relevance", label: "Relevance" },
  { value: "newest", label: "Newest" },
  { value: "salary_high", label: "Salary: High to Low" },
  { value: "salary_low", label: "Salary: Low to High" },
];

/**
 * Company type options for filtering
 */
export const COMPANY_TYPES = [
  "Startup",
  "Enterprise",
  "Agency",
  "Non-profit",
];

/**
 * Salary range configuration
 */
export const SALARY_RANGE = {
  MIN: 0,
  MAX: 200000,
  STEP: 10000,
};

/**
 * Default filter values
 */
export const DEFAULT_FILTERS = {
  search: "",
  location: "",
  jobType: "All",
  salary: [SALARY_RANGE.MIN, SALARY_RANGE.MAX],
  experience: "Any",
  datePosted: "Any",
  sortBy: "relevance",
  companyTypes: [],
};

/**
 * Pagination configuration
 */
export const PAGINATION_CONFIG = {
  ITEMS_PER_PAGE: 12,
  MAX_PAGE_BUTTONS: 5,
};

/**
 * Application Helpers
 * Utility functions cho applications
 */

/**
 * Generate status badge CSS classes
 * @param {string} status - Application status
 * @returns {string} CSS classes
 */
export const getStatusBadgeStyle = (status) => {
  switch(status?.toLowerCase()) {
    case 'pending':
      return 'bg-amber-50 text-amber-700 border border-amber-200';
    case 'reviewed':
      return 'bg-blue-50 text-blue-700 border border-blue-200';
    case 'shortlisted':
      return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
    case 'rejected':
      return 'bg-red-50 text-red-700 border border-red-200';
    default:
      return 'bg-gray-50 text-gray-700 border border-gray-200';
  }
};

/**
 * Get status icon type
 * @param {string} status - Application status
 * @returns {string} Icon type name
 */
export const getStatusIconType = (status) => {
  switch(status?.toLowerCase()) {
    case 'pending':
      return 'clock';
    case 'reviewed':
      return 'file-text';
    case 'shortlisted':
      return 'check-circle';
    case 'rejected':
      return 'x-circle';
    default:
      return 'clock';
  }
};

/**
 * Filter applications by status and search term
 * @param {Array} applications - Applications array
 * @param {string} filterStatus - Filter status
 * @param {string} searchTerm - Search term
 * @returns {Array} Filtered applications
 */
export const filterApplications = (applications = [], filterStatus = 'all', searchTerm = '') => {
  return applications.filter(app => {
    const matchesStatus = filterStatus === 'all' || app.status?.toLowerCase() === filterStatus;
    // Updated to use jobPost instead of job
    const matchesSearch = !searchTerm || 
      app.jobPost?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.jobPost?.company?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });
};

/**
 * Calculate application statistics
 * @param {Array} applications - Applications array
 * @returns {Object} Statistics object
 */
export const calculateStats = (applications = []) => {
  return {
    total: applications.length,
    pending: applications.filter(app => app.status === 'pending').length,
    reviewed: applications.filter(app => app.status === 'reviewed').length,
    shortlisted: applications.filter(app => app.status === 'shortlisted').length,
    rejected: applications.filter(app => app.status === 'rejected').length,
  };
};

export default {
  getStatusBadgeStyle,
  getStatusIconType,
  filterApplications,
  calculateStats,
};

/**
 * Application Constants
 * Enums and validation constants for applications
 */

export const APPLICATION_STATUS = {
  PENDING: 'pending',
  REVIEWED: 'reviewed',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
};

export const APPLICATION_STATUS_OPTIONS = [
  { value: APPLICATION_STATUS.PENDING, label: 'Pending Review', color: 'amber' },
  { value: APPLICATION_STATUS.REVIEWED, label: 'Reviewed', color: 'blue' },
  { value: APPLICATION_STATUS.ACCEPTED, label: 'Accepted', color: 'green' },
  { value: APPLICATION_STATUS.REJECTED, label: 'Rejected', color: 'red' },
];

/**
 * Application Validation Rules
 */
export const APPLICATION_VALIDATION = {
  STATUS_VALUES: Object.values(APPLICATION_STATUS),
};

export default {
  APPLICATION_STATUS,
  APPLICATION_STATUS_OPTIONS,
  APPLICATION_VALIDATION,
};
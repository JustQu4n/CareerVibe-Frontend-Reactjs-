/**
 * Job Post Constants
 * Enums and validation constants for job posts
 */

export const JOB_TYPE = {
  FULL_TIME: 'full_time',
  PART_TIME: 'part_time',
  CONTRACT: 'contract',
  INTERNSHIP: 'internship',
};

export const JOB_LEVEL = {
  INTERN: 'Intern',
  JUNIOR: 'Junior',
  MIDDLE: 'Middle',
  SENIOR: 'Senior',
  LEAD: 'Lead',
  MANAGER: 'Manager',
  ALL: 'All',
};

export const GENDER = {
  ANY: 'any',
  MALE: 'male',
  FEMALE: 'female',
};

export const JOB_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  CLOSED: 'closed',
};

export const JOB_TYPE_OPTIONS = [
  { value: JOB_TYPE.FULL_TIME, label: 'Full Time' },
  { value: JOB_TYPE.PART_TIME, label: 'Part Time' },
  { value: JOB_TYPE.CONTRACT, label: 'Contract' },
  { value: JOB_TYPE.INTERNSHIP, label: 'Internship' },
];

export const JOB_LEVEL_OPTIONS = [
  { value: JOB_LEVEL.INTERN, label: 'Intern', color: 'blue' },
  { value: JOB_LEVEL.JUNIOR, label: 'Junior', color: 'green' },
  { value: JOB_LEVEL.MIDDLE, label: 'Middle', color: 'yellow' },
  { value: JOB_LEVEL.SENIOR, label: 'Senior', color: 'orange' },
  { value: JOB_LEVEL.LEAD, label: 'Lead', color: 'red' },
  { value: JOB_LEVEL.MANAGER, label: 'Manager', color: 'purple' },
  { value: JOB_LEVEL.ALL, label: 'All Levels', color: 'gray' },
];

export const GENDER_OPTIONS = [
  { value: GENDER.ANY, label: 'Any Gender' },
  { value: GENDER.MALE, label: 'Male' },
  { value: GENDER.FEMALE, label: 'Female' },
];

export const JOB_STATUS_OPTIONS = [
  { value: JOB_STATUS.ACTIVE, label: 'Active', color: 'green' },
  { value: JOB_STATUS.INACTIVE, label: 'Inactive', color: 'gray' },
  { value: JOB_STATUS.CLOSED, label: 'Closed', color: 'red' },
];

/**
 * Job Post Validation Rules
 */
export const JOB_POST_VALIDATION = {
  TITLE_MIN_LENGTH: 5,
  TITLE_MAX_LENGTH: 200,
  DESCRIPTION_MIN_LENGTH: 50,
  SKILLS_MIN_COUNT: 1,
  SKILLS_MAX_COUNT: 20,
};

/**
 * Job Post Field Labels
 */
export const JOB_POST_LABELS = {
  title: 'Job Title',
  industries: 'Industries',
  description: 'Job Description',
  requirements: 'Requirements',
  location: 'Location',
  address: 'Address',
  skills: 'Required Skills',
  experience: 'Experience Required',
  level: 'Job Level',
  salary_range: 'Salary Range',
  gender: 'Gender Requirement',
  job_type: 'Employment Type',
  status: 'Status',
  expires_at: 'Expiration Date',
  deadline: 'Application Deadline',
};

export default {
  JOB_TYPE,
  JOB_LEVEL,
  GENDER,
  JOB_STATUS,
  JOB_TYPE_OPTIONS,
  JOB_LEVEL_OPTIONS,
  GENDER_OPTIONS,
  JOB_STATUS_OPTIONS,
  JOB_POST_VALIDATION,
  JOB_POST_LABELS,
};

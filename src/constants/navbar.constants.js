/**
 * Navigation Constants
 * Contains all navigation links, menu items, and static data for Navbar
 */

import {
  BriefcaseBusiness,
  Building2,
  CircleUser,
  FileUser,
  Star,
  LogOut,
  FileText,
  MessageSquare,
  Calendar,
  Heart,
} from 'lucide-react';

/**
 * Navigation links for different user roles
 */
export const NAVIGATION_LINKS = {
  RECRUITER: [
    { to: '/admin/companies', label: 'Companies' },
    { to: '/admin/jobs', label: 'Jobs' },
  ],
  JOBSEEKER: [
    { to: '/Home', label: 'Home' },
    { to: '/Browse', label: 'Browse' },
    { to: '/', label: 'Jobs' },
    { to: '/cv-tools', label: 'Career Tools' },
    { to: '/recruiter-login', label: 'Recruiter site' },
    { to: '/Creator', label: 'About' },
  ],
};

/**
 * Mock notification data
 */
export const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    type: 'application',
    icon: FileText,
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    title: 'New job application received',
    description: 'A new candidate has applied for Front-end Developer position',
    time: '2 mins ago',
    isNew: true,
    action: {
      label: 'View application',
      onClick: () => console.log('View application clicked'),
    },
  },
  {
    id: 2,
    type: 'message',
    icon: MessageSquare,
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
    title: 'New message from recruiter',
    description: 'John Smith sent you a message about your application',
    time: '5 mins ago',
    isNew: false,
  },
  {
    id: 3,
    type: 'interview',
    icon: Calendar,
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
    title: 'Interview scheduled for next week',
    description: 'Your interview with Google is scheduled for Monday, 10:00 AM',
    time: '10 mins ago',
    isNew: false,
  },
];

/**
 * User menu items for different roles
 */
export const USER_MENU_ITEMS = {
  JOBSEEKER: [
    {
      id: 'profile',
      icon: CircleUser,
      label: 'Profile',
      to: '/profile',
    },
    {
      id: 'applications',
      icon: FileUser,
      label: 'Manager Applications',
      to: '/jobseeker-applications',
    },
    {
      id: 'saved',
      icon: Star,
      label: 'Your Saved Jobs',
      to: '/save-items',
    },
    {
      id: 'followed',
      icon: Heart,
      label: 'Followed Companies',
      to: '/followed-companies',
    },
  ],
  RECRUITER: [
    {
      id: 'company',
      icon: Building2,
      label: 'Your Company',
      to: '/admin/companies',
    },
    {
      id: 'jobs',
      icon: BriefcaseBusiness,
      label: 'Your Job Posts',
      to: '/admin/jobs',
    },
    {
      id: 'applicants',
      icon: FileUser,
      label: 'Management Application',
      to: '/admin/jobs/applicants',
    },
    {
      id: 'resumers',
      icon: FileUser,
      label: 'Management Resumers',
      to: '/admin/jobs/job-matching-dashboard',
    },
  ],
};

/**
 * Default avatar fallback
 */
export const DEFAULT_AVATAR = 'https://avatar.iran.liara.run/public/boy';

/**
 * Role display names
 */
export const ROLE_DISPLAY = {
  jobseeker: 'JobSeeker',
  employer: 'Recruiter',
  Recruiter: 'Recruiter',
};

/**
 * Notification count (mock data - should come from API in real app)
 */
export const NOTIFICATION_COUNT = 3;

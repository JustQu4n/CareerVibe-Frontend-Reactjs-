import React from 'react';
import {
  Briefcase,
  Calendar,
  Clock,
  GraduationCap,
  DollarSign,
  MapPin,
  Award,
} from 'lucide-react';
import { format } from 'date-fns';

/**
 * JobOverview Component
 * Hiển thị thông tin tổng quan về job
 * 
 * @param {Object} props
 * @param {Object} props.job - Thông tin job
 */
const JobOverview = ({ job }) => {
  const {
    created_at,
    expires_at,
    salary,
    location,
    job_type,
    experience,
  } = job;

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return format(new Date(dateString), 'd MMMM, yyyy');
  };

  const overviewItems = [
    {
      icon: Calendar,
      label: 'Posted On',
      value: formatDate(created_at),
    },
    {
      icon: Clock,
      label: 'Expires On',
      value: formatDate(expires_at),
    },
    {
      icon: GraduationCap,
      label: 'Education',
      value: "Bachelor's Degree",
    },
    {
      icon: DollarSign,
      label: 'Salary',
      value: salary ? `$${salary.toLocaleString()}` : 'Competitive',
    },
    {
      icon: MapPin,
      label: 'Location',
      value: location || 'Remote',
    },
    {
      icon: Briefcase,
      label: 'Job Type',
      value: job_type?.replace('_', ' ') || 'Full Time',
    },
    {
      icon: Award,
      label: 'Experience',
      value: experience || '2-3 years',
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-5 flex items-center">
        <Briefcase className="h-5 w-5 mr-2 text-blue-600" />
        Job Overview
      </h3>

      <div className="space-y-4">
        {overviewItems.map((item, index) => (
          <OverviewItem key={index} {...item} />
        ))}
      </div>
    </div>
  );
};

/**
 * OverviewItem - Item riêng lẻ trong job overview
 */
const OverviewItem = React.memo(({ icon: Icon, label, value }) => (
  <div className="flex items-start">
    <div className="flex-shrink-0 p-2 bg-blue-50 rounded-lg">
      <Icon className="h-5 w-5 text-blue-600" />
    </div>
    <div className="ml-4">
      <h4 className="text-xs text-gray-500 uppercase">{label}</h4>
      <div className="text-sm font-medium mt-1 text-gray-900">{value}</div>
    </div>
  </div>
));

OverviewItem.displayName = 'OverviewItem';

export default React.memo(JobOverview);

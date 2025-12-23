import React from 'react';
import {
  Briefcase,
  Calendar,
  Clock,
  DollarSign,
  MapPin,
  Award,
  TrendingUp,
} from 'lucide-react';
import { format } from 'date-fns';

/**
 * JobOverview Component - Modern overview card with enhanced design
 */
const JobOverview = ({ job }) => {
  const {
    created_at,
    deadline,
    salary_range,
    location,
    employment_type,
    status,
  } = job;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';  
    return format(new Date(dateString), 'd MMMM, yyyy');
  };

  const overviewItems = [
    {
      icon: Calendar,
      label: 'Posted On',
      value: formatDate(created_at),
      color: 'blue',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      icon: Clock,
      label: 'Deadline',
      value: formatDate(deadline),
      color: 'red',
      bgColor: 'bg-red-50',
      iconColor: 'text-red-600',
    },
    {
      icon: DollarSign,
      label: 'Salary',
      value: salary_range || 'Competitive',
      color: 'green',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
    },
    {
      icon: MapPin,
      label: 'Location',
      value: location || 'Not specified',
      color: 'purple',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
    },
    {
      icon: Briefcase,
      label: 'Job Type',
      value: employment_type === 'full-time' ? 'Full Time' : 
             employment_type === 'part-time' ? 'Part Time' : 
             employment_type === 'contract' ? 'Contract' : 
             employment_type || 'Full Time',
      color: 'indigo',
      bgColor: 'bg-indigo-50',
      iconColor: 'text-indigo-600',
    },
    {
      icon: TrendingUp,
      label: 'Status',
      value: status === 'active' ? '🟢 Active' : 
             status === 'closed' ? '🔴 Closed' : 
             status || '🟢 Active',
      color: 'emerald',
      bgColor: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
        <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow-sm">
          <Briefcase className="h-4 w-4 text-white" />
        </div>
        <h3 className="text-base font-bold text-gray-900">
          Job Overview
        </h3>
      </div>

      <div className="space-y-2">
        {overviewItems.map((item, index) => (
          <OverviewItem key={index} {...item} />
        ))}
      </div>
    </div>
  );
};

/**
 * OverviewItem - Enhanced item with colorful icons
 */
const OverviewItem = React.memo(({ icon: Icon, label, value, bgColor, iconColor }) => (
  <div className="group hover:bg-gray-50 p-2 rounded-lg transition-all duration-200">
    <div className="flex items-center gap-2">
      <div className={`flex-shrink-0 p-1.5 ${bgColor} rounded-md transition-transform duration-200 group-hover:scale-110`}>
        <Icon className={`h-4 w-4 ${iconColor}`} />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</h4>
        <p className="text-sm font-semibold text-gray-900 truncate">{value}</p>
      </div>
    </div>
  </div>
));

OverviewItem.displayName = 'OverviewItem';

export default React.memo(JobOverview);


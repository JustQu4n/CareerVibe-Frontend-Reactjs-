import React from 'react';
import { FileText, Clock, CheckCircle, XCircle } from 'lucide-react';

/**
 * ApplicationStats Component
 * Hiển thị thống kê tổng quan về applications
 * 
 * @param {Object} props
 * @param {Array} props.applications - Danh sách applications
 */
const ApplicationStats = ({ applications = [] }) => {
  const stats = [
    {
      label: 'Total Applications',
      value: applications.length,
      icon: FileText,
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-500',
      textColor: 'text-gray-800',
      description: applications.length > 0 
        ? `Last application on ${new Date(applications[0].applied_at).toLocaleDateString()}`
        : 'No applications yet',
    },
    {
      label: 'Pending',
      value: applications.filter(app => app.status === 'pending').length,
      icon: Clock,
      bgColor: 'bg-amber-50',
      iconColor: 'text-amber-500',
      textColor: 'text-amber-500',
      showProgress: true,
      progressColor: 'bg-amber-500',
    },
    {
      label: 'Shortlisted',
      value: applications.filter(app => app.status === 'shortlisted').length,
      icon: CheckCircle,
      bgColor: 'bg-emerald-50',
      iconColor: 'text-emerald-500',
      textColor: 'text-emerald-500',
      showProgress: true,
      progressColor: 'bg-emerald-500',
    },
    {
      label: 'Rejected',
      value: applications.filter(app => app.status === 'rejected').length,
      icon: XCircle,
      bgColor: 'bg-red-50',
      iconColor: 'text-red-500',
      textColor: 'text-red-500',
      showProgress: true,
      progressColor: 'bg-red-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <StatCard key={index} stat={stat} totalApplications={applications.length} />
      ))}
    </div>
  );
};

/**
 * StatCard - Individual stat card component
 */
const StatCard = React.memo(({ stat, totalApplications }) => {
  const Icon = stat.icon;
  const percentage = totalApplications > 0 
    ? (stat.value / totalApplications) * 100 
    : 0;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
            {stat.label}
          </p>
          <p className={`text-3xl font-bold ${stat.textColor} mt-2`}>
            {stat.value}
          </p>
        </div>
        <div className={`p-3 ${stat.bgColor} rounded-lg`}>
          <Icon className={`h-6 w-6 ${stat.iconColor}`} />
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-gray-100">
        {stat.showProgress ? (
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div 
              className={`${stat.progressColor} h-1.5 rounded-full transition-all duration-300`}
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
        ) : (
          <p className="text-xs text-gray-500">{stat.description}</p>
        )}
      </div>
    </div>
  );
});

StatCard.displayName = 'StatCard';

export default React.memo(ApplicationStats);

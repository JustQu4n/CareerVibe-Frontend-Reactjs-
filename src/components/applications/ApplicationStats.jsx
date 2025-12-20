import React from 'react';
import { FileText, Clock, CheckCircle, XCircle, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

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
      gradient: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-gradient-to-br from-blue-50 to-cyan-50',
      iconBg: 'bg-gradient-to-br from-blue-500 to-cyan-500',
      textColor: 'text-gray-800',
      description: applications.length > 0 
        ? `Last: ${new Date(applications[0].applied_at).toLocaleDateString()}`
        : 'No applications yet',
      trend: '+12%',
    },
    {
      label: 'Pending Review',
      value: applications.filter(app => app.status === 'pending').length,
      icon: Clock,
      gradient: 'from-amber-500 to-orange-500',
      bgColor: 'bg-gradient-to-br from-amber-50 to-orange-50',
      iconBg: 'bg-gradient-to-br from-amber-500 to-orange-500',
      textColor: 'text-amber-600',
      showProgress: true,
      progressColor: 'bg-gradient-to-r from-amber-500 to-orange-500',
      trend: applications.filter(app => app.status === 'pending').length > 0 ? 'Active' : 'None',
    },
    {
      label: 'Shortlisted',
      value: applications.filter(app => app.status === 'shortlisted').length,
      icon: CheckCircle,
      gradient: 'from-emerald-500 to-green-500',
      bgColor: 'bg-gradient-to-br from-emerald-50 to-green-50',
      iconBg: 'bg-gradient-to-br from-emerald-500 to-green-500',
      textColor: 'text-emerald-600',
      showProgress: true,
      progressColor: 'bg-gradient-to-r from-emerald-500 to-green-500',
      trend: '+8%',
    },
    {
      label: 'Rejected',
      value: applications.filter(app => app.status === 'rejected').length,
      icon: XCircle,
      gradient: 'from-red-500 to-rose-500',
      bgColor: 'bg-gradient-to-br from-red-50 to-rose-50',
      iconBg: 'bg-gradient-to-br from-red-500 to-rose-500',
      textColor: 'text-red-600',
      showProgress: true,
      progressColor: 'bg-gradient-to-r from-red-500 to-rose-500',
      trend: 'Track',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <StatCard key={index} stat={stat} totalApplications={applications.length} index={index} />
      ))}
    </div>
  );
};

/**
 * StatCard - Individual stat card component
 */
const StatCard = React.memo(({ stat, totalApplications, index }) => {
  const Icon = stat.icon;
  const percentage = totalApplications > 0 
    ? (stat.value / totalApplications) * 100 
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className={`relative overflow-hidden ${stat.bgColor} rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer`}
    >
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      
      <div className="relative p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-2">
              {stat.label}
            </p>
            <p className={`text-4xl font-bold ${stat.textColor}`}>
              {stat.value}
            </p>
          </div>
          <div className={`p-3 ${stat.iconBg} rounded-xl shadow-lg group-hover:scale-110 transition-transform`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
        
        <div className="space-y-2">
          {stat.showProgress ? (
            <>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-600 font-medium">
                  {percentage.toFixed(0)}% of total
                </span>
                <span className={`flex items-center gap-1 font-semibold ${stat.textColor}`}>
                  <TrendingUp className="h-3 w-3" />
                  {stat.trend}
                </span>
              </div>
              <div className="w-full bg-white/50 rounded-full h-2 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 1, delay: index * 0.1 + 0.3, ease: "easeOut" }}
                  className={`${stat.progressColor} h-2 rounded-full shadow-sm`}
                ></motion.div>
              </div>
            </>
          ) : (
            <p className="text-xs text-gray-600 font-medium">{stat.description}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
});

StatCard.displayName = 'StatCard';

export default React.memo(ApplicationStats);

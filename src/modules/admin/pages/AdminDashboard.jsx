/**
 * AdminDashboard Component
 * Modern dashboard with analytics, stats, and quick actions
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  Users,
  Briefcase,
  Building2,
  FileText,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Target,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RePieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

export default function AdminDashboard() {
  const [timeRange, setTimeRange] = useState('week');

  // Stats Cards Data
  const stats = [
    {
      title: 'Total Applications',
      value: '2,847',
      change: '+12.5%',
      trending: 'up',
      icon: FileText,
      color: 'blue',
      bgGradient: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Active Jobs',
      value: '156',
      change: '+8.2%',
      trending: 'up',
      icon: Briefcase,
      color: 'purple',
      bgGradient: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Companies',
      value: '89',
      change: '+5.7%',
      trending: 'up',
      icon: Building2,
      color: 'green',
      bgGradient: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Total Candidates',
      value: '1,429',
      change: '-2.3%',
      trending: 'down',
      icon: Users,
      color: 'orange',
      bgGradient: 'from-orange-500 to-red-500'
    }
  ];

  // Applications Chart Data
  const applicationsData = [
    { name: 'Mon', applications: 65, interviews: 28 },
    { name: 'Tue', applications: 78, interviews: 35 },
    { name: 'Wed', applications: 90, interviews: 42 },
    { name: 'Thu', applications: 81, interviews: 38 },
    { name: 'Fri', applications: 95, interviews: 45 },
    { name: 'Sat', applications: 45, interviews: 20 },
    { name: 'Sun', applications: 38, interviews: 15 }
  ];

  // Job Status Distribution
  const jobStatusData = [
    { name: 'Active', value: 156, color: '#10b981' },
    { name: 'Pending', value: 42, color: '#f59e0b' },
    { name: 'Closed', value: 78, color: '#6366f1' },
    { name: 'Draft', value: 24, color: '#8b5cf6' }
  ];

  // Recent Activities
  const recentActivities = [
    {
      id: 1,
      type: 'application',
      title: 'New application received',
      description: 'John Doe applied for Senior Developer',
      time: '5 minutes ago',
      icon: FileText,
      color: 'blue'
    },
    {
      id: 2,
      type: 'job',
      title: 'Job posted successfully',
      description: 'Frontend Developer - React position',
      time: '1 hour ago',
      icon: Briefcase,
      color: 'green'
    },
    {
      id: 3,
      type: 'company',
      title: 'New company registered',
      description: 'TechStart Inc. joined the platform',
      time: '2 hours ago',
      icon: Building2,
      color: 'purple'
    },
    {
      id: 4,
      type: 'interview',
      title: 'Interview scheduled',
      description: 'Sarah Johnson - UI/UX Designer',
      time: '3 hours ago',
      icon: Calendar,
      color: 'orange'
    }
  ];

  // Top Jobs
  const topJobs = [
    {
      id: 1,
      title: 'Senior Frontend Developer',
      company: 'TechCorp',
      applications: 45,
      status: 'active',
      trending: 'up'
    },
    {
      id: 2,
      title: 'Backend Engineer',
      company: 'StartupXYZ',
      applications: 38,
      status: 'active',
      trending: 'up'
    },
    {
      id: 3,
      title: 'UI/UX Designer',
      company: 'DesignHub',
      applications: 32,
      status: 'active',
      trending: 'down'
    },
    {
      id: 4,
      title: 'Product Manager',
      company: 'InnovateCo',
      applications: 28,
      status: 'active',
      trending: 'up'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-600 mt-1">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="flex gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="week">Last 7 days</option>
            <option value="month">Last 30 days</option>
            <option value="year">Last year</option>
          </select>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              whileHover={{ scale: 1.02, y: -4 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{stat.value}</h3>
                  <div className="flex items-center gap-2">
                    {stat.trending === 'up' ? (
                      <div className="flex items-center text-green-600">
                        <TrendingUp className="h-4 w-4" />
                        <span className="text-sm font-semibold ml-1">{stat.change}</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-red-600">
                        <TrendingDown className="h-4 w-4" />
                        <span className="text-sm font-semibold ml-1">{stat.change}</span>
                      </div>
                    )}
                    <span className="text-sm text-gray-500">vs last {timeRange}</span>
                  </div>
                </div>
                <div className={`h-10 w-10 rounded-2xl bg-gradient-to-br ${stat.bgGradient} flex items-center justify-center shadow-lg`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Applications Overview Chart */}
        <motion.div
          variants={itemVariants}
          className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-bold text-gray-900">Applications Overview</h2>
              <p className="text-xs text-gray-500">Applications and interviews this week</p>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-blue-500" />
                <span className="text-sm text-gray-600">Applications</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-purple-500" />
                <span className="text-sm text-gray-600">Interviews</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={applicationsData}>
              <defs>
                <linearGradient id="colorApplications" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorInterviews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
              />
              <Area
                type="monotone"
                dataKey="applications"
                stroke="#3b82f6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorApplications)"
              />
              <Area
                type="monotone"
                dataKey="interviews"
                stroke="#8b5cf6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorInterviews)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Job Status Distribution */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <div className="mb-6">
            <h2 className="text-base font-bold text-gray-900">Job Status</h2>
            <p className="text-xs text-gray-500">Distribution of job postings</p>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <RePieChart>
              <Pie
                data={jobStatusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
              >
                {jobStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </RePieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {jobStatusData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-gray-700">{item.name}</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">{item.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-bold text-gray-900">Recent Activities</h2>
              <p className="text-xs text-gray-500">Latest updates and events</p>
            </div>
            <Link to="/admin/activities" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              View all
            </Link>
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity) => {
              const Icon = activity.icon;
              return (
                <motion.div
                  key={activity.id}
                  whileHover={{ x: 4 }}
                  className="flex gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <div className={`h-8 w-8 rounded-xl bg-${activity.color}-100 flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`h-4 w-4 text-${activity.color}-600`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900">{activity.title}</p>
                    <p className="text-sm text-gray-600 truncate">{activity.description}</p>
                    <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Top Jobs */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-bold text-gray-900">Top Jobs</h2>
              <p className="text-xs text-gray-500">Most applied positions</p>
            </div>
            <Link to="/admin/jobs" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              View all
            </Link>
          </div>
          <div className="space-y-4">
            {topJobs.map((job) => (
              <motion.div
                key={job.id}
                whileHover={{ x: 4 }}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{job.title}</p>
                  <p className="text-sm text-gray-600">{job.company}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">{job.applications}</p>
                    <p className="text-xs text-gray-500">applications</p>
                  </div>
                  {job.trending === 'up' ? (
                    <ArrowUpRight className="h-4 w-4 text-green-600" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-red-600" />
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        variants={itemVariants}
        className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold mb-2">Ready to take action?</h2>
            <p className="text-sm text-blue-100">Quick access to common tasks</p>
          </div>
          <div className="flex gap-3">
            <Link
              to="/admin/jobs/create"
              className="px-4 py-2 bg-white text-blue-600 rounded-xl text-sm font-semibold hover:bg-blue-50 transition-colors"
            >
              Post New Job
            </Link>
            <Link
              to="/admin/companies/create"
              className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-xl text-sm font-semibold hover:bg-white/30 transition-colors"
            >
              Add Company
            </Link>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/**
 * SuperAdmin Dashboard
 * Main dashboard for super administrators with comprehensive analytics
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Building2,
  Briefcase,
  FileText,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  Shield,
  FolderOpen,
  UserCheck,
  Bell,
  Heart,
  Calendar,
  BarChart3
} from 'lucide-react';
import { Link } from 'react-router-dom';
import apiClient from '@/api/client';

export default function SuperAdminDashboard() {
  const [overview, setOverview] = useState(null);
  const [growth, setGrowth] = useState(null);
  const [topCategories, setTopCategories] = useState([]);
  const [topCompanies, setTopCompanies] = useState({ by_followers: [], by_job_posts: [] });
  const [applicationStatus, setApplicationStatus] = useState([]);
  const [recentActivities, setRecentActivities] = useState({
    recent_users: [],
    recent_job_posts: [],
    recent_applications: [],
    recent_companies: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllDashboardData();
  }, []);

  const fetchAllDashboardData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchOverview(),
        fetchGrowth(),
        fetchTopCategories(),
        fetchTopCompanies(),
        fetchApplicationStatus(),
        fetchRecentActivities()
      ]);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOverview = async () => {
    try {
      const response = await apiClient.get('http://localhost:5000/api/admin/dashboard/overview');
      setOverview(response.data);
    } catch (error) {
      console.error('Failed to fetch overview:', error);
    }
  };

  const fetchGrowth = async () => {
    try {
      const response = await apiClient.get('http://localhost:5000/api/admin/dashboard/growth');
      setGrowth(response.data);
    } catch (error) {
      console.error('Failed to fetch growth:', error);
    }
  };

  const fetchTopCategories = async () => {
    try {
      const response = await apiClient.get('http://localhost:5000/api/admin/dashboard/top-categories', {
        params: { limit: 10 }
      });
      setTopCategories(response.data || []);
    } catch (error) {
      console.error('Failed to fetch top categories:', error);
    }
  };

  const fetchTopCompanies = async () => {
    try {
      const response = await apiClient.get('http://localhost:5000/api/admin/dashboard/top-companies', {
        params: { limit: 10 }
      });
      setTopCompanies(response.data || { by_followers: [], by_job_posts: [] });
    } catch (error) {
      console.error('Failed to fetch top companies:', error);
    }
  };

  const fetchApplicationStatus = async () => {
    try {
      const response = await apiClient.get('http://localhost:5000/api/admin/dashboard/application-status');
      setApplicationStatus(response.data || []);
    } catch (error) {
      console.error('Failed to fetch application status:', error);
    }
  };

  const fetchRecentActivities = async () => {
    try {
      const response = await apiClient.get('http://localhost:5000/api/admin/dashboard/recent-activities', {
        params: { limit: 20 }
      });
      setRecentActivities(response.data || {
        recent_users: [],
        recent_job_posts: [],
        recent_applications: [],
        recent_companies: []
      });
    } catch (error) {
      console.error('Failed to fetch recent activities:', error);
    }
  };

  const getGrowthIndicator = (growthRate) => {
    if (!growthRate) return null;
    const isPositive = growthRate > 0;
    return {
      icon: isPositive ? TrendingUp : TrendingDown,
      color: isPositive ? 'text-green-600' : 'text-red-600',
      text: `${isPositive ? '+' : ''}${growthRate.toFixed(1)}%`
    };
  };

  const overviewCards = overview ? [
    {
      title: 'Total Users',
      value: overview.users?.total || 0,
      icon: Users,
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      growth: growth?.users?.growth_rate,
      link: '/superadmin/users'
    },
    {
      title: 'Active Users',
      value: overview.users?.active || 0,
      icon: UserCheck,
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      link: '/superadmin/users'
    },
    {
      title: 'Total Companies',
      value: overview.companies?.total || 0,
      icon: Building2,
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      link: '/superadmin/companies'
    },
    {
      title: 'Total Job Posts',
      value: overview.job_posts?.total || 0,
      icon: Briefcase,
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
      growth: growth?.job_posts?.growth_rate
    },
    {
      title: 'Active Jobs',
      value: overview.job_posts?.active || 0,
      icon: CheckCircle,
      bgColor: 'bg-teal-50',
      textColor: 'text-teal-600'
    },
    {
      title: 'Applications',
      value: overview.applications?.total || 0,
      icon: FileText,
      bgColor: 'bg-pink-50',
      textColor: 'text-pink-600',
      growth: growth?.applications?.growth_rate
    },
    {
      title: 'Job Seekers',
      value: overview.users?.job_seekers || 0,
      icon: Users,
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-600'
    },
    {
      title: 'Employers',
      value: overview.users?.employers || 0,
      icon: Shield,
      bgColor: 'bg-cyan-50',
      textColor: 'text-cyan-600'
    },
    {
      title: 'Categories',
      value: overview.categories?.total || 0,
      icon: FolderOpen,
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600',
      link: '/superadmin/categories'
    },
    {
      title: 'Notifications',
      value: overview.notifications?.total || 0,
      icon: Bell,
      bgColor: 'bg-red-50',
      textColor: 'text-red-600'
    }
  ] : [];

  const getStatusColor = (status) => {
    const colors = {
      PENDING: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      ACCEPTED: 'bg-green-100 text-green-700 border-green-200',
      REJECTED: 'bg-red-100 text-red-700 border-red-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex items-center gap-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          <span className="text-gray-600">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-sm text-gray-600 mt-1">Welcome back! Here's what's happening with your platform.</p>
        </div>
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-gray-400" />
          <span className="text-sm text-gray-600">Last 30 days</span>
        </div>
      </div>

      {/* Overview Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {overviewCards.map((stat, index) => {
          const Icon = stat.icon;
          const growthIndicator = getGrowthIndicator(stat.growth);
          const CardContent = (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-5 w-5 ${stat.textColor}`} />
                </div>
                {growthIndicator && (
                  <div className={`flex items-center gap-1 ${growthIndicator.color}`}>
                    <growthIndicator.icon className="h-3 w-3" />
                    <span className="text-xs font-medium">{growthIndicator.text}</span>
                  </div>
                )}
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{stat.value.toLocaleString()}</h3>
              <p className="text-xs text-gray-600 mt-1">{stat.title}</p>
            </motion.div>
          );

          return stat.link ? (
            <Link key={stat.title} to={stat.link}>
              {CardContent}
            </Link>
          ) : (
            <div key={stat.title}>{CardContent}</div>
          );
        })}
      </div>

      {/* Application Status Breakdown */}
      {applicationStatus.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Application Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {applicationStatus.map((status) => (
              <div key={status.status} className="p-4 border border-gray-200 rounded-lg">
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(status.status)} mb-2`}>
                  {status.status}
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{status.count.toLocaleString()}</h3>
                <p className="text-xs text-gray-600 mt-1">applications</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top Categories & Companies */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Categories */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Top Categories</h2>
            <Link to="/superadmin/categories" className="text-sm text-purple-600 hover:text-purple-700">
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {topCategories.slice(0, 5).map((category, index) => (
              <div key={category.category_id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-purple-100 rounded-lg text-purple-600 font-semibold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{category.name}</p>
                    <p className="text-xs text-gray-500">/{category.slug}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">{category.job_posts_count}</p>
                  <p className="text-xs text-gray-500">jobs</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Companies by Followers */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Top Companies by Followers</h2>
            <Link to="/superadmin/companies" className="text-sm text-purple-600 hover:text-purple-700">
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {topCompanies.by_followers?.slice(0, 5).map((company, index) => (
              <div key={company.company_id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg text-blue-600 font-semibold text-sm">
                    {index + 1}
                  </div>
                  {company.logo_url ? (
                    <img src={company.logo_url} alt={company.name} className="w-8 h-8 rounded-lg object-cover" />
                  ) : (
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Building2 className="h-4 w-4 text-gray-400" />
                    </div>
                  )}
                  <p className="text-sm font-medium text-gray-900">{company.name}</p>
                </div>
                <div className="flex items-center gap-1 text-pink-600">
                  <Heart className="h-3 w-3 fill-current" />
                  <span className="text-sm font-semibold">{company.followers_count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Users</h2>
            <Link to="/superadmin/users" className="text-sm text-purple-600 hover:text-purple-700">
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {recentActivities.recent_users?.slice(0, 5).map((user) => (
              <div key={user.user_id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold">
                  {user.full_name?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{user.full_name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(user.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Companies */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Companies</h2>
            <Link to="/superadmin/companies" className="text-sm text-purple-600 hover:text-purple-700">
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {recentActivities.recent_companies?.slice(0, 5).map((company) => (
              <div key={company.company_id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50">
                {company.logo_url ? (
                  <img src={company.logo_url} alt={company.name} className="w-10 h-10 rounded-lg object-cover" />
                ) : (
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-gray-400" />
                  </div>
                )}
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{company.name}</p>
                  <p className="text-xs text-gray-500">{company.industry}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(company.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

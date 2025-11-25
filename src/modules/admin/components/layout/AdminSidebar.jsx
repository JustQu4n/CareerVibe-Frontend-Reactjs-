/**
 * AdminSidebar Component
 * Modern sidebar navigation for admin module
 */

import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Building2,
  Briefcase,
  Users,
  FileText,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Target,
  BarChart3,
  Calendar,
  Bell,
  Sparkles
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '@/redux/authSlice';
import { toast } from 'sonner';

export default function AdminSidebar({ isCollapsed, setIsCollapsed }) {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);

  const menuItems = [
    {
      title: 'Dashboard',
      icon: LayoutDashboard,
      path: '/admin/dashboard',
      badge: null
    },
    {
      title: 'Companies',
      icon: Building2,
      path: '/admin/companies',
      badge: null
    },
    {
      title: 'Jobs',
      icon: Briefcase,
      path: '/admin/jobs',
      badge: null
    },
    {
      title: 'Applicants',
      icon: Users,
      path: '/admin/jobs/applicants',
      badge: null
    },
    {
      title: 'Job Matching',
      icon: Target,
      path: '/admin/jobs/job-matching-dashboard',
      badge: 'AI',
      gradient: true
    },
    {
      title: 'Analytics',
      icon: BarChart3,
      path: '/admin/analytics',
      badge: null
    }
  ];

  const bottomMenuItems = [
    {
      title: 'Settings',
      icon: Settings,
      path: '/admin/settings'
    }
  ];

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const handleLogout = () => {
    dispatch(setUser(null));
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? '80px' : '280px' }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="fixed left-0 top-0 h-screen bg-white border-r border-gray-200 z-40 flex flex-col shadow-lg"
    >
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
        <AnimatePresence mode="wait">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-3"
            >
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">CareerVibe</h1>
                <p className="text-xs text-gray-500">Admin Panel</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          {isCollapsed ? (
            <ChevronRight className="h-5 w-5 text-gray-600" />
          ) : (
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          )}
        </button>
      </div>

      {/* User Info */}
      <div className={`p-4 border-b border-gray-200 ${isCollapsed ? 'px-2' : ''}`}>
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center overflow-hidden">
                {user?.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt={user?.fullname || 'Admin'} 
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-white font-semibold text-sm">
                    {user?.fullname?.charAt(0).toUpperCase() || 'A'}
                  </span>
                )}
              </div>
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex-1 min-w-0"
              >
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {user?.fullname || 'Admin User'}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user?.email || 'admin@careervibe.com'}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                className="block"
              >
                <motion.div
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  className={`
                    flex items-center gap-3 px-3 py-3 rounded-xl transition-all
                    ${active
                      ? item.gradient
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30'
                        : 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50'
                    }
                    ${isCollapsed ? 'justify-center' : ''}
                  `}
                >
                  <Icon className={`h-5 w-5 flex-shrink-0 ${active && !item.gradient ? 'text-blue-600' : ''}`} />
                  
                  <AnimatePresence mode="wait">
                    {!isCollapsed && (
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="text-sm font-medium flex-1"
                      >
                        {item.title}
                      </motion.span>
                    )}
                  </AnimatePresence>

                  {!isCollapsed && item.badge && (
                    <span className={`
                      text-xs px-2 py-0.5 rounded-full font-semibold
                      ${item.gradient
                        ? 'bg-white/20 text-white'
                        : 'bg-blue-100 text-blue-600'
                      }
                    `}>
                      {item.badge}
                    </span>
                  )}
                </motion.div>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Bottom Menu */}
      <div className="border-t border-gray-200 p-2 space-y-1">
        {bottomMenuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              className="block"
            >
              <motion.div
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
                className={`
                  flex items-center gap-3 px-3 py-3 rounded-xl transition-all
                  ${active
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                  }
                  ${isCollapsed ? 'justify-center' : ''}
                `}
              >
                <Icon className={`h-5 w-5 flex-shrink-0 ${active ? 'text-blue-600' : ''}`} />
                
                <AnimatePresence mode="wait">
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="text-sm font-medium"
                    >
                      {item.title}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </Link>
          );
        })}

        {/* Logout Button */}
        <motion.button
          whileHover={{ scale: 1.02, x: 4 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLogout}
          className={`
            w-full flex items-center gap-3 px-3 py-3 rounded-xl
            text-red-600 hover:bg-red-50 transition-all
            ${isCollapsed ? 'justify-center' : ''}
          `}
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="text-sm font-medium"
              >
                Logout
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </motion.aside>
  );
}

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BellRing, FileText, Briefcase, Users, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useNotifications from '@/hooks/useNotifications';
import { formatNotification } from '@/lib/notificationUtils';
import { formatDistanceToNow } from 'date-fns';

export default function AdminNotifications() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { notifications: apiNotifications = [], unreadCount, markAsRead, refresh } = useNotifications();

  // Debug log
  console.log('🔔 AdminNotifications Debug:', {
    unreadCount,
    notificationsCount: apiNotifications.length,
    notifications: apiNotifications
  });

  // Map API notification to UI format with icons
  const notifications = apiNotifications.map((n) => {
    const { title, description } = formatNotification(n);
    
    // Determine icon based on notification type
    let icon = FileText;
    let iconBg = 'bg-blue-100';
    let iconColor = 'text-blue-600';
    
    if (n.type === 'application') {
      icon = Users;
      iconBg = 'bg-green-100';
      iconColor = 'text-green-600';
    } else if (n.type === 'job_post') {
      icon = Briefcase;
      iconBg = 'bg-purple-100';
      iconColor = 'text-purple-600';
    } else if (n.type === 'interview') {
      icon = Calendar;
      iconBg = 'bg-orange-100';
      iconColor = 'text-orange-600';
    }
    
    return {
      id: n.id,
      icon,
      iconBg,
      iconColor,
      title: title || n.message,
      description: description || '',
      time: formatDistanceToNow(new Date(n.created_at || Date.now()), { addSuffix: true }),
      isNew: !n.is_read,
      original: n,
    };
  });

  const handleOpen = () => {
    setOpen((s) => !s);
    if (!open && refresh) refresh();
  };

  const handleMarkAllAsRead = useCallback(() => {
    if (!markAsRead) return;
    notifications.forEach((n) => {
      if (n.isNew) markAsRead(n.id);
    });
  }, [markAsRead, notifications]);

  const handleNotificationClick = (notification) => {
    markAsRead && markAsRead(notification.id);
    const jobId = notification.original?.metadata?.job_post_id;
    if (jobId) {
      navigate(`/admin/jobs`);
      setOpen(false);
    }
  };

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleOpen}
        aria-label="Open notifications"
        className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors"
      >
        <BellRing className="h-5 w-5 text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-[10px] text-white font-bold">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </motion.button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden z-20"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 bg-white border-b">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                  <p className="text-xs text-gray-500">Recent activity for your account</p>
                </div>
                <div className="flex items-center gap-3">
                  {unreadCount > 0 && (
                    <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-medium">
                      {unreadCount} new
                    </span>
                  )}
                  <button
                    onClick={handleMarkAllAsRead}
                    className="text-xs text-gray-600 hover:text-gray-800 font-medium"
                  >
                    Mark all
                  </button>
                </div>
              </div>

              {/* Notification List */}
              <div className="max-h-80 overflow-y-auto bg-white">
                <div className="divide-y divide-gray-100">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => {
                      return (
                        <div
                          key={notification.id}
                          onClick={() => handleNotificationClick(notification)}
                          className="flex items-start gap-3 p-3 transition-shadow bg-white hover:shadow-sm cursor-pointer"
                        >
                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1">
                                <p className={`text-sm text-gray-900 whitespace-normal break-words leading-snug ${notification.isNew ? 'font-bold' : ''}`}>
                                  {notification.title}
                                </p>
                                {notification.description && (
                                  <p className={`text-xs text-gray-500 mt-1 whitespace-normal break-words ${notification.isNew ? 'font-semibold' : ''}`}>
                                    {notification.description}
                                  </p>
                                )}
                              </div>

                              <div className="flex-shrink-0 text-right ml-2">
                                <div className="text-xs text-gray-400">{notification.time}</div>
                                {notification.isNew && (
                                  <div className="mt-2 h-2 w-2 rounded-full bg-indigo-500 mx-auto" />
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="py-8 text-center text-gray-500 text-sm">
                      You're all caught up — no notifications
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t">
                <button
                  onClick={() => {
                    navigate('/admin/notifications');
                    setOpen(false);
                  }}
                  className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  View all
                </button>
                <span className="text-xs text-gray-500">Updated just now</span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

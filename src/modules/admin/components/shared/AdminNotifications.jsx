import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useNotifications from '@/hooks/useNotifications';
import { formatNotification } from '@/lib/notificationUtils';

export default function AdminNotifications() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { notifications = [], unreadCount, markAsRead, refresh } = useNotifications();

  const handleOpen = () => {
    setOpen((s) => !s);
    // refresh when opening
    if (!open && refresh) refresh();
  };

  const handleClick = (n) => {
    // mark as read then navigate if job id present
    markAsRead && markAsRead(n.id);
    const jobId = n.metadata?.job_post_id;
    if (jobId) {
      navigate(`/view-job-detail/${jobId}`);
      setOpen(false);
    }
  };

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleOpen}
        className="p-2 rounded-xl hover:bg-gray-100 transition-colors relative"
      >
        <Bell className="h-5 w-5 text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-semibold">
            {unreadCount}
          </span>
        )}
      </motion.button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.18 }}
              className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 z-20"
            >
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full font-semibold">
                      {unreadCount} new
                    </span>
                  )}
                </div>
              </div>

              <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-4 text-sm text-gray-500">No notifications</div>
                ) : (
                  notifications.map((n) => {
                    const { title } = formatNotification(n);
                    return (
                      <div
                        key={n.id}
                        onClick={() => handleClick(n)}
                        className={`p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${!n.is_read ? 'bg-blue-50' : ''}`}
                      >
                        <div className="flex gap-3">
                          <div className={`h-2 w-2 rounded-full mt-2 flex-shrink-0 ${!n.is_read ? 'bg-blue-600' : 'bg-transparent'}`} />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm text-gray-900 whitespace-normal break-words">{title || n.message}</p>
                            <p className="text-xs text-gray-400 mt-1">{new Date(n.created_at).toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <div className="p-3 border-t border-gray-200">
                <button
                  onClick={() => navigate('/admin/notifications')}
                  className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  View all notifications
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * NotificationBell Component
 * Displays notification icon with badge and popover list
 */

import React, { useCallback } from 'react';
import { BellRing, FileText } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import NotificationItem from './NotificationItem';
import useNotifications from '@/hooks/useNotifications';
import { formatDistanceToNow } from 'date-fns';
import { formatNotification } from '@/lib/notificationUtils';

const NotificationBell = () => {
  const { 
    notifications: apiNotifications = [], 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    refresh 
  } = useNotifications();

  // Map API notification shape to the UI notification shape expected by NotificationItem
  const notifications = apiNotifications.map((n) => {
    const { title, description } = formatNotification(n);
    // Parse is_read to boolean (API might return string "false"/"true")
    const isRead = n.is_read === true || n.is_read === 'true';
    return {
      id: n.id,
      type: n.type || 'info',
      icon: FileText,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      title: title || n.message || (n.metadata && n.metadata.title) || 'Notification',
      description: description || (n.metadata && n.metadata.description) || '',
      time: formatDistanceToNow(new Date(n.created_at || Date.now()), { addSuffix: true }),
      isNew: !isRead,
      original: n,
    };
  });

  /**
   * Handle dismiss notification
   */
  const handleDismiss = useCallback((notificationId) => {
    // mark as read when dismissing
    markAsRead && markAsRead(notificationId);
  }, [markAsRead]);

  /**
   * Mark all as read
   */
  const handleMarkAllAsRead = useCallback(() => {
    if (!markAllAsRead) return;
    markAllAsRead();
  }, [markAllAsRead]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          aria-label="Open notifications"
          className="relative p-1 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          onClick={() => { refresh && refresh(); }}
        >
          <BellRing className="h-6 w-6 text-gray-600" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 inline-flex items-center justify-center h-4 w-4 rounded-full bg-red-500 text-[10px] text-white font-bold">
              {unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-96 p-0 shadow-2xl border border-gray-200 overflow-hidden rounded-lg">
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
              notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onDismiss={handleDismiss}
                  onClick={(id) => { markAsRead && markAsRead(id); }}
                />
              ))
            ) : (
              <div className="py-8 text-center text-gray-500 text-sm">
                You're all caught up — no notifications
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t">
          <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
            View all
          </button>
          <span className="text-xs text-gray-500">Updated just now</span>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default React.memo(NotificationBell);

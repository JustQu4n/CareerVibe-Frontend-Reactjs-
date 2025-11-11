/**
 * NotificationBell Component
 * Displays notification icon with badge and popover list
 */

import React, { useState, useCallback } from 'react';
import { BellRing } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import NotificationItem from './NotificationItem';
import { MOCK_NOTIFICATIONS, NOTIFICATION_COUNT } from '@/constants/navbar.constants';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [unreadCount, setUnreadCount] = useState(NOTIFICATION_COUNT);

  /**
   * Handle dismiss notification
   */
  const handleDismiss = useCallback((notificationId) => {
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
    setUnreadCount((prev) => Math.max(0, prev - 1));
  }, []);

  /**
   * Mark all as read
   */
  const handleMarkAllAsRead = useCallback(() => {
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, isNew: false }))
    );
    setUnreadCount(0);
  }, []);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          aria-label="Open notifications"
          className="relative p-1 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <BellRing className="h-6 w-6 text-gray-600" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 inline-flex items-center justify-center h-4 w-4 rounded-full bg-red-500 text-[10px] text-white font-bold">
              {unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-80 p-0 shadow-lg border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 px-4 py-3 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-800">Notifications</h2>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full font-medium">
                  {unreadCount} new
                </span>
              )}
              <button
                onClick={handleMarkAllAsRead}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium"
              >
                Mark all as read
              </button>
            </div>
          </div>
        </div>

        {/* Notification List */}
        <div className="max-h-[320px] overflow-y-auto">
          <div className="divide-y divide-gray-100">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onDismiss={handleDismiss}
                />
              ))
            ) : (
              <div className="py-8 text-center text-gray-500 text-sm">
                No notifications
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-4 py-2 border-t border-gray-100 text-center">
          <button className="text-sm text-gray-600 hover:text-indigo-700 font-medium transition-colors">
            View all notifications
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default React.memo(NotificationBell);

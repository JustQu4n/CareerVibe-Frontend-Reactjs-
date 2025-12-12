/**
 * NotificationItem Component
 * Individual notification item with icon, message, timestamp, and read status
 */

import React from 'react';
import { useNotifications } from '../../hooks/useNotifications';
import { 
  formatDistanceToNow, 
  getNotificationIcon, 
  getNotificationTitle,
  formatNotification 
} from '../../lib/notificationUtils';

const NotificationItem = ({ notification, onClick }) => {
  const { markAsRead } = useNotifications();

  const handleClick = () => {
    if (!notification.is_read) {
      markAsRead(notification.id);
    }

    // Call parent onClick handler if provided
    if (onClick) {
      onClick(notification);
    }
  };

  const iconConfig = getNotificationIcon(notification.type);
  const title = getNotificationTitle(notification.type);
  const message = notification.message || '';

  return (
    <div
      onClick={handleClick}
      className={`group relative p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-all duration-200 ${
        !notification.is_read ? 'bg-blue-50/50' : 'bg-white'
      }`}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleClick();
        }
      }}
    >
      <div className="flex items-start gap-3">
        {/* Icon with background */}
        <div 
          className={`flex-shrink-0 w-10 h-10 ${iconConfig.bgColor} ${iconConfig.textColor} rounded-full flex items-center justify-center text-xl transition-transform group-hover:scale-110`}
        >
          {iconConfig.emoji}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title */}
          <div className="flex items-center gap-2 mb-1">
            <h4
              className={`text-sm font-semibold ${
                !notification.is_read ? 'text-gray-900' : 'text-gray-700'
              }`}
            >
              {title}
            </h4>
            {!notification.is_read && (
              <span className="inline-block w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
            )}
          </div>

          {/* Message */}
          <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
            {message}
          </p>

          {/* Metadata */}
          {notification.metadata && (
            <div className="flex flex-wrap items-center gap-2 mt-2">
              {/* Status Badge */}
              {notification.metadata.status && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700">
                  {notification.metadata.status}
                </span>
              )}
              
              {/* Job Title */}
              {notification.metadata.job_title && (
                <span className="inline-flex items-center text-xs text-gray-500">
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {notification.metadata.job_title}
                </span>
              )}

              {/* Application ID */}
              {notification.metadata.application_id && (
                <span className="inline-flex items-center text-xs text-gray-400">
                  ID: {notification.metadata.application_id.substring(0, 8)}
                </span>
              )}
            </div>
          )}

          {/* Timestamp */}
          <p className="text-xs text-gray-400 mt-2 flex items-center">
            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {formatDistanceToNow(notification.created_at)}
          </p>
        </div>

        {/* Action indicator on hover */}
        <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;

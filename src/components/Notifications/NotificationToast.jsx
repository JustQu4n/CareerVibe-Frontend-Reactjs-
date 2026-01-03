/**
 * NotificationToast Component
 * Real-time toast notification that appears when new notifications arrive
 */

import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { getNotificationIcon, getNotificationTitle } from '@/lib/notificationUtils';

const NotificationToast = ({ notification, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setIsVisible(true), 100);

    // Auto-close after 5 seconds
    const autoCloseTimer = setTimeout(() => {
      handleClose();
    }, 5000);

    return () => {
      clearTimeout(timer);
      clearTimeout(autoCloseTimer);
    };
  }, []);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      setIsVisible(false);
      if (onClose) onClose();
    }, 300);
  };

  if (!notification) return null;

  const iconConfig = getNotificationIcon(notification.type);
  const title = getNotificationTitle(notification.type);
  const message = notification.message || '';

  return (
    <div
      className={`fixed top-4 right-4 z-[9999] transition-all duration-300 ease-out ${
        isVisible && !isLeaving
          ? 'translate-x-0 opacity-100'
          : 'translate-x-full opacity-0'
      }`}
      role="alert"
      aria-live="polite"
    >
      <div className="w-96 bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden">
        {/* Colored top border */}
        <div className={`h-1 ${iconConfig.bgColor}`}></div>

        <div className="p-4">
          <div className="flex items-start gap-3">
            {/* Icon */}
            <div
              className={`flex-shrink-0 w-10 h-10 ${iconConfig.bgColor} ${iconConfig.textColor} rounded-full flex items-center justify-center text-xl`}
            >
              {iconConfig.emoji}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <h4 className="text-sm font-bold text-gray-900">{title}</h4>
                <button
                  onClick={handleClose}
                  className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Close notification"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <p className="text-sm text-gray-600 mt-1 line-clamp-2">{message}</p>

              {/* Metadata */}
              {notification.metadata && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {notification.metadata.job_title && (
                    <span className="inline-flex items-center text-xs text-gray-500">
                      <svg
                        className="w-3 h-3 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      {notification.metadata.job_title}
                    </span>
                  )}

                  {notification.metadata.company_name && (
                    <span className="inline-flex items-center text-xs text-gray-500">
                      <svg
                        className="w-3 h-3 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                      {notification.metadata.company_name}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-gray-100 overflow-hidden">
          <div
            className={`h-full ${iconConfig.bgColor} ${iconConfig.textColor} transition-all duration-[5000ms] ease-linear`}
            style={{
              width: isVisible && !isLeaving ? '0%' : '100%',
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default NotificationToast;

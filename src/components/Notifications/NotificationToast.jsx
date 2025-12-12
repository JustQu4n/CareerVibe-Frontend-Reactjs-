/**
 * NotificationToast Component
 * Toast popup for showing new notifications in real-time
 */

import React, { useEffect, useState } from 'react';
import { getNotificationIcon, getNotificationTitle, formatNotification } from '../../lib/notificationUtils';

const NotificationToast = ({ notification, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Auto dismiss after 5 seconds
    const timer = setTimeout(() => {
      handleClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 300); // Wait for fade out animation
  };

  if (!isVisible) return null;

  const iconConfig = getNotificationIcon(notification.type);
  const title = getNotificationTitle(notification.type);
  const message = notification.message || '';

  return (
    <div
      className={`fixed top-4 right-4 z-[9999] transition-all duration-300 ${
        isExiting ? 'opacity-0 translate-x-full' : 'opacity-100 translate-x-0'
      }`}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div className="bg-white rounded-lg shadow-2xl border border-gray-200 p-4 max-w-sm min-w-[20rem] hover:shadow-3xl transition-shadow">
        <div className="flex items-start gap-3">
          {/* Icon with animated background */}
          <div 
            className={`flex-shrink-0 w-10 h-10 ${iconConfig.bgColor} ${iconConfig.textColor} rounded-full flex items-center justify-center text-xl animate-bounce`}
            style={{ animationIterationCount: 1, animationDuration: '0.6s' }}
          >
            {iconConfig.emoji}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-gray-900 mb-1 flex items-center gap-2">
              {title}
              <span className="inline-block w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse"></span>
            </h4>
            <p className="text-sm text-gray-700 line-clamp-2 leading-relaxed">
              {message}
            </p>
            
            {/* Metadata badges */}
            {notification.metadata && (
              <div className="flex flex-wrap items-center gap-2 mt-2">
                {notification.metadata.status && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700">
                    {notification.metadata.status}
                  </span>
                )}
                {notification.metadata.job_title && (
                  <span className="inline-flex items-center text-xs text-gray-500 truncate max-w-[200px]">
                    <svg className="w-3 h-3 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {notification.metadata.job_title}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Close Button */}
          <button
            onClick={handleClose}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300 rounded p-1 transition-colors"
            aria-label="Close notification"
          >
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        {/* Progress bar */}
        <div className="mt-3 w-full bg-gray-200 rounded-full h-1 overflow-hidden">
          <div
            className={`h-full ${iconConfig.bgColor} ${iconConfig.textColor} transition-all`}
            style={{
              animation: 'progress 5s linear',
            }}
          ></div>
        </div>
      </div>

      <style jsx>{`
        @keyframes progress {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </div>
  );
};

export default NotificationToast;

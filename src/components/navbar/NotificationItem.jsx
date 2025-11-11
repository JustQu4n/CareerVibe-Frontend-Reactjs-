/**
 * NotificationItem Component
 * Displays a single notification in the notification list
 */

import React from 'react';
import PropTypes from 'prop-types';
import { X } from 'lucide-react';

const NotificationItem = ({ notification, onDismiss }) => {
  const Icon = notification.icon;

  return (
    <div className="relative py-3 px-4 hover:bg-gray-50 transition-colors cursor-pointer group">
      {/* New indicator */}
      {notification.isNew && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-r-full" />
      )}

      <div className="flex gap-3">
        {/* Icon */}
        <div className="flex-shrink-0 mt-0.5">
          <div className={`h-9 w-9 ${notification.iconBg} rounded-full flex items-center justify-center ${notification.iconColor}`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-1">
            <p className="text-sm font-medium text-gray-900 mr-2">
              {notification.title}
            </p>
            <span className="text-xs text-gray-500 whitespace-nowrap">
              {notification.time}
            </span>
          </div>

          <p className="text-xs text-gray-600 line-clamp-2">
            {notification.description}
          </p>

          {/* Actions */}
          {notification.action && (
            <div className="mt-2 flex items-center justify-between">
              <button
                onClick={notification.action.onClick}
                className="text-xs text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
              >
                {notification.action.label}
              </button>
              {onDismiss && (
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDismiss(notification.id);
                    }}
                    className="p-0.5 rounded hover:bg-gray-200 transition-colors"
                    aria-label="Dismiss notification"
                  >
                    <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

NotificationItem.propTypes = {
  notification: PropTypes.shape({
    id: PropTypes.number.isRequired,
    type: PropTypes.string.isRequired,
    icon: PropTypes.elementType.isRequired,
    iconBg: PropTypes.string.isRequired,
    iconColor: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired,
    isNew: PropTypes.bool,
    action: PropTypes.shape({
      label: PropTypes.string.isRequired,
      onClick: PropTypes.func.isRequired,
    }),
  }).isRequired,
  onDismiss: PropTypes.func,
};

export default React.memo(NotificationItem);

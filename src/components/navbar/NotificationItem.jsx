/**
 * NotificationItem Component
 * Displays a single notification in the notification list
 */

import React from 'react';
import PropTypes from 'prop-types';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NotificationItem = ({ notification, onDismiss, onClick }) => {
  const Icon = notification.icon;
  const navigate = useNavigate();

  const openJob = (e) => {
    e.stopPropagation();
    const jobId = notification.original?.metadata?.job_post_id;
    if (jobId) navigate(`/view-job-detail/${jobId}`);
  };

  const openApplications = (e) => {
    e.stopPropagation();
    navigate('/jobseeker-applications');
  };

  return (
    <div
      className={`flex items-start gap-3 p-3 transition-shadow bg-white hover:shadow-sm rounded-md cursor-pointer ${notification.isNew ? '' : ''}`}
      onClick={() => onClick && onClick(notification.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') onClick && onClick(notification.id); }}
    >
      {/* Icon */}
      <div className="flex-shrink-0">
        <div className={`h-10 w-10 ${notification.iconBg} rounded-lg flex items-center justify-center ${notification.iconColor}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <p className="text-sm  text-gray-900 whitespace-normal break-words leading-snug">{notification.title}</p>
            {notification.description ? (
              <p className="text-xs text-gray-500 mt-1 whitespace-normal break-words">{notification.description}</p>
            ) : null}
          </div>

          <div className="flex-shrink-0 text-right ml-2">
            <div className="text-xs text-gray-400">{notification.time}</div>
            {notification.isNew && <div className="mt-2 h-2 w-2 rounded-full bg-indigo-500 mx-auto" />}
          </div>
        </div>
      </div>

      {/* Actions & Dismiss 
      {/* <div className="ml-2 flex-shrink-0 flex flex-col items-end gap-2">
        {notification.original?.metadata && (
          <div className="flex flex-col items-end gap-2">
            {notification.original.metadata.job_post_id && (
              <button
                onClick={openJob}
                className="text-xs px-2 py-1 rounded bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
              >
                Open job
              </button>
            )}
            <button
              onClick={openApplications}
              className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              View applications
            </button>
          </div>
        )}

        {onDismiss && (
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => { e.stopPropagation(); onDismiss(notification.id); }}
              className="p-1 rounded hover:bg-gray-100"
              aria-label="Dismiss"
            >
              <X className="h-4 w-4 text-gray-400" />
            </button>
          </div>
        )}
      </div>
      */}
    </div>
  );
};

NotificationItem.propTypes = {
  notification: PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
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

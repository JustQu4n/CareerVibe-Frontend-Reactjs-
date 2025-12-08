import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import NotificationList from './NotificationList';
import useNotifications from '@/hooks/useNotifications';
import '../Notifications/styles.css';

const NotificationIcon = ({ userId }) => {
  const { notifications, unreadCount, markAsRead } = useNotifications({ userId });
  const [open, setOpen] = useState(false);

  return (
    <div className="cv-notification-root">
      <button className="cv-notification-button" onClick={() => setOpen((s) => !s)} aria-label="Notifications">
        <Bell className="cv-notification-bell" />
        {unreadCount > 0 && <span className="cv-notification-badge">{unreadCount}</span>}
      </button>
      {open && (
        <div className="cv-notification-panel">
          <NotificationList notifications={notifications} onMarkRead={markAsRead} />
        </div>
      )}
    </div>
  );
};

export default NotificationIcon;

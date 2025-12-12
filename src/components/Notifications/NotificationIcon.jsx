import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import NotificationList from './NotificationList';
import '../Notifications/styles.css';

// Minimal icon that shows a disabled placeholder — notifications removed per request.
const NotificationIcon = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="cv-notification-root">
      <button className="cv-notification-button" onClick={() => setOpen((s) => !s)} aria-label="Notifications">
        <Bell className="cv-notification-bell" />
      </button>
      {open && (
        <div className="cv-notification-panel">
          <NotificationList />
        </div>
      )}
    </div>
  );
};

export default NotificationIcon;

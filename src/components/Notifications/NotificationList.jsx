import React from 'react';
import { formatDistanceToNow } from 'date-fns';

const NotificationItem = ({ n, onMarkRead }) => {
  return (
    <div className={`cv-notification-item ${n.is_read ? 'read' : 'unread'}`} onClick={() => onMarkRead(n.id)}>
      <div className="cv-notification-body">
        <div className="cv-notification-message">{n.message}</div>
        <div className="cv-notification-meta">{formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}</div>
      </div>
      <div className="cv-notification-indicator">{n.is_read ? '' : '●'}</div>
    </div>
  );
};

const NotificationList = ({ notifications = [], onMarkRead = () => {} }) => {
  if (!notifications || notifications.length === 0) {
    return <div className="cv-notification-empty">No notifications</div>;
  }

  return (
    <div className="cv-notification-list">
      {notifications.map((n) => (
        <NotificationItem key={n.id} n={n} onMarkRead={onMarkRead} />
      ))}
    </div>
  );
};

export default NotificationList;

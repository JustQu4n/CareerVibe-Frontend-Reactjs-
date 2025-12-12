// Notifications removed per user request — provide a safe no-op hook to keep imports intact.

export default function useNotifications() {
  const notifications = [];
  const markAsRead = async () => {};
  const unreadCount = 0;
  const connected = false;
  const refresh = async () => {};

  return { notifications, markAsRead, unreadCount, connected, refresh };
}

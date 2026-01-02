/**
 * Notification Context
 * Provides notification state and WebSocket integration to the entire app
 */

import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import notificationService from '../services/notificationService';
import { playNotificationSound } from '../lib/notificationUtils';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [toastNotification, setToastNotification] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Get user and token from Redux store
  const { user, token: reduxToken } = useSelector((store) => store.auth);
  
  // Get token from multiple sources for backward compatibility
  const getToken = () => {
    return reduxToken || 
           localStorage.getItem('accessToken') || 
           localStorage.getItem('token') || 
           localStorage.getItem('access_token');
  };

  /**
   * Fetch unread count from API
   */
  const fetchUnreadCount = async () => {
    const token = getToken();
    if (!token) return;

    try {
      const count = await notificationService.fetchUnreadCount(token);
      setUnreadCount(count);
    } catch (err) {
      console.error('Failed to fetch unread count:', err);
    }
  };

  // Initialize WebSocket connection and load notifications
  useEffect(() => {
    const token = getToken();
    const userId = user?.id || user?.user_id;

    if (!userId || !token) {
      console.log('Waiting for authentication...', { userId, hasToken: !!token });
      return;
    }

    console.log('✅ Initializing notification system for user:', userId);

    // Connect to WebSocket
    notificationService.connect(userId, token);

    // Listen for new notifications
    const unsubscribe = notificationService.onNotification((notification) => {
      console.log('📬 Received notification in context:', notification);
      
      // Add new notification to the top of the list
      setNotifications((prev) => [notification, ...prev]);

      // Fetch updated unread count from server
      fetchUnreadCount();

      // Show toast notification
      setToastNotification(notification);

      // Play notification sound
      playNotificationSound();

      // Optional: Show browser notification
      // showBrowserNotification(notification);
    });

    // Fetch initial notifications and unread count
    loadNotifications();
    fetchUnreadCount();

    // Cleanup on unmount
    return () => {
      unsubscribe();
      notificationService.disconnect(userId);
    };
  }, [user?.id, user?.user_id]);

  /**
   * Load notifications from API
   * @param {number} page - Page number to load
   */
  const loadNotifications = async (page = 1) => {
    const token = getToken();
    if (!token) {
      console.log('No token available for fetching notifications');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('📡 Fetching notifications from API...');
      const response = await notificationService.fetchNotifications(token, page, 20);
      console.log('✅ Notifications fetched:', response);
      
      if (page === 1) {
        setNotifications(response.data || []);
        // Fetch unread count from dedicated endpoint
        fetchUnreadCount();
      } else {
        setNotifications((prev) => [...prev, ...(response.data || [])]);
      }

      // Check if there are more pages
      setHasMore(page < (response.meta?.totalPages || 1));
      setCurrentPage(page);
    } catch (err) {
      setError(err.message);
      console.error('Failed to load notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Load more notifications (for pagination)
   */
  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      loadNotifications(currentPage + 1);
    }
  }, [loading, hasMore, currentPage]);

  /**
   * Mark notification as read
   * @param {string} notificationId - Notification ID to mark as read
   */
  const markAsRead = async (notificationId) => {
    const token = getToken();
    if (!token) return;

    try {
      await notificationService.markAsRead(notificationId, token);

      // Update local state
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, is_read: true } : n))
      );

      // Fetch updated unread count from server
      fetchUnreadCount();
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  /**
   * Mark all notifications as read
   */
  const markAllAsRead = async () => {
    const token = getToken();
    if (!token) return;

    try {
      await notificationService.markAllAsRead(token);
      
      // Update local state - mark all as read
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, is_read: true }))
      );

      // Reset unread count
      setUnreadCount(0);
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

  /**
   * Clear toast notification
   */
  const clearToast = () => {
    setToastNotification(null);
  };

  /**
   * Refresh notifications
   */
  const refresh = () => {
    setCurrentPage(1);
    loadNotifications(1);
  };

  const value = {
    notifications,
    unreadCount,
    loading,
    error,
    toastNotification,
    hasMore,
    loadNotifications,
    loadMore,
    markAsRead,
    markAllAsRead,
    clearToast,
    refresh,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

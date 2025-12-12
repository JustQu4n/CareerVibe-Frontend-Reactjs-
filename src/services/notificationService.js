/**
 * Notification Service
 * Handles WebSocket connections and REST API calls for notifications
 */

import { io } from 'socket.io-client';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

class NotificationService {
  constructor() {
    this.socket = null;
    this.listeners = [];
  }

  /**
   * Connect to Socket.IO server
   * @param {string} userId - User ID to join notification room
   * @param {string} token - JWT token for authentication
   */
  connect(userId, token) {
    if (this.socket?.connected) {
      console.log('Already connected to notification server');
      return;
    }

    this.socket = io(BACKEND_URL, {
      transports: ['websocket'],
      auth: {
        token: `Bearer ${token}`,
      },
    });

    this.socket.on('connect', () => {
      console.log('✅ Connected to notification server:', this.socket.id);
      // Join user's notification room
      this.socket.emit('join', userId);
    });

    this.socket.on('notification', (notification) => {
      console.log('🔔 New notification received:', notification);
      // Notify all listeners
      this.listeners.forEach((callback) => callback(notification));
    });

    this.socket.on('disconnect', () => {
      console.log('❌ Disconnected from notification server');
    });

    this.socket.on('connect_error', (error) => {
      console.error('❌ Connection error:', error);
    });

    this.socket.on('error', (error) => {
      console.error('❌ Socket error:', error);
    });
  }

  /**
   * Disconnect from server
   * @param {string} userId - User ID to leave notification room
   */
  disconnect(userId) {
    if (this.socket) {
      this.socket.emit('leave', userId);
      this.socket.disconnect();
      this.socket = null;
      console.log('🔌 Disconnected from notification service');
    }
  }

  /**
   * Add listener for new notifications
   * @param {Function} callback - Callback function to handle new notifications
   * @returns {Function} Unsubscribe function
   */
  onNotification(callback) {
    this.listeners.push(callback);
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter((cb) => cb !== callback);
    };
  }

  /**
   * Fetch notifications from REST API
   * @param {string} token - JWT token
   * @param {number} page - Page number
   * @param {number} limit - Number of notifications per page
   * @returns {Promise<Object>} Notifications data with pagination
   */
  async fetchNotifications(token, page = 1, limit = 20) {
    try {
      const response = await fetch(
        `${BACKEND_URL}/api/notifications/list?page=${page}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch notifications: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('❌ Error fetching notifications:', error);
      throw error;
    }
  }

  /**
   * Mark notification as read
   * @param {string} notificationId - Notification ID
   * @param {string} token - JWT token
   * @returns {Promise<Object>} Updated notification
   */
  async markAsRead(notificationId, token) {
    try {
      const response = await fetch(
        `${BACKEND_URL}/api/notifications/${notificationId}/read`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to mark notification as read: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('❌ Error marking notification as read:', error);
      throw error;
    }
  }

  /**
   * Get connection status
   * @returns {boolean} Whether socket is connected
   */
  isConnected() {
    return this.socket?.connected || false;
  }
}

// Export singleton instance
export default new NotificationService();

import { useEffect, useRef, useState, useCallback } from 'react';
import { io } from 'socket.io-client';
import { fetchNotifications, markNotificationRead } from '@/api/notifications';
import { toast } from 'sonner';

/**
 * useNotifications hook
 * @param {Object} options
 * @param {string} options.userId - required user id to join room
 * @param {string} options.accessToken - optional access token (falls back to localStorage)
 */
export default function useNotifications({ userId, accessToken } = {}) {
  const [notifications, setNotifications] = useState([]);
  const [connected, setConnected] = useState(false);
  const socketRef = useRef(null);
  const pollingRef = useRef(null);

  const token = accessToken || localStorage.getItem('accessToken') || localStorage.getItem('access_token');
  // Prefer an explicit socket URL when available. This avoids routing
  // websocket traffic through the Vite proxy (which can cause ECONNABORTED
  // errors for long-lived socket.io connections). Set `VITE_SOCKET_URL`
  // in your `.env` (e.g. `VITE_SOCKET_URL=http://localhost:5000`) to
  // force direct backend connection. Otherwise fall back to same origin
  // in development.
  const base = import.meta.env.VITE_SOCKET_URL || (import.meta.env.DEV ? '' : import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000');

  const loadInitial = useCallback(async () => {
    try {
      const list = await fetchNotifications();
      // sort newest first
      list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setNotifications(list);
    } catch (e) {
      console.warn('Failed to load notifications', e);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    loadInitial();

    // attempt socket connection
    try {
      const opts = {
        withCredentials: true,
        // allow polling first for broader compatibility, socket.io will upgrade to websocket when possible
        transports: ['polling', 'websocket'],
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      };
      if (token) {
        opts.auth = { token: `Bearer ${token}` };
      }

      const connectTo = (url) => {
        const connectUrl = url || undefined; // undefined => same origin
        console.debug('Attempting socket.io connect to', connectUrl ?? 'current origin', { token: !!token });
        const socket = io(connectUrl, opts);
        socketRef.current = socket;

        socket.on('connect', () => {
          console.debug('Socket connected', socket.id);
          setConnected(true);
          if (userId) {
            socket.emit('join', { userId });
            socket.emit('joinRoom', `user:${userId}`);
          }
        });

        socket.on('connect_error', (err) => {
          console.warn('Socket connect_error', err);
        });

        socket.on('reconnect_attempt', (n) => {
          console.debug('Socket reconnect attempt', n);
        });

        socket.on('notification', (payload) => {
          try {
            console.debug('Incoming notification', payload);
            setNotifications((prev) => [payload, ...prev]);
            // Show in-app toast for realtime notification
            try {
              if (payload && payload.message) {
                toast(payload.message);
              }
            } catch (tt) {
              console.warn('Toast failed', tt);
            }
            if (typeof window !== 'undefined' && 'Notification' in window) {
              if (window.Notification.permission === 'granted') {
                new window.Notification('New notification', { body: payload.message });
              } else if (window.Notification.permission !== 'denied') {
                window.Notification.requestPermission().then((perm) => {
                  if (perm === 'granted') new window.Notification('New notification', { body: payload.message });
                });
              }
            }
          } catch (e) {
            console.warn('Error handling incoming notification', e);
          }
        });

        socket.on('disconnect', (reason) => {
          console.debug('Socket disconnected', reason);
          setConnected(false);
          if (!pollingRef.current) pollingRef.current = setInterval(loadInitial, 30000);
        });

        return socket;
      };

      // Try primary base, then fall back to explicit /socket.io path
      const baseUrl = base.replace(/\/+$/, '');
      let socket = connectTo(baseUrl);

      // if connect fails quickly, try alternate path after short delay
      setTimeout(() => {
        if (!socketRef.current || socketRef.current.disconnected) {
          console.debug('Primary socket connect not active; trying explicit socket.io path');
          try {
            connectTo(baseUrl + '/socket.io');
          } catch (e) {
            console.warn('Secondary socket connect failed', e);
          }
        }
      }, 1200);

      // cleanup on unmount
      return () => {
        mounted = false;
        try {
          if (socketRef.current) socketRef.current.disconnect();
        } catch (e) {}
        if (pollingRef.current) {
          clearInterval(pollingRef.current);
          pollingRef.current = null;
        }
      };
    } catch (err) {
      console.warn('Socket initialization failed', err);
      if (!pollingRef.current) pollingRef.current = setInterval(loadInitial, 30000);
    }
  }, [base, token, userId, loadInitial]);

  // expose a refresh function so consumers can manually reload notifications
  const refresh = loadInitial;

  const markAsRead = useCallback(async (id) => {
    // optimistic update
    setNotifications((prev) => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    try {
      await markNotificationRead(id);
    } catch (e) {
      console.warn('Failed to mark read', e);
      // revert optimistic update on failure
      setNotifications((prev) => prev.map(n => n.id === id ? { ...n, is_read: false } : n));
    }
  }, []);

  const unreadCount = notifications.reduce((acc, n) => acc + (n.is_read ? 0 : 1), 0);

  return {
    notifications,
    markAsRead,
    unreadCount,
    connected,
    refresh,
  };
}

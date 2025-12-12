import type { Notification } from '@/types/notification';

const envBase = 'http://localhost:5000';

// Candidate endpoints to try (most likely first). We try relative paths first so Vite
// dev proxy can forward requests and avoid CORS issues during development.
const ENDPOINT_CANDIDATES = [
  '/api/notifications/list',
  '/api/notifications',
  '/notifications',
  '/api/v1/notifications',
];

const FULL_CANDIDATES = ENDPOINT_CANDIDATES.map((p) => p).concat(
  ENDPOINT_CANDIDATES.map((p) => envBase.replace(/\/+$/, '') + p)
);

async function tryFetch(url: string, token?: string) {
  const headers = {
    'Content-Type': 'application/json',
  } as Record<string, string>;
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(url, {
    method: 'GET',
    credentials: 'include',
    headers,
  // Notifications API removed per user request.
  // Provide minimal no-op functions to keep imports valid while you reimplement notifications later.

  import type { Notification } from '@/types/notification';

  export const fetchNotifications = async (): Promise<Notification[]> => {
    return [];
  };

  export const markNotificationRead = async (_id: string): Promise<void> => {
    return;
  };

  export default {
    fetchNotifications,
    markNotificationRead,
  };
  return data?.data ?? data;

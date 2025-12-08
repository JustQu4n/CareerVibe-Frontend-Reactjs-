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
  });

  if (res.status === 404) {
    const err: any = new Error('Not found');
    err.status = 404;
    throw err;
  }

  if (!res.ok) {
    const txt = await res.text().catch(() => '');
    const err: any = new Error(`Request failed: ${res.status} ${res.statusText} ${txt}`);
    err.status = res.status;
    throw err;
  }

  const data = await res.json().catch(() => null);
  // some APIs wrap payload in { data: [...] }
  return data?.data ?? data;
}

export const fetchNotifications = async (): Promise<Notification[]> => {
  const token =
    localStorage.getItem('accessToken') ||
    localStorage.getItem('access_token') ||
    localStorage.getItem('token');

  for (const candidate of FULL_CANDIDATES) {
    const url = candidate;
    try {
      const payload = await tryFetch(url, token || undefined);
      if (!payload) return [];

      // Debug: log which candidate succeeded (helps track proxied vs absolute)
      try {
        const len = Array.isArray(payload) ? payload.length : (payload?.length ?? Object.keys(payload ?? {}).length);
        console.debug('[notifications] fetched', url, 'items:', len);
      } catch (e) {
        console.debug('[notifications] fetched', url);
      }

      // Support multiple response container shapes from different backends
      if (Array.isArray(payload)) return payload;
      // common keys: data, notifications, list, items, results, rows
      const keys = ['data', 'notifications', 'list', 'items', 'results', 'rows'];
      for (const k of keys) {
        if (payload[k]) {
          return Array.isArray(payload[k]) ? payload[k] : payload[k].data ?? [];
        }
      }

      // if payload itself has a notifications-like field at top-level
      return payload.notifications ?? payload.data ?? [];
    } catch (err: any) {
      // continue on 404, otherwise rethrow so caller can decide
      if (err?.status === 404) {
        console.debug('[notifications] candidate returned 404:', url);
        continue;
      }
      console.warn('fetchNotifications failed for', url, err);
      throw err;
    }
  }

  // none found — return empty list
  return [];
};

export const markNotificationRead = async (id: string): Promise<void> => {
  const token =
    localStorage.getItem('accessToken') ||
    localStorage.getItem('access_token') ||
    localStorage.getItem('token');
  const candidates = [
    `/api/notifications/${id}/read`,
    `/notifications/${id}/read`,
    `/api/v1/notifications/${id}/read`,
  ];

  const fullCandidates = candidates.concat(candidates.map((p) => envBase.replace(/\/+$/, '') + p));

  for (const url of fullCandidates) {
    try {
      const headers: any = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const res = await fetch(url, { method: 'PATCH', credentials: 'include', headers });
      if (res.status === 404) continue;
      if (!res.ok) {
        const txt = await res.text().catch(() => '');
        throw new Error(`mark read failed ${res.status} ${txt}`);
      }
      return;
    } catch (e: any) {
      if (e?.status === 404) continue;
      console.warn('markNotificationRead error for', url, e);
      // rethrow so hook can revert optimistic UI
      throw e;
    }
  }
};

export default {
  fetchNotifications,
  markNotificationRead,
};

const APPLICATION_STATUS_LABELS = {
  applied: 'Applied',
  reviewed: 'Reviewed',
  shortlisted: 'Shortlisted',
  interview: 'Interview scheduled',
  offered: 'Offered',
  rejected: 'Rejected',
  accepted: 'Accepted',
  hired: 'Hired',
};

/**
 * Format a notification for display. If the notification is an
 * application status update and contains a status enum in metadata,
 * replace the raw enum with a friendly label.
 */
export function formatNotification(n) {
  if (!n) return { title: '', description: '' };

  // Prefer explicit message if backend provided it
  let title = n.message || n.title || '';
  let description = n.description || '';

  if (n.type === 'application_status_updated' || n.type === 'APPLICATION_STATUS_UPDATED') {
    const status = n.metadata?.status || n.metadata?.new_status || n.metadata?.application_status;
    const label = status ? (APPLICATION_STATUS_LABELS[status] || String(status)) : null;
    if (label) {
      title = `Your application status has been updated: ${label}`;
    }
  }

  return { title, description };
}

export default { formatNotification };

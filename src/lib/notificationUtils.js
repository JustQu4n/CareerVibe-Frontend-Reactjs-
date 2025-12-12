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
 * Format relative time from date string
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted relative time
 */
export function formatDistanceToNow(dateString) {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;

    return date.toLocaleDateString();
  } catch (error) {
    return 'Unknown time';
  }
}

// Notification type titles mapping
export const NOTIFICATION_TITLES = {
  application_submitted: 'Application Submitted',
  new_application: 'New Application Received',
  application_status_updated: 'Application Status Updated',
  application_accepted: 'Application Accepted',
  application_rejected: 'Application Rejected',
  interview_scheduled: 'Interview Scheduled',
  message_received: 'New Message',
  job_posted: 'New Job Posted',
  job_expired: 'Job Expired',
  company_followed: 'Company Followed',
  profile_viewed: 'Profile Viewed',
  default: 'Notification',
};

/**
 * Get notification title based on type
 * @param {string} type - Notification type
 * @returns {string} Notification title
 */
export function getNotificationTitle(type) {
  return NOTIFICATION_TITLES[type] || NOTIFICATION_TITLES.default;
}

/**
 * Get icon for notification type (returns SVG icon class or emoji)
 * @param {string} type - Notification type
 * @returns {Object} Icon configuration with component and style
 */
export function getNotificationIcon(type) {
  const iconConfigs = {
    application_submitted: {
      emoji: '📝',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600',
      icon: 'document'
    },
    new_application: {
      emoji: '📋',
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-600',
      icon: 'clipboard'
    },
    application_status_updated: {
      emoji: '🔄',
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-600',
      icon: 'refresh'
    },
    application_accepted: {
      emoji: '✅',
      bgColor: 'bg-green-100',
      textColor: 'text-green-600',
      icon: 'check'
    },
    application_rejected: {
      emoji: '❌',
      bgColor: 'bg-red-100',
      textColor: 'text-red-600',
      icon: 'x'
    },
    interview_scheduled: {
      emoji: '📅',
      bgColor: 'bg-indigo-100',
      textColor: 'text-indigo-600',
      icon: 'calendar'
    },
    message_received: {
      emoji: '💬',
      bgColor: 'bg-cyan-100',
      textColor: 'text-cyan-600',
      icon: 'message'
    },
    job_posted: {
      emoji: '💼',
      bgColor: 'bg-teal-100',
      textColor: 'text-teal-600',
      icon: 'briefcase'
    },
    job_expired: {
      emoji: '⏰',
      bgColor: 'bg-orange-100',
      textColor: 'text-orange-600',
      icon: 'clock'
    },
    company_followed: {
      emoji: '⭐',
      bgColor: 'bg-pink-100',
      textColor: 'text-pink-600',
      icon: 'star'
    },
    profile_viewed: {
      emoji: '👁️',
      bgColor: 'bg-gray-100',
      textColor: 'text-gray-600',
      icon: 'eye'
    },
    default: {
      emoji: '🔔',
      bgColor: 'bg-gray-100',
      textColor: 'text-gray-600',
      icon: 'bell'
    },
  };

  return iconConfigs[type] || iconConfigs.default;
}

/**
 * Get notification color based on type
 * @param {string} type - Notification type
 * @returns {string} Tailwind color class
 */
export function getNotificationColor(type) {
  const colors = {
    application_accepted: 'text-green-600',
    application_rejected: 'text-red-600',
    interview_scheduled: 'text-blue-600',
    application_status_updated: 'text-yellow-600',
    new_application: 'text-purple-600',
    default: 'text-gray-600',
  };

  return colors[type] || colors.default;
}

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

/**
 * Play notification sound using Web Audio API
 */
export function playNotificationSound() {
  try {
    // Try to play custom sound file first
    const audio = new Audio('/notification-sound.mp3');
    audio.volume = 0.5;
    audio.play().catch((err) => {
      // If custom sound fails, use Web Audio API to create a simple beep
      console.log('Custom sound not available, using beep:', err);
      playBeepSound();
    });
  } catch (error) {
    console.log('Notification sound not available:', error);
    playBeepSound();
  }
}

/**
 * Play a simple beep sound using Web Audio API
 */
function playBeepSound() {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800; // Frequency in Hz
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  } catch (error) {
    console.log('Could not play beep sound:', error);
  }
}

/**
 * Show browser notification
 * @param {Object} notification - Notification object
 */
export function showBrowserNotification(notification) {
  if ('Notification' in window && Notification.permission === 'granted') {
    try {
      new Notification('CareerVibe Notification', {
        body: notification.message,
        icon: '/logo.png',
        badge: '/badge.png',
        tag: notification.id,
      });
    } catch (error) {
      console.log('Could not show browser notification:', error);
    }
  }
}

/**
 * Request browser notification permission
 */
export async function requestNotificationPermission() {
  if ('Notification' in window && Notification.permission === 'default') {
    try {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    } catch (error) {
      console.log('Could not request notification permission:', error);
      return false;
    }
  }
  return Notification.permission === 'granted';
}

export default { 
  formatNotification, 
  formatDistanceToNow,
  getNotificationIcon,
  getNotificationTitle,
  getNotificationColor,
  playNotificationSound,
  showBrowserNotification,
  requestNotificationPermission,
  NOTIFICATION_TITLES,
};


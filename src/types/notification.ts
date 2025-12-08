export enum NotificationType {
  NEW_APPLICATION = 'new_application',
  APPLICATION_SUBMITTED = 'application_submitted',
  APPLICATION_STATUS_UPDATED = 'application_status_updated',
}

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  message: string;
  metadata?: any;
  is_read: boolean;
  created_at: string;
}

export default Notification;

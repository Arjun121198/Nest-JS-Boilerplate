export class CreateNotificationDTO {
  readonly receiver_user_type: 'brandaccount' | 'processmanager' | 'agent' | 'admin';
  readonly receiver_id: string; // MongoDB ObjectId as a string
  readonly notification_created_user_type: 'brandaccount' | 'processmanager' | 'agent' | 'admin';
  readonly notification_created_by: string; // MongoDB ObjectId as a string
  readonly notification_data?: any[]; // Optional; specific data types can replace `any`
  readonly status?: 0 | 1; // Optional, defaults to 0 (unread)
}

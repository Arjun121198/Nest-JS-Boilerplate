import { Schema, Document, model } from 'mongoose';

export const NotificationSchema = new Schema(
  {
    receiver_user_type: {
      type: String,
      required: true,
      enum: ['brandaccount', 'processmanager', 'agent', 'admin'],
    },
    receiver_id: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: 'receiver_user_type',
    },
    notification_created_user_type: {
      type: String,
      required: true,
      enum: ['brandaccount', 'processmanager', 'agent', 'admin'],
    },
    notification_created_by: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: 'notification_created_user_type',
    },
    notification_data: {
      type: [Schema.Types.Mixed],
      default: [],
    },
    status: {
      type: Number,
      required: true,
      enum: [0, 1], // 0: unread, 1: read
      default: 0,
    },
  },
  { timestamps: true }
);

// Interface for Notification document
export interface Notification extends Document {
  receiver_user_type: 'brandaccount' | 'processmanager' | 'agent' | 'admin';
  receiver_id: Schema.Types.ObjectId;
  notification_created_user_type: 'brandaccount' | 'processmanager' | 'agent' | 'admin';
  notification_created_by: Schema.Types.ObjectId;
  notification_data: any[]; // Use specific types if possible instead of `any`
  status: 0 | 1;
  createdAt: Date;
  updatedAt: Date;
}

// Export the model
export default model<Notification>('Notification', NotificationSchema);

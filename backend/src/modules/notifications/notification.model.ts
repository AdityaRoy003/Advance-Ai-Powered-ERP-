import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  targetUserId?: string;
  targetRole?: string;
  title: string;
  body: string;
  category: 'Academic' | 'Finance' | 'Transport' | 'Hostel' | 'Security' | 'System';
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
  icon?: string;
  color?: string;
  link?: string;
  readBy: string[];
  institutionId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    targetUserId: { type: String, default: 'ALL' },
    targetRole: { type: String, default: 'ALL' },
    title: { type: String, required: true },
    body: { type: String, required: true },
    category: {
      type: String,
      enum: ['Academic', 'Finance', 'Transport', 'Hostel', 'Security', 'System'],
      default: 'System'
    },
    priority: {
      type: String,
      enum: ['LOW', 'NORMAL', 'HIGH', 'URGENT'],
      default: 'NORMAL'
    },
    icon: { type: String, default: '🔵' },
    color: { type: String, default: 'sky' },
    link: { type: String, default: '' },
    readBy: { type: [String], default: [] },
    institutionId: { type: String, default: null }
  },
  { timestamps: true }
);

notificationSchema.index({ targetUserId: 1, targetRole: 1, createdAt: -1 });
notificationSchema.index({ category: 1 });

export default mongoose.model<INotification>('Notification', notificationSchema);

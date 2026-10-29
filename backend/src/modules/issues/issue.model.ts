import mongoose, { Schema, Document } from 'mongoose';

export interface IIssueUpdate {
  message: string;
  updatedBy: string;
  status: string;
  timestamp: Date;
}

export interface IIssue extends Document {
  ticketId: string;
  title: string;
  description: string;
  category: 'Bug' | 'UI/UX' | 'Performance' | 'Account & Access' | 'Feature Request' | 'Other';
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Open' | 'In Progress' | 'Under Review' | 'Resolved' | 'Closed';
  reportedBy: {
    name: string;
    email: string;
    userId?: string;
    role?: string;
  };
  institutionId?: string;
  adminNotes?: string;
  resolutionNotes?: string;
  updates: IIssueUpdate[];
  createdAt: Date;
  updatedAt: Date;
}

const IssueSchema = new Schema<IIssue>(
  {
    ticketId: { type: String, required: true, unique: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: ['Bug', 'UI/UX', 'Performance', 'Account & Access', 'Feature Request', 'Other'],
      default: 'Bug'
    },
    severity: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Medium'
    },
    status: {
      type: String,
      enum: ['Open', 'In Progress', 'Under Review', 'Resolved', 'Closed'],
      default: 'Open'
    },
    reportedBy: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      userId: { type: String },
      role: { type: String, default: 'Public / Visitor' }
    },
    institutionId: { type: String },
    adminNotes: { type: String, default: '' },
    resolutionNotes: { type: String, default: '' },
    updates: [
      {
        message: { type: String, required: true },
        updatedBy: { type: String, default: 'Super Admin' },
        status: { type: String, default: 'Open' },
        timestamp: { type: Date, default: Date.now }
      }
    ]
  },
  { timestamps: true }
);

export const Issue = mongoose.model<IIssue>('Issue', IssueSchema);
export default Issue;

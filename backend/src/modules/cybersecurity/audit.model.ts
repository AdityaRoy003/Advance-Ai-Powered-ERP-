import mongoose, { Schema, Document } from 'mongoose';

export interface IAuditLog extends Document {
  user: string;
  action: string;
  oldVal: string;
  newVal: string;
  ip: string;
  timestamp: Date;
}

const auditLogSchema = new Schema<IAuditLog>(
  {
    user: { type: String, required: true },
    action: { type: String, required: true },
    oldVal: { type: String, default: '' },
    newVal: { type: String, default: '' },
    ip: { type: String, required: true }
  },
  { timestamps: true }
);

export default mongoose.model<IAuditLog>('AuditLog', auditLogSchema);

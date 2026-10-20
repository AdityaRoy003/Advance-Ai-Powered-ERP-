import mongoose, { Schema, Document } from 'mongoose';

export interface ICookieConsentRecord extends Document {
  consentId: string;
  visitorId: string;
  userId?: mongoose.Types.ObjectId;
  userEmail?: string;
  role?: string;
  institutionId?: mongoose.Types.ObjectId;
  action: 'accept_all' | 'reject_optional' | 'custom' | 'withdraw';
  categories: {
    essential: boolean;
    functional: boolean;
    analytics: boolean;
    marketing: boolean;
  };
  policyVersion: string;
  ipAddress?: string;
  userAgent?: string;
  timestamp: Date;
}

const CookieConsentRecordSchema = new Schema<ICookieConsentRecord>({
  consentId: { type: String, required: true, unique: true },
  visitorId: { type: String, required: true, index: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
  userEmail: { type: String },
  role: { type: String, default: 'VISITOR' },
  institutionId: { type: Schema.Types.ObjectId, ref: 'Institution', index: true },
  action: { 
    type: String, 
    enum: ['accept_all', 'reject_optional', 'custom', 'withdraw'], 
    required: true 
  },
  categories: {
    essential: { type: Boolean, required: true, default: true },
    functional: { type: Boolean, default: false },
    analytics: { type: Boolean, default: false },
    marketing: { type: Boolean, default: false }
  },
  policyVersion: { type: String, required: true, default: 'v2.4-2026' },
  ipAddress: { type: String },
  userAgent: { type: String },
  timestamp: { type: Date, default: Date.now, index: true }
}, { timestamps: true });

// Compound indexes for tenant-scoped telemetry and visitor lookups
CookieConsentRecordSchema.index({ institutionId: 1, timestamp: -1 });
CookieConsentRecordSchema.index({ visitorId: 1, timestamp: -1 });
CookieConsentRecordSchema.index({ userId: 1, timestamp: -1 });

export const CookieConsentRecord = mongoose.model<ICookieConsentRecord>('CookieConsentRecord', CookieConsentRecordSchema);
export default CookieConsentRecord;

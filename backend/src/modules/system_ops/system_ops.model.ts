import mongoose, { Schema, Document } from 'mongoose';

// ─── 1. MLOps Model Registry ───────────────────────────────────────────────
export interface IMLModelRecord extends Document {
  modelName: string; // e.g. 'Attendance Predictor', 'Student Risk Classifier', 'Career Skill Matcher'
  version: string;   // e.g. 'v1.4.2'
  status: 'Production' | 'Staging' | 'Archived' | 'Training';
  accuracyPct: number;
  precisionPct: number;
  recallPct: number;
  f1Score: number;
  datasetVersion: string;
  lastTrainedDate: string;
  trainingSamplesCount: number;
  driftDetected: boolean;
  driftMetric: number; // e.g. 0.04 (KS statistic)
  latencyMs: number;
  institutionId?: mongoose.Types.ObjectId;
}

const MLModelRecordSchema = new Schema<IMLModelRecord>({
  modelName: { type: String, required: true },
  version: { type: String, required: true },
  status: { type: String, enum: ['Production', 'Staging', 'Archived', 'Training'], default: 'Production' },
  accuracyPct: { type: Number, required: true },
  precisionPct: { type: Number, required: true },
  recallPct: { type: Number, required: true },
  f1Score: { type: Number, required: true },
  datasetVersion: { type: String, required: true },
  lastTrainedDate: { type: String, required: true },
  trainingSamplesCount: { type: Number, default: 10000 },
  driftDetected: { type: Boolean, default: false },
  driftMetric: { type: Number, default: 0.02 },
  latencyMs: { type: Number, default: 18 },
  institutionId: { type: Schema.Types.ObjectId, ref: 'Institution' }
}, { timestamps: true });

// ─── 2. IT Infrastructure Incident & Latency Diagnostics ──────────────────
export interface IITIncidentLog extends Document {
  incidentId: string;
  service: 'API Gateway' | 'MongoDB Primary' | 'Socket.IO Server' | 'Auth Service' | 'File Storage';
  severity: 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';
  title: string;
  rootCause: string;
  aiSuggestedResolution: string;
  latencyAvgMs: number;
  cpuLoadPct: number;
  memoryUsagePct: number;
  status: 'Investigating' | 'Mitigated' | 'Resolved';
  timestamp: Date;
  institutionId?: mongoose.Types.ObjectId;
}

const ITIncidentLogSchema = new Schema<IITIncidentLog>({
  incidentId: { type: String, required: true, unique: true },
  service: { type: String, enum: ['API Gateway', 'MongoDB Primary', 'Socket.IO Server', 'Auth Service', 'File Storage'], required: true },
  severity: { type: String, enum: ['INFO', 'WARNING', 'ERROR', 'CRITICAL'], default: 'INFO' },
  title: { type: String, required: true },
  rootCause: { type: String, required: true },
  aiSuggestedResolution: { type: String, required: true },
  latencyAvgMs: { type: Number, default: 24 },
  cpuLoadPct: { type: Number, default: 35 },
  memoryUsagePct: { type: Number, default: 48 },
  status: { type: String, enum: ['Investigating', 'Mitigated', 'Resolved'], default: 'Resolved' },
  timestamp: { type: Date, default: Date.now },
  institutionId: { type: Schema.Types.ObjectId, ref: 'Institution' }
}, { timestamps: true });

// ─── 3. Privacy Center & Data Requests (DPDP / GDPR) ───────────────────────
export interface IPrivacyConsent extends Document {
  userId: mongoose.Types.ObjectId;
  userEmail: string;
  role: string;
  consentAcademicAnalytics: boolean;
  consentBioMetrics: boolean;
  consentThirdPartySharing: boolean;
  consentRecruiterView: boolean;
  consentAIRecommendations: boolean;
  dataExportRequested: boolean;
  accountDeletionRequested: boolean;
  dataRetentionExpiryDate?: Date;
  institutionId?: mongoose.Types.ObjectId;
}

const PrivacyConsentSchema = new Schema<IPrivacyConsent>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  userEmail: { type: String, required: true },
  role: { type: String, default: 'STUDENT' },
  consentAcademicAnalytics: { type: Boolean, default: true },
  consentBioMetrics: { type: Boolean, default: true },
  consentThirdPartySharing: { type: Boolean, default: false },
  consentRecruiterView: { type: Boolean, default: true },
  consentAIRecommendations: { type: Boolean, default: true },
  dataExportRequested: { type: Boolean, default: false },
  accountDeletionRequested: { type: Boolean, default: false },
  dataRetentionExpiryDate: { type: Date },
  institutionId: { type: Schema.Types.ObjectId, ref: 'Institution' }
}, { timestamps: true });

export const MLModelRecord = mongoose.model<IMLModelRecord>('MLModelRecord', MLModelRecordSchema);
export const ITIncidentLog = mongoose.model<IITIncidentLog>('ITIncidentLog', ITIncidentLogSchema);
export const PrivacyConsent = mongoose.model<IPrivacyConsent>('PrivacyConsent', PrivacyConsentSchema);

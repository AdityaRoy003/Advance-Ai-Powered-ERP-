import mongoose, { Schema, Document } from 'mongoose';

// ─── 1. Visual Autonomous Workflow Rule ────────────────────────────────────
export interface IWorkflowRule extends Document {
  name: string;
  description: string;
  triggerEvent: string; // e.g. 'ATTENDANCE_DROPPED_BELOW_75', 'FEE_OVERDUE_15_DAYS', 'NEW_ADMISSION', 'SEVERITY_HIGH_INCIDENT'
  conditions: {
    field: string;
    operator: 'LESS_THAN' | 'GREATER_THAN' | 'EQUALS' | 'CONTAINS';
    value: string;
  }[];
  actions: {
    actionType: 'SEND_SMS' | 'SEND_EMAIL' | 'CREATE_TASK' | 'NOTIFY_PARENT' | 'DISPATCH_COUNSELOR' | 'TRIGGER_WEBHOOK';
    recipientRole?: string;
    payloadTemplate?: string;
  }[];
  isActive: boolean;
  executionCount: number;
  lastExecutedAt?: Date;
  institutionId?: mongoose.Types.ObjectId;
}

const WorkflowRuleSchema = new Schema<IWorkflowRule>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  triggerEvent: { type: String, required: true },
  conditions: [{
    field: { type: String, required: true },
    operator: { type: String, enum: ['LESS_THAN', 'GREATER_THAN', 'EQUALS', 'CONTAINS'], required: true },
    value: { type: String, required: true }
  }],
  actions: [{
    actionType: { type: String, enum: ['SEND_SMS', 'SEND_EMAIL', 'CREATE_TASK', 'NOTIFY_PARENT', 'DISPATCH_COUNSELOR', 'TRIGGER_WEBHOOK'], required: true },
    recipientRole: { type: String },
    payloadTemplate: { type: String }
  }],
  isActive: { type: Boolean, default: true },
  executionCount: { type: Number, default: 0 },
  lastExecutedAt: { type: Date },
  institutionId: { type: Schema.Types.ObjectId, ref: 'Institution' }
}, { timestamps: true });

// ─── 2. Integration / Plugin Connectors ────────────────────────────────────
export interface IIntegrationApp extends Document {
  appKey: string;
  name: string;
  category: 'Productivity' | 'Communication' | 'Payment' | 'Hardware' | 'Developer' | 'Storage';
  icon: string;
  description: string;
  connected: boolean;
  authType: 'OAuth2' | 'API_KEY' | 'WEBHOOK';
  config: Record<string, any>;
  lastSyncedAt?: Date;
  institutionId?: mongoose.Types.ObjectId;
}

const IntegrationAppSchema = new Schema<IIntegrationApp>({
  appKey: { type: String, required: true },
  name: { type: String, required: true },
  category: { type: String, enum: ['Productivity', 'Communication', 'Payment', 'Hardware', 'Developer', 'Storage'], required: true },
  icon: { type: String, required: true },
  description: { type: String, required: true },
  connected: { type: Boolean, default: false },
  authType: { type: String, enum: ['OAuth2', 'API_KEY', 'WEBHOOK'], default: 'API_KEY' },
  config: { type: Schema.Types.Mixed, default: {} },
  lastSyncedAt: { type: Date },
  institutionId: { type: Schema.Types.ObjectId, ref: 'Institution' }
}, { timestamps: true });

// ─── 3. Developer Portal API Keys & Webhooks ───────────────────────────────
export interface IApiKey extends Document {
  name: string;
  keyPrefix: string;
  hashedSecret: string;
  scopes: string[]; // ['read:students', 'write:attendance', 'read:courses', 'read:finance']
  rateLimitPerMin: number;
  totalCalls: number;
  lastUsedAt?: Date;
  status: 'active' | 'revoked';
  institutionId?: mongoose.Types.ObjectId;
}

const ApiKeySchema = new Schema<IApiKey>({
  name: { type: String, required: true },
  keyPrefix: { type: String, required: true },
  hashedSecret: { type: String, required: true },
  scopes: [{ type: String }],
  rateLimitPerMin: { type: Number, default: 600 },
  totalCalls: { type: Number, default: 0 },
  lastUsedAt: { type: Date },
  status: { type: String, enum: ['active', 'revoked'], default: 'active' },
  institutionId: { type: Schema.Types.ObjectId, ref: 'Institution' }
}, { timestamps: true });

export const WorkflowRule = mongoose.model<IWorkflowRule>('WorkflowRule', WorkflowRuleSchema);
export const IntegrationApp = mongoose.model<IIntegrationApp>('IntegrationApp', IntegrationAppSchema);
export const ApiKey = mongoose.model<IApiKey>('ApiKey', ApiKeySchema);

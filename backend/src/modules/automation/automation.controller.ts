import type { Request, Response } from 'express';
import crypto from 'crypto';
import { WorkflowRule, IntegrationApp, ApiKey } from './automation.model.js';
import { sendSuccess, sendError } from '../../core/response/apiResponse.js';

// ─── 1. Workflow Builder Endpoints ─────────────────────────────────────────

export const getWorkflowRules = async (req: Request, res: Response) => {
  try {
    const institutionId = (req as any).institutionId;
    const filter: any = institutionId ? { institutionId } : {};
    let rules = await WorkflowRule.find(filter).sort({ createdAt: -1 });

    if (rules.length === 0) {
      const seedRules = [
        {
          name: 'Low Attendance Student Escalation',
          description: 'When student attendance drops below 75%, alert student & parent, then assign a counseling ticket.',
          triggerEvent: 'ATTENDANCE_DROPPED_BELOW_75',
          conditions: [{ field: 'attendancePercentage', operator: 'LESS_THAN', value: '75' }],
          actions: [
            { actionType: 'NOTIFY_PARENT', recipientRole: 'PARENT', payloadTemplate: 'Warning: Ward attendance has dropped below minimum threshold.' },
            { actionType: 'DISPATCH_COUNSELOR', recipientRole: 'TEACHER', payloadTemplate: 'Conduct 1-on-1 academic counseling session.' }
          ],
          isActive: true,
          executionCount: 142,
          lastExecutedAt: new Date(Date.now() - 3600000)
        },
        {
          name: 'Fee Due Grace Period Warning',
          description: 'When semester fee overdue exceeds 15 days, dispatch SMS reminder & restrict library borrowing.',
          triggerEvent: 'FEE_OVERDUE_15_DAYS',
          conditions: [{ field: 'overdueDays', operator: 'GREATER_THAN', value: '15' }],
          actions: [
            { actionType: 'SEND_SMS', recipientRole: 'PARENT', payloadTemplate: 'EduVerse: Fee payment overdue by 15+ days. Please clear dues to avoid late penalty.' },
            { actionType: 'CREATE_TASK', recipientRole: 'FINANCE_OFFICER', payloadTemplate: 'Verify payment reconciliation for student.' }
          ],
          isActive: true,
          executionCount: 58,
          lastExecutedAt: new Date(Date.now() - 14400000)
        }
      ];
      rules = await WorkflowRule.insertMany(seedRules.map(r => ({ ...r, institutionId })) as any) as any;
    }

    return sendSuccess(res, 'Workflow rules fetched', rules);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch workflows', null, 500);
  }
};

export const createWorkflowRule = async (req: Request, res: Response) => {
  try {
    const institutionId = (req as any).institutionId;
    const { name, description, triggerEvent, conditions, actions, isActive } = req.body;

    const rule = await WorkflowRule.create({
      name,
      description,
      triggerEvent,
      conditions: conditions || [],
      actions: actions || [],
      isActive: isActive !== undefined ? isActive : true,
      institutionId
    });

    return sendSuccess(res, 'Workflow rule created successfully', rule, 201);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to create workflow', null, 500);
  }
};

export const toggleWorkflowRule = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const rule = await WorkflowRule.findById(id);
    if (!rule) return sendError(res, 'Rule not found', null, 404);

    rule.isActive = !rule.isActive;
    await rule.save();
    return sendSuccess(res, `Workflow rule ${rule.isActive ? 'activated' : 'paused'}`, rule);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to toggle workflow', null, 500);
  }
};

// ─── 2. Integration / Plugin Marketplace ───────────────────────────────────

export const getIntegrations = async (req: Request, res: Response) => {
  try {
    const institutionId = (req as any).institutionId;
    const filter: any = institutionId ? { institutionId } : {};
    let apps = await IntegrationApp.find(filter).sort({ category: 1 });

    if (apps.length === 0) {
      const defaultApps = [
        { appKey: 'google_workspace', name: 'Google Workspace for Education', category: 'Productivity', icon: '🌐', description: 'Sync institutional Gmail, Google Classroom, and Drive with EduVerse accounts.', connected: true, authType: 'OAuth2' },
        { appKey: 'microsoft_365', name: 'Microsoft 365 / MS Teams', category: 'Productivity', icon: '💼', description: 'Schedule video lectures on Teams and sync Outlook calendar appointments.', connected: true, authType: 'OAuth2' },
        { appKey: 'zoom_meetings', name: 'Zoom Education Suite', category: 'Communication', icon: '📹', description: 'Automatic webinar creation for LMS interactive video modules.', connected: false, authType: 'OAuth2' },
        { appKey: 'whatsapp_business', name: 'WhatsApp Enterprise Alerts', category: 'Communication', icon: '💬', description: 'Deliver fee alerts, emergency announcements, and exam timetables directly.', connected: true, authType: 'API_KEY' },
        { appKey: 'razorpay_stripe', name: 'Razorpay & Stripe Gateway', category: 'Payment', icon: '💳', description: 'Accept tuition fees, hostel rent, and mess dues via UPI, NetBanking, and Cards.', connected: true, authType: 'API_KEY' },
        { appKey: 'biometric_zkteco', name: 'ZKTeco Biometric Devices', category: 'Hardware', icon: '📱', description: 'Hardware attendance synchronization over TCP/IP LAN gateways.', connected: true, authType: 'API_KEY' },
        { appKey: 'github_enterprise', name: 'GitHub Classroom', category: 'Developer', icon: '🐙', description: 'Track coding lab assignment commits and automated test grade evaluation.', connected: true, authType: 'OAuth2' },
        { appKey: 'aws_s3_storage', name: 'AWS S3 Vault Cloud Storage', category: 'Storage', icon: '☁️', description: 'Encrypted scalable object storage for student records and LMS videos.', connected: true, authType: 'API_KEY' }
      ];
      apps = await IntegrationApp.insertMany(defaultApps.map(a => ({ ...a, institutionId })) as any) as any;
    }

    return sendSuccess(res, 'Integrations fetched', apps);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch integrations', null, 500);
  }
};

export const toggleIntegration = async (req: Request, res: Response) => {
  try {
    const { appKey } = req.params;
    const institutionId = (req as any).institutionId;
    const filter: any = institutionId ? { appKey, institutionId } : { appKey };

    const app = await IntegrationApp.findOne(filter);
    if (!app) return sendError(res, 'Integration not found', null, 404);

    app.connected = !app.connected;
    if (app.connected) app.lastSyncedAt = new Date();
    await app.save();

    return sendSuccess(res, `Integration ${app.name} ${app.connected ? 'connected' : 'disconnected'}`, app);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to toggle integration', null, 500);
  }
};

// ─── 3. Developer Portal & API Keys ────────────────────────────────────────

export const getApiKeys = async (req: Request, res: Response) => {
  try {
    const institutionId = (req as any).institutionId;
    const filter: any = institutionId ? { institutionId } : {};
    let keys = await ApiKey.find(filter).sort({ createdAt: -1 });

    if (keys.length === 0) {
      const defaultKey = {
        name: 'Mobile Gateway Production Key',
        keyPrefix: 'edv_live_9a7x',
        hashedSecret: crypto.createHash('sha256').update('edv_live_secret_sample').digest('hex'),
        scopes: ['read:students', 'write:attendance', 'read:courses', 'read:finance'],
        rateLimitPerMin: 1200,
        totalCalls: 48920,
        status: 'active',
        lastUsedAt: new Date()
      };
      keys = await ApiKey.insertMany([{ ...defaultKey, institutionId }] as any) as any;
    }

    return sendSuccess(res, 'API keys fetched', keys);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch API keys', null, 500);
  }
};

export const createApiKey = async (req: Request, res: Response) => {
  try {
    const institutionId = (req as any).institutionId;
    const { name, scopes, rateLimitPerMin } = req.body;

    const rawToken = `edv_live_${crypto.randomBytes(16).toString('hex')}`;
    const keyPrefix = rawToken.slice(0, 13);
    const hashedSecret = crypto.createHash('sha256').update(rawToken).digest('hex');

    const keyDoc = await ApiKey.create({
      name: name || 'Custom Integration Key',
      keyPrefix,
      hashedSecret,
      scopes: scopes || ['read:students', 'read:courses'],
      rateLimitPerMin: rateLimitPerMin || 600,
      status: 'active',
      institutionId
    });

    return sendSuccess(res, 'API key created successfully', {
      key: keyDoc,
      secretToken: rawToken // Returned once upon creation
    }, 201);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to generate API key', null, 500);
  }
};

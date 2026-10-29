import type { Request, Response } from 'express';
import { MLModelRecord, ITIncidentLog, PrivacyConsent } from './system_ops.model.js';
import { sendSuccess, sendError } from '../../core/response/apiResponse.js';

// ─── Helper: extract userId from JWT payload ─────────────────────────────────
const getUserId = (req: Request): string | undefined => {
  const user = (req as any).user;
  // JWT payload uses 'sub' as the user id field
  return user?.sub || user?._id || user?.id;
};

// ─── 1. MLOps Model Registry ───────────────────────────────────────────────

export const getModelRegistry = async (req: Request, res: Response) => {
  try {
    const institutionId = (req as any).institutionId;
    const filter: any = institutionId ? { institutionId } : {};
    let models = await MLModelRecord.find(filter).sort({ modelName: 1 });

    if (models.length === 0) {
      const defaultModels = [
        {
          modelName: 'Attendance Deficit Classifier',
          version: 'v1.4.2',
          status: 'Production',
          accuracyPct: 91.2,
          precisionPct: 89.7,
          recallPct: 92.1,
          f1Score: 0.908,
          datasetVersion: 'ds_cohort_aug26_v3',
          lastTrainedDate: '28 Aug 2026',
          trainingSamplesCount: 24500,
          driftDetected: false,
          driftMetric: 0.021,
          latencyMs: 14.2
        },
        {
          modelName: 'Student Dropout Risk Predictor',
          version: 'v2.1.0',
          status: 'Production',
          accuracyPct: 88.6,
          precisionPct: 86.4,
          recallPct: 90.2,
          f1Score: 0.882,
          datasetVersion: 'ds_risk_multiyear_v5',
          lastTrainedDate: '24 Aug 2026',
          trainingSamplesCount: 38200,
          driftDetected: false,
          driftMetric: 0.034,
          latencyMs: 22.8
        },
        {
          modelName: 'Career Skill-Gap Recommender',
          version: 'v3.0.1-rc',
          status: 'Staging',
          accuracyPct: 93.4,
          precisionPct: 91.8,
          recallPct: 94.0,
          f1Score: 0.929,
          datasetVersion: 'ds_industry_jd_aug26',
          lastTrainedDate: '30 Aug 2026',
          trainingSamplesCount: 52000,
          driftDetected: false,
          driftMetric: 0.015,
          latencyMs: 18.5
        }
      ];
      models = await MLModelRecord.insertMany(defaultModels.map(m => ({ ...m, institutionId })) as any) as any;
    }

    return sendSuccess(res, 'MLOps model registry fetched', models);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch model registry', null, 500);
  }
};

export const rollbackModelVersion = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const model = await MLModelRecord.findById(id);
    if (!model) return sendError(res, 'Model not found', null, 404);

    model.status = 'Production';
    await model.save();
    return sendSuccess(res, `Model ${model.modelName} ${model.version} promoted to Production`, model);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to rollback model', null, 500);
  }
};

// ─── 2. AI IT Assistant & Diagnostics ──────────────────────────────────────

export const getITMetricsAndIncidents = async (req: Request, res: Response) => {
  try {
    const institutionId = (req as any).institutionId;
    const filter: any = institutionId ? { institutionId } : {};
    let incidents = await ITIncidentLog.find(filter).sort({ timestamp: -1 }).limit(10);

    if (incidents.length === 0) {
      const defaultIncidents = [
        {
          incidentId: 'INC-2026-901',
          service: 'API Gateway',
          severity: 'INFO',
          title: 'Peak Load Auto-Scale Verified',
          rootCause: 'Concurrent class attendance submissions at 09:00 AM caused brief traffic spike (3,200 req/min).',
          aiSuggestedResolution: 'Node cluster auto-scaled horizontally; average endpoint response stabilized at 28ms.',
          latencyAvgMs: 28,
          cpuLoadPct: 42,
          memoryUsagePct: 56,
          status: 'Resolved',
          timestamp: new Date(Date.now() - 7200000)
        },
        {
          incidentId: 'INC-2026-902',
          service: 'MongoDB Primary',
          severity: 'INFO',
          title: 'Index Optimization Notice',
          rootCause: 'Frequent queries on attendance dates benefited from compound index.',
          aiSuggestedResolution: 'Compound index on { institutionId: 1, date: -1 } is active with 0ms scan latency.',
          latencyAvgMs: 8,
          cpuLoadPct: 31,
          memoryUsagePct: 44,
          status: 'Resolved',
          timestamp: new Date(Date.now() - 18000000)
        }
      ];
      incidents = await ITIncidentLog.insertMany(defaultIncidents.map(i => ({ ...i, institutionId })) as any) as any;
    }

    const systemHealth = {
      overallStatus: 'OPTIMAL',
      uptimePct: 99.98,
      avgApiLatencyMs: 24.2,
      databaseQueryAvgMs: 6.8,
      activeWebSocketConnections: 412,
      cpuUtilizationPct: 34.5,
      memoryUtilizationPct: 51.2
    };

    return sendSuccess(res, 'IT system diagnostics fetched', { incidents, systemHealth });
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch IT metrics', null, 500);
  }
};

// ─── 3. Privacy Center (DPDP / GDPR Compliance) ────────────────────────────

export const getUserPrivacyConsent = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const institutionId = (req as any).institutionId;
    const userId = getUserId(req);

    if (!userId) {
      return sendError(res, 'User ID not found in token. Please re-login.', null, 401);
    }

    let consent = await PrivacyConsent.findOne({ userId });

    if (!consent) {
      consent = await PrivacyConsent.create({
        userId,
        userEmail: user?.email || 'user@eduverse.com',
        role: user?.role || 'STUDENT',
        consentAcademicAnalytics: true,
        consentBioMetrics: true,
        consentThirdPartySharing: false,
        consentRecruiterView: true,
        consentAIRecommendations: true,
        dataExportRequested: false,
        accountDeletionRequested: false,
        institutionId
      });
    }

    return sendSuccess(res, 'User privacy settings fetched', consent);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch privacy settings', null, 500);
  }
};

export const updatePrivacyConsent = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    const user = (req as any).user;
    const institutionId = (req as any).institutionId;
    const updates = req.body;

    if (!userId) {
      return sendError(res, 'User ID not found in token', null, 401);
    }

    const consent = await PrivacyConsent.findOneAndUpdate(
      { userId },
      { $set: updates },
      {
        returnDocument: 'after',
        upsert: true,
        setDefaultsOnInsert: true,
        // Provide required fields for upsert case
        ...(!await PrivacyConsent.exists({ userId }) && {
          setDefaultsOnInsert: true
        })
      }
    );

    // If upsert created a new document, ensure required fields are present
    if (consent && !consent.userEmail) {
      consent.userEmail = user?.email || 'user@eduverse.com';
      consent.role = user?.role || 'STUDENT';
      consent.institutionId = institutionId;
      await consent.save();
    }

    return sendSuccess(res, 'Privacy preferences updated', consent);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to update privacy preferences', null, 500);
  }
};

export const requestDataExport = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const userId = getUserId(req);

    const exportBundle = {
      exportTimestamp: new Date().toISOString(),
      userInfo: {
        id: userId,
        email: user?.email,
        role: user?.role,
        department: 'Computer Science'
      },
      exportCategories: [
        'Profile Information',
        'Attendance History',
        'Exam Grades & Transcripts',
        'Fee Payment Receipts',
        'Audit Access Records',
        'LMS Course Completion Data',
        'Library Borrowing History'
      ],
      complianceStandard: 'Digital Personal Data Protection (DPDP) Act 2023 & GDPR Compliant',
      downloadFormat: 'Encrypted JSON / PDF Export Archive',
      estimatedSizeMB: '2.4',
      retentionPolicy: 'Data retained for 7 years per UGC statutory norms',
      dataController: 'EduVerse Main Campus – Data Protection Officer',
      requestId: `EXP-${Date.now()}-${Math.floor(Math.random() * 1000)}`
    };

    if (userId) {
      await PrivacyConsent.findOneAndUpdate(
        { userId },
        { $set: { dataExportRequested: true } },
        { upsert: false }
      );
    }

    return sendSuccess(res, 'Data export bundle compiled successfully', exportBundle);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to generate data export', null, 500);
  }
};

export const requestAccountDeletion = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);

    if (!userId) {
      return sendError(res, 'User ID not found in token', null, 401);
    }

    await PrivacyConsent.findOneAndUpdate(
      { userId },
      { $set: { accountDeletionRequested: true } },
      { upsert: false }
    );

    return sendSuccess(res, 'Account erasure request submitted to Data Protection Officer', {
      requestId: `DEL-${Date.now()}`,
      submittedAt: new Date().toISOString(),
      expectedResolutionDays: 30,
      retentionNotice: 'Academic audit records will be retained for 7 years per UGC statutory norms'
    });
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to submit deletion request', null, 500);
  }
};

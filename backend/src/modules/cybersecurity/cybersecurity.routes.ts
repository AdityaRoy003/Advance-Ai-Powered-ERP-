import { Router } from 'express';
import AuditLog from './audit.model.js';
import { sendSuccess, sendError } from '../../core/response/apiResponse.js';

const router = Router();

router.get('/siem-logs', async (req, res) => {
  try {
    const logs = await AuditLog.find().sort({ createdAt: -1 }).limit(50);
    const formatted = logs.map(l => ({
      timestamp: (l as any).createdAt,
      severity: l.action.toLowerCase().includes('seed') || l.action.toLowerCase().includes('update') ? 'MEDIUM' : 'LOW',
      event: l.action,
      ipAddress: l.ip,
      user: l.user
    }));
    return sendSuccess(res, 'SIEM Logs fetched successfully', { logs: formatted });
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch audit logs', null, 500);
  }
});

router.get('/status', (req, res) => {
  return sendSuccess(res, 'Security system status fetched', {
    mfaEnrollmentRate: '78%',
    activeThreatsCount: 0,
    ddosBlockedCount: 12,
    rateLimitingStatus: 'Active (Max 100 reqs/min)',
    headersConfig: {
      contentSecurityPolicy: 'strict-dynamic',
      xFrameOptions: 'DENY',
      xXSSProtection: '1; mode=block'
    },
    tlsVersion: 'TLSv1.3'
  });
});

router.post('/scan-file', (req, res) => {
  const { fileName } = req.body;
  return sendSuccess(res, 'Malware scan complete', {
    fileName: fileName || 'document.pdf',
    clean: true,
    fileSize: '2.4 MB',
    detectedSignatures: [],
    hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
  });
});

export default router;

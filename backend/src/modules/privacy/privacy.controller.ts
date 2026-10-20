import type { Request, Response } from 'express';
import crypto from 'crypto';
import CookieConsentRecord from './privacy.model.js';
import { PrivacyConsent } from '../system_ops/system_ops.model.js';
import { sendSuccess, sendError } from '../../core/response/apiResponse.js';

// Helper to mask IP address for DPDP/GDPR compliant storage
const maskIpAddress = (ip?: string): string => {
  if (!ip) return '0.0.0.0';
  const cleanIp = ip.replace(/^.*:/, ''); // strip IPv6 prefix if present
  const parts = cleanIp.split('.');
  if (parts.length === 4) {
    return `${parts[0]}.${parts[1]}.${parts[2]}.xxx`;
  }
  return cleanIp.substring(0, cleanIp.length / 2) + '...';
};

export const recordConsent = async (req: Request, res: Response) => {
  try {
    const { 
      visitorId, 
      action, 
      categories = {}, 
      policyVersion = 'v2.4-2026' 
    } = req.body;

    if (!visitorId) {
      return sendError(res, 'Visitor identifier is required', null, 400);
    }

    if (!['accept_all', 'reject_optional', 'custom', 'withdraw'].includes(action)) {
      return sendError(res, 'Invalid consent action type', null, 400);
    }

    // Essential is ALWAYS required and locked to true
    // If action is withdraw or reject_optional, all non-essential categories are strictly false
    const finalCategories = {
      essential: true,
      functional: (action === 'withdraw' || action === 'reject_optional') ? false : Boolean(categories.functional),
      analytics: (action === 'withdraw' || action === 'reject_optional') ? false : Boolean(categories.analytics),
      marketing: (action === 'withdraw' || action === 'reject_optional') ? false : Boolean(categories.marketing)
    };

    // User context (if authenticated)
    const user = (req as any).user;
    const userId = user?.sub || user?._id || user?.id || null;
    const institutionId = (req as any).institutionId || user?.institutionId || null;

    const consentId = `CONSENT-${Date.now()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
    const clientIp = req.headers['x-forwarded-for']?.toString().split(',')[0] || req.socket.remoteAddress;

    const record = await CookieConsentRecord.create({
      consentId,
      visitorId,
      userId: userId || undefined,
      userEmail: user?.email || undefined,
      role: user?.role || 'VISITOR',
      institutionId: institutionId || undefined,
      action,
      categories: finalCategories,
      policyVersion,
      ipAddress: maskIpAddress(clientIp),
      userAgent: req.headers['user-agent'] || 'Browser Client',
      timestamp: new Date()
    });

    // If authenticated user, also synchronize with user's PrivacyConsent document
    if (userId) {
      try {
        await PrivacyConsent.findOneAndUpdate(
          { userId },
          {
            $set: {
              consentAcademicAnalytics: finalCategories.analytics,
              consentAIRecommendations: finalCategories.functional,
              consentThirdPartySharing: finalCategories.marketing
            }
          },
          { upsert: false }
        );
      } catch (syncErr) {
        console.warn('Syncing with user PrivacyConsent noticed:', syncErr);
      }
    }

    // Set a safe, non-sensitive client cookie indicating active consent choice
    const consentCookieVal = `v=${policyVersion}&e=1&f=${finalCategories.functional ? 1 : 0}&a=${finalCategories.analytics ? 1 : 0}&m=${finalCategories.marketing ? 1 : 0}`;
    res.cookie('eduverse_consent_status', consentCookieVal, {
      maxAge: 365 * 24 * 60 * 60 * 1000,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production'
    });

    return sendSuccess(res, 'Consent preferences successfully recorded and persisted', {
      consentId: record.consentId,
      action: record.action,
      categories: record.categories,
      policyVersion: record.policyVersion,
      timestamp: record.timestamp
    });
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to record consent', null, 500);
  }
};

export const getConsent = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const userId = user?.sub || user?._id || user?.id;
    const visitorId = req.query.visitorId ? String(req.query.visitorId) : null;

    let query: any = {};
    if (userId) {
      query = { $or: [{ userId }, { visitorId }] };
    } else if (visitorId) {
      query = { visitorId };
    } else {
      return sendSuccess(res, 'No identifier provided', {
        categories: { essential: true, functional: false, analytics: false, marketing: false },
        hasConsented: false
      });
    }

    const latest = await CookieConsentRecord.findOne(query).sort({ timestamp: -1 });

    if (!latest) {
      return sendSuccess(res, 'No previous consent record found', {
        categories: { essential: true, functional: false, analytics: false, marketing: false },
        hasConsented: false
      });
    }

    return sendSuccess(res, 'Active consent preferences retrieved', {
      consentId: latest.consentId,
      action: latest.action,
      categories: latest.categories,
      policyVersion: latest.policyVersion,
      timestamp: latest.timestamp,
      hasConsented: true
    });
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to retrieve consent', null, 500);
  }
};

export const getConsentStats = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const isSuperAdmin = user?.role === 'SUPER_ADMIN';
    const institutionId = (req as any).institutionId || user?.institutionId;

    // Tenant isolation: Institutional Admin can only see their own institution's telemetry
    const filter: any = {};
    if (!isSuperAdmin && institutionId) {
      filter.institutionId = institutionId;
    } else if (isSuperAdmin && req.query.institutionId) {
      filter.institutionId = req.query.institutionId;
    }

    const totalRecords = await CookieConsentRecord.countDocuments(filter);
    
    if (totalRecords === 0) {
      return sendSuccess(res, 'Consent audit statistics fetched', {
        totalConsents: 0,
        acceptAllPct: 0,
        rejectOptionalPct: 0,
        customPct: 0,
        withdrawCount: 0,
        optInRates: {
          essential: 100,
          functional: 0,
          analytics: 0,
          marketing: 0
        },
        policyVersions: { 'v2.4-2026': 0 },
        recentAudits: []
      });
    }

    const [
      acceptAllCount,
      rejectOptionalCount,
      customCount,
      withdrawCount,
      functionalCount,
      analyticsCount,
      marketingCount,
      recentRecords
    ] = await Promise.all([
      CookieConsentRecord.countDocuments({ ...filter, action: 'accept_all' }),
      CookieConsentRecord.countDocuments({ ...filter, action: 'reject_optional' }),
      CookieConsentRecord.countDocuments({ ...filter, action: 'custom' }),
      CookieConsentRecord.countDocuments({ ...filter, action: 'withdraw' }),
      CookieConsentRecord.countDocuments({ ...filter, 'categories.functional': true }),
      CookieConsentRecord.countDocuments({ ...filter, 'categories.analytics': true }),
      CookieConsentRecord.countDocuments({ ...filter, 'categories.marketing': true }),
      CookieConsentRecord.find(filter).sort({ timestamp: -1 }).limit(10).select('-__v')
    ]);

    const stats = {
      totalConsents: totalRecords,
      acceptAllCount,
      acceptAllPct: Math.round((acceptAllCount / totalRecords) * 100),
      rejectOptionalCount,
      rejectOptionalPct: Math.round((rejectOptionalCount / totalRecords) * 100),
      customCount,
      customPct: Math.round((customCount / totalRecords) * 100),
      withdrawCount,
      optInRates: {
        essential: 100, // always 100%
        functional: Math.round((functionalCount / totalRecords) * 100),
        analytics: Math.round((analyticsCount / totalRecords) * 100),
        marketing: Math.round((marketingCount / totalRecords) * 100)
      },
      policyVersions: {
        'v2.4-2026': totalRecords
      },
      recentAudits: recentRecords.map(r => ({
        id: r.consentId,
        action: r.action,
        role: r.role,
        maskedIp: r.ipAddress,
        categories: r.categories,
        timestamp: r.timestamp
      }))
    };

    return sendSuccess(res, 'Tenant consent audit telemetry fetched', stats);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch consent stats', null, 500);
  }
};

export const getPrivacyPolicy = (req: Request, res: Response) => {
  const policy = {
    version: 'v2.4-2026',
    effectiveDate: '2026-01-01',
    lastUpdated: '2026-10-20',
    complianceStandards: [
      'Digital Personal Data Protection (DPDP) Act 2023 (India)',
      'General Data Protection Regulation (EU-GDPR) Art. 6 & 13',
      'UGC Higher Education Statutory Data Retention Norms'
    ],
    dataController: {
      entity: 'EduVerse AI ERP Governance Directorate',
      contactEmail: 'dpo@eduverse.ac.in',
      address: 'EduVerse Institutional Campus, Cyber City, New Delhi'
    },
    cookieInventory: [
      {
        name: 'eduverse_session',
        category: 'Essential',
        type: 'HttpOnly, Secure, SameSite=Lax',
        lifespan: '24 Hours',
        purpose: 'Stores encrypted JWT user session credential for authenticated multi-tenant institution access. Never exposed to browser JavaScript.'
      },
      {
        name: 'XSRF-TOKEN',
        category: 'Essential',
        type: 'Secure, SameSite=Lax',
        lifespan: '24 Hours',
        purpose: 'Cross-Site Request Forgery (CSRF) cryptographic verification token.'
      },
      {
        name: 'eduverse_consent_status',
        category: 'Essential',
        type: 'First-Party Cookie',
        lifespan: '1 Year',
        purpose: 'Remembers your consent preferences so you are not repeatedly prompted on each page visit.'
      },
      {
        name: 'eduverse_theme',
        category: 'Functional',
        type: 'Browser Local Storage',
        lifespan: 'Persistent',
        purpose: 'Preserves dark/light mode visual design preferences across workspace sessions.'
      },
      {
        name: 'eduverse_lang',
        category: 'Functional',
        type: 'Browser Local Storage',
        lifespan: 'Persistent',
        purpose: 'Preserves selected interface language localization (English, Hindi, Bengali, Spanish, etc.).'
      },
      {
        name: 'eduverse_perf_telemetry',
        category: 'Analytics',
        type: 'Session Storage (Optional)',
        lifespan: 'Session',
        purpose: 'Measures page navigation latency and API query performance to improve system responsiveness. No PII recorded.'
      },
      {
        name: 'eduverse_placement_radar',
        category: 'Marketing / Recruiter Tracking',
        type: 'Optional Partner Cookie',
        lifespan: '30 Days',
        purpose: 'Allows corporate campus hiring partners to view verified skill tags in the career radar.'
      }
    ],
    userRights: [
      'Right to Access & Information (Section 11, DPDP Act)',
      'Right to Correction & Erasure (Section 12, DPDP Act)',
      'Right to Grievance Redressal (Section 13, DPDP Act)',
      'Right to Withdraw Consent at Any Time (Art. 7, GDPR)'
    ]
  };

  return sendSuccess(res, 'Privacy and Cookie Policy retrieved', policy);
};

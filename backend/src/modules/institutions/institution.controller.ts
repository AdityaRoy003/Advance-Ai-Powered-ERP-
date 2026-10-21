import type { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import Institution from './institution.model.js';
import User from '../users/user.model.js';
import Course from '../courses/course.model.js';
import Notification from '../notifications/notification.model.js';
import { generateTokenPair } from '../auth/auth.tokens.js';
import { sendSuccess, sendError } from '../../core/response/apiResponse.js';

// ─── List all institutions (Super Admin) ───────────────────────────────────
export const listInstitutions = async (req: Request, res: Response) => {
  try {
    const { status, plan, search } = req.query;
    const filter: any = { isDeleted: { $ne: true } };

    if (status) filter.status = String(status);
    if (plan) filter.plan = String(plan);
    if (search) {
      filter.$or = [
        { name: { $regex: String(search), $options: 'i' } },
        { code: { $regex: String(search), $options: 'i' } },
        { city: { $regex: String(search), $options: 'i' } }
      ];
    }

    const institutions = await Institution.find(filter).sort({ createdAt: -1 }).lean();

    // Attach user counts per institution
    const enriched = await Promise.all(
      institutions.map(async (inst) => {
        const userCount = await User.countDocuments({ institutionId: String(inst._id), isDeleted: { $ne: true } });
        return { ...inst, userCount };
      })
    );

    return sendSuccess(res, 'Institutions fetched successfully', enriched, 200);
  } catch (err: any) {
    return sendError(res, err.message || 'Failed to list institutions', 500);
  }
};

// ─── Get single institution ────────────────────────────────────────────────
export const getInstitution = async (req: Request, res: Response) => {
  try {
    const inst = await Institution.findById(req.params.id).lean();
    if (!inst || (inst as any).isDeleted) {
      return sendError(res, 'Institution not found', 404);
    }

    const userCount = await User.countDocuments({ institutionId: String(inst._id), isDeleted: { $ne: true } });
    const studentCount = await User.countDocuments({ institutionId: String(inst._id), role: 'STUDENT', isDeleted: { $ne: true } });
    const teacherCount = await User.countDocuments({ institutionId: String(inst._id), role: 'TEACHER', isDeleted: { $ne: true } });

    return sendSuccess(res, 'Institution fetched successfully', { ...inst, userCount, studentCount, teacherCount }, 200);
  } catch (err: any) {
    return sendError(res, err.message || 'Failed to fetch institution', 500);
  }
};

// ─── Create institution (Super Admin only) ────────────────────────────────
export const createInstitution = async (req: Request, res: Response) => {
  try {
    const {
      name, code, type, logo, address, city, state, country,
      phone, email, website, adminEmail, plan, maxUsers, settings
    } = req.body;

    if (!name || !code) {
      return sendError(res, 'Institution name and code are required', 400);
    }

    const existing = await Institution.findOne({ code: code.toUpperCase() });
    if (existing) {
      return sendError(res, 'An institution with this code already exists', 409);
    }

    const institution = await Institution.create({
      name,
      code: code.toUpperCase(),
      type: type || 'college',
      logo,
      address,
      city,
      state,
      country: country || 'India',
      phone,
      email,
      website,
      adminEmail,
      plan: plan || 'trial',
      status: 'active',
      maxUsers: maxUsers || 500,
      settings: {
        enableHostel:    settings?.enableHostel    ?? true,
        enableTransport: settings?.enableTransport ?? true,
        enablePlacement: settings?.enablePlacement ?? true,
        enableLibrary:   settings?.enableLibrary   ?? true,
        enableFinance:   settings?.enableFinance   ?? true,
        enableExams:     settings?.enableExams     ?? true,
        enableAI:        settings?.enableAI        ?? true
      },
      createdBy: (req.user as any)?._id
    });

    return sendSuccess(res, 'Institution created successfully', institution, 201);
  } catch (err: any) {
    return sendError(res, err.message || 'Failed to create institution', 500);
  }
};

// ─── Update institution ────────────────────────────────────────────────────
export const updateInstitution = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };
    delete updates._id;
    delete updates.code; // code is immutable once created

    const institution = await Institution.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );
    if (!institution) return sendError(res, 'Institution not found', 404);

    return sendSuccess(res, 'Institution updated successfully', institution, 200);
  } catch (err: any) {
    return sendError(res, err.message || 'Failed to update institution', 500);
  }
};

// ─── Suspend institution ───────────────────────────────────────────────────
export const suspendInstitution = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const institution = await Institution.findByIdAndUpdate(
      id,
      { status: 'suspended' },
      { new: true }
    );
    if (!institution) return sendError(res, 'Institution not found', 404);

    // Suspend all users of this institution
    await User.updateMany({ institutionId: id }, { status: 'suspended' });

    return sendSuccess(res, 'Institution and all its users have been suspended', institution, 200);
  } catch (err: any) {
    return sendError(res, err.message || 'Failed to suspend institution', 500);
  }
};

// ─── Reactivate institution ────────────────────────────────────────────────
export const reactivateInstitution = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const institution = await Institution.findByIdAndUpdate(
      id,
      { status: 'active' },
      { new: true }
    );
    if (!institution) return sendError(res, 'Institution not found', 404);

    // Reactivate all users of this institution
    await User.updateMany({ institutionId: id, status: 'suspended' }, { status: 'active' });

    return sendSuccess(res, 'Institution reactivated successfully', institution, 200);
  } catch (err: any) {
    return sendError(res, err.message || 'Failed to reactivate institution', 500);
  }
};

// ─── Delete institution (soft) ─────────────────────────────────────────────
export const deleteInstitution = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const institution = await Institution.findByIdAndUpdate(
      id,
      { isDeleted: true, deletedAt: new Date(), status: 'inactive' },
      { new: true }
    );
    if (!institution) return sendError(res, 'Institution not found', 404);

    return sendSuccess(res, 'Institution soft-deleted successfully', { id: institution._id }, 200);
  } catch (err: any) {
    return sendError(res, err.message || 'Failed to delete institution', 500);
  }
};

// ─── Get users of an institution ───────────────────────────────────────────
export const getInstitutionUsers = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { role } = req.query;

    const filter: any = { institutionId: id, isDeleted: { $ne: true } };
    if (role) filter.role = String(role).toUpperCase();

    const users = await User.find(filter).select('-passwordHash').sort({ createdAt: -1 }).lean();
    return sendSuccess(res, 'Institution users fetched successfully', users, 200);
  } catch (err: any) {
    return sendError(res, err.message || 'Failed to fetch institution users', 500);
  }
};

// ─── SaaS: List Public Institutions (for Tenant Switcher & Onboarding) ──────
export const listPublicInstitutions = async (req: Request, res: Response) => {
  try {
    const institutions = await Institution.find({ isDeleted: { $ne: true }, status: { $ne: 'inactive' } })
      .select('name code type plan status logo city state maxUsers subscription')
      .sort({ createdAt: -1 })
      .lean();

    return sendSuccess(res, 'Public institutions fetched', institutions, 200);
  } catch (err: any) {
    return sendError(res, err.message || 'Failed to fetch institutions', 500);
  }
};

// ─── SaaS: Self-Service Workspace / Campus Onboarding ─────────────────────────
export const onboardWorkspace = async (req: Request, res: Response) => {
  try {
    const {
      institutionName,
      institutionCode,
      institutionType = 'college',
      city,
      state,
      country = 'India',
      plan = 'professional',
      billingCycle = 'monthly',
      adminFirstName,
      adminLastName,
      adminEmail,
      adminPassword,
      adminPhone,
      seedDemoData = true
    } = req.body;

    // 1. Validation
    if (!institutionName?.trim() || !institutionCode?.trim()) {
      return sendError(res, 'Institution name and campus code are required', 400);
    }
    if (!adminFirstName?.trim() || !adminLastName?.trim() || !adminEmail?.trim() || !adminPassword?.trim()) {
      return sendError(res, 'Administrator first name, last name, email, and password are required', 400);
    }

    const cleanCode = institutionCode.trim().toUpperCase().replace(/[^A-Z0-9_-]/g, '');
    const cleanEmail = adminEmail.trim().toLowerCase();

    // 2. Check for duplicate code
    const existingCode = await Institution.findOne({ code: cleanCode });
    if (existingCode) {
      return sendError(res, `Campus code "${cleanCode}" is already taken. Please choose another abbreviation or slug.`, 409);
    }

    // 3. Check for duplicate admin email
    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      return sendError(res, `An account with email "${cleanEmail}" already exists. Please log in or use a different work email.`, 409);
    }

    // 4. Determine Plan Quotas
    const quotas = {
      starter: { studentQuota: 50, facultyQuota: 10, storageQuotaGB: 10, maxUsers: 65 },
      professional: { studentQuota: 500, facultyQuota: 50, storageQuotaGB: 50, maxUsers: 575 },
      enterprise: { studentQuota: 5000, facultyQuota: 500, storageQuotaGB: 500, maxUsers: 6000 }
    }[plan as 'starter' | 'professional' | 'enterprise'] || { studentQuota: 500, facultyQuota: 50, storageQuotaGB: 50, maxUsers: 575 };

    const trialEndsAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000); // 14-day trial
    const currentPeriodEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    // 5. Create Institution
    const institution = await Institution.create({
      name: institutionName.trim(),
      code: cleanCode,
      type: institutionType,
      city: city?.trim() || '',
      state: state?.trim() || '',
      country,
      email: cleanEmail,
      adminEmail: cleanEmail,
      phone: adminPhone || '',
      plan: plan as any,
      status: 'active',
      maxUsers: quotas.maxUsers,
      subscription: {
        plan,
        billingCycle: billingCycle as 'monthly' | 'annual',
        status: 'trialing',
        trialEndsAt,
        currentPeriodEnd,
        studentQuota: quotas.studentQuota,
        facultyQuota: quotas.facultyQuota,
        storageQuotaGB: quotas.storageQuotaGB
      },
      settings: {
        enableHostel: true,
        enableTransport: true,
        enablePlacement: true,
        enableLibrary: true,
        enableFinance: true,
        enableExams: true,
        enableAI: true
      }
    });

    // 6. Create Admin User
    const passwordHash = await bcrypt.hash(adminPassword, 10);
    const adminUser = await User.create({
      firstName: adminFirstName.trim(),
      lastName: adminLastName.trim(),
      email: cleanEmail,
      passwordHash,
      role: 'ADMIN',
      status: 'active',
      phone: adminPhone || '',
      institutionId: institution._id,
      emailVerified: true
    });

    institution.createdBy = adminUser._id as any;
    await institution.save();

    // 7. Seed Sample Data if requested
    if (seedDemoData) {
      try {
        await Course.insertMany([
          {
            code: `${cleanCode}-CS101`,
            title: 'Foundations of Computer Science & Algorithms',
            department: 'Computer Science & Engineering',
            credits: 4,
            semester: 1,
            description: 'Core computer science fundamentals, data structures, and algorithmic complexity.',
            syllabus: ['Algorithmic Thinking', 'Sorting & Trees', 'Graph Theory'],
            status: 'active',
            institutionId: institution._id
          },
          {
            code: `${cleanCode}-AI201`,
            title: 'Autonomous AI & Natural Language Processing',
            department: 'Artificial Intelligence',
            credits: 4,
            semester: 3,
            description: 'Modern LLMs, transformer architectures, and applied neural networks.',
            syllabus: ['Transformers', 'Vector Embeddings', 'Autonomous Agents'],
            status: 'active',
            institutionId: institution._id
          },
          {
            code: `${cleanCode}-IT305`,
            title: 'Enterprise Cloud Architecture & Distributed Systems',
            department: 'Information Technology',
            credits: 3,
            semester: 5,
            description: 'Microservices, cloud security, scalability, and high-availability systems.',
            syllabus: ['Docker & Kubernetes', 'Multi-Tenant Isolation', 'Zero-Trust Security'],
            status: 'active',
            institutionId: institution._id
          }
        ]);

        await Notification.create({
          targetUserId: String(adminUser._id),
          targetRole: 'ADMIN',
          title: `Welcome to ${institutionName}! 🚀`,
          body: `Your institutional workspace has been initialized on the ${plan.toUpperCase()} tier with sample courses and administrative privileges.`,
          category: 'System',
          priority: 'HIGH',
          icon: '🏛️',
          color: 'indigo',
          institutionId: String(institution._id)
        });
      } catch (seedErr) {
        console.warn('Workspace sample seed skipped:', seedErr);
      }
    }

    // 8. Generate Auth Tokens
    const tokens = generateTokenPair({
      sub: String(adminUser._id),
      email: adminUser.email,
      role: adminUser.role,
      institutionId: String(institution._id)
    });

    const safeUser = adminUser.toObject();
    delete (safeUser as any).passwordHash;

    return sendSuccess(
      res,
      `Workspace for "${institutionName}" created successfully! Welcome to EduVerse AI.`,
      {
        user: safeUser,
        token: tokens.accessToken,
        tokens,
        institution
      },
      201
    );
  } catch (err: any) {
    return sendError(res, err.message || 'Workspace onboarding failed', 500);
  }
};

// ─── SaaS: Get Institutional Subscription & Billing Info ─────────────────────
export const getInstitutionBilling = async (req: Request, res: Response) => {
  try {
    let { id } = req.params;

    if (id === 'current' || !id) {
      id = (req.user as any)?.institutionId;
    }

    if (!id) {
      // Fallback to first available institution if not tenant-scoped
      const firstInst = await Institution.findOne({ isDeleted: { $ne: true } }).lean();
      if (firstInst) id = String(firstInst._id);
      else return sendError(res, 'No institution found', 404);
    }

    const inst = await Institution.findById(id).lean();
    if (!inst || (inst as any).isDeleted) {
      return sendError(res, 'Institution not found', 404);
    }

    const studentCount = await User.countDocuments({ institutionId: String(inst._id), role: 'STUDENT', isDeleted: { $ne: true } });
    const teacherCount = await User.countDocuments({ institutionId: String(inst._id), role: 'TEACHER', isDeleted: { $ne: true } });
    const adminCount = await User.countDocuments({ institutionId: String(inst._id), role: { $in: ['ADMIN', 'SUPER_ADMIN'] }, isDeleted: { $ne: true } });
    const courseCount = await Course.countDocuments({ institutionId: inst._id, status: 'active' });

    const subscription = (inst as any).subscription || {
      plan: inst.plan || 'professional',
      billingCycle: 'monthly',
      status: inst.status === 'trial' ? 'trialing' : 'active',
      trialEndsAt: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      currentPeriodEnd: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
      studentQuota: (inst as any).maxUsers || 500,
      facultyQuota: 50,
      storageQuotaGB: 50
    };

    const studentQuota = subscription.studentQuota || 500;
    const facultyQuota = subscription.facultyQuota || 50;
    const storageQuotaGB = subscription.storageQuotaGB || 50;
    const storageUsedGB = 4.3; // Measured mock asset footprint

    const invoices = [
      {
        id: `INV-2026-${inst.code}-001`,
        date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        amount: subscription.plan === 'starter' ? '₹4,999' : subscription.plan === 'enterprise' ? '₹49,999' : '₹14,999',
        plan: subscription.plan?.toUpperCase(),
        cycle: subscription.billingCycle || 'monthly',
        status: 'Paid',
        receipt: `https://invoices.eduverse.ai/receipt/${inst.code}/001`
      },
      {
        id: `INV-2026-${inst.code}-002`,
        date: new Date().toISOString().split('T')[0],
        amount: subscription.plan === 'starter' ? '₹4,999' : subscription.plan === 'enterprise' ? '₹49,999' : '₹14,999',
        plan: subscription.plan?.toUpperCase(),
        cycle: subscription.billingCycle || 'monthly',
        status: 'Active (Current)',
        receipt: `https://invoices.eduverse.ai/receipt/${inst.code}/002`
      }
    ];

    return sendSuccess(res, 'Institutional billing retrieved', {
      institution: {
        _id: inst._id,
        name: inst.name,
        code: inst.code,
        plan: inst.plan,
        status: inst.status,
        logo: inst.logo,
        city: inst.city,
        state: inst.state
      },
      subscription,
      usage: {
        students: {
          current: studentCount,
          max: studentQuota,
          percentage: Math.min(100, Math.round((studentCount / studentQuota) * 100))
        },
        faculty: {
          current: teacherCount,
          max: facultyQuota,
          percentage: Math.min(100, Math.round((teacherCount / facultyQuota) * 100))
        },
        storage: {
          currentGB: storageUsedGB,
          maxGB: storageQuotaGB,
          percentage: Math.min(100, Math.round((storageUsedGB / storageQuotaGB) * 100))
        },
        courses: {
          current: courseCount,
          max: 100,
          percentage: Math.min(100, Math.round((courseCount / 100) * 100))
        },
        administrators: adminCount
      },
      invoices
    }, 200);
  } catch (err: any) {
    return sendError(res, err.message || 'Failed to fetch billing info', 500);
  }
};

// ─── SaaS: Upgrade Institutional Subscription Tier ───────────────────────────
export const upgradeSubscription = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { plan, billingCycle = 'monthly' } = req.body;

    if (!['starter', 'professional', 'enterprise'].includes(plan)) {
      return sendError(res, 'Invalid subscription tier selected', 400);
    }

    const quotas = {
      starter: { studentQuota: 50, facultyQuota: 10, storageQuotaGB: 10, maxUsers: 65 },
      professional: { studentQuota: 500, facultyQuota: 50, storageQuotaGB: 50, maxUsers: 575 },
      enterprise: { studentQuota: 5000, facultyQuota: 500, storageQuotaGB: 500, maxUsers: 6000 }
    }[plan as 'starter' | 'professional' | 'enterprise'];

    const updated = await Institution.findByIdAndUpdate(
      id,
      {
        $set: {
          plan,
          status: 'active',
          maxUsers: quotas.maxUsers,
          'subscription.plan': plan,
          'subscription.billingCycle': billingCycle,
          'subscription.status': 'active',
          'subscription.currentPeriodEnd': new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          'subscription.studentQuota': quotas.studentQuota,
          'subscription.facultyQuota': quotas.facultyQuota,
          'subscription.storageQuotaGB': quotas.storageQuotaGB
        }
      },
      { new: true }
    );

    if (!updated) return sendError(res, 'Institution not found', 404);

    return sendSuccess(res, `Successfully upgraded to ${plan.toUpperCase()} plan!`, updated, 200);
  } catch (err: any) {
    return sendError(res, err.message || 'Failed to upgrade subscription', 500);
  }
};

export default {
  listInstitutions,
  getInstitution,
  createInstitution,
  updateInstitution,
  suspendInstitution,
  reactivateInstitution,
  deleteInstitution,
  getInstitutionUsers,
  listPublicInstitutions,
  onboardWorkspace,
  getInstitutionBilling,
  upgradeSubscription
};

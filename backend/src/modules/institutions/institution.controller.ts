import type { Request, Response } from 'express';
import Institution from './institution.model.js';
import User from '../users/user.model.js';
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

export default {
  listInstitutions,
  getInstitution,
  createInstitution,
  updateInstitution,
  suspendInstitution,
  reactivateInstitution,
  deleteInstitution,
  getInstitutionUsers
};

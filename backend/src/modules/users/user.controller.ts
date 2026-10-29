import type { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import User from './user.model.js';
import { sendSuccess, sendError } from '../../core/response/apiResponse.js';

export const listUsers = async (req: Request, res: Response) => {
  try {
    const institutionId = (req as any).institutionId;
    const { includeDeleted, role, department, search, status } = req.query;
    const filter: any = {};

    if (!includeDeleted || includeDeleted !== 'true') {
      filter.isDeleted = { $ne: true };
    }

    // Tenant scoping: non-super-admin users only see their institution's users
    if (institutionId) filter.institutionId = institutionId;

    if (role && role !== 'ALL') filter.role = String(role).toUpperCase();
    if (department && department !== 'ALL') filter.department = String(department);
    if (status && status !== 'ALL') filter.status = String(status).toLowerCase();

    if (search) {
      filter.$or = [
        { firstName: { $regex: String(search), $options: 'i' } },
        { lastName: { $regex: String(search), $options: 'i' } },
        { email: { $regex: String(search), $options: 'i' } },
        { phone: { $regex: String(search), $options: 'i' } }
      ];
    }

    const users = await User.find(filter)
      .populate('institutionId', 'name code')
      .select('-passwordHash')
      .sort({ createdAt: -1 })
      .lean();

    return sendSuccess(res, 'Users fetched successfully', users, 200);
  } catch (err: any) {
    return sendError(res, err.message || 'Failed to list users', 500);
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id).select('-passwordHash').lean();
    if (!user) {
      return sendError(res, 'User not found', 404);
    }
    return sendSuccess(res, 'User fetched successfully', user, 200);
  } catch (err: any) {
    return sendError(res, err.message || 'Failed to fetch user', 500);
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const institutionId = (req as any).institutionId;
    const { firstName, lastName, email, password, role, department, institutionId: bodyInstitutionId } = req.body;

    if (!firstName || !lastName || !email || !password || !role) {
      return sendError(res, 'First name, last name, email, password, and role are required', 400);
    }

    const allowedRoles = [
      'SUPER_ADMIN',
      'ADMIN',
      'CYBER_SECURITY_OFFICER',
      'FINANCE_OFFICER',
      'HR_MANAGER',
      'LIBRARIAN',
      'TRANSPORT_MANAGER',
      'PLACEMENT_OFFICER',
      'RECEPTIONIST',
      'ACADEMIC_CONTROLLER',
      'TEACHER',
      'STUDENT',
      'PARENT',
      'EMPLOYEE'
    ];
    if (!allowedRoles.includes(role.toUpperCase())) {
      return sendError(res, `Invalid role. Allowed roles: ${allowedRoles.join(', ')}`, 400);
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return sendError(res, 'An account with this email address already exists', 409);
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // Resolve institutionId: use body override (Super Admin) or tenant context
    const resolvedInstitutionId = bodyInstitutionId || institutionId || undefined;

    const newUser = await User.create({
      firstName,
      lastName,
      email: email.toLowerCase(),
      passwordHash,
      role: role.toUpperCase(),
      department: department || 'General',
      status: 'active',
      permissions: ['View Profile', 'Apply Leave', 'Download Payslip'],
      ...(resolvedInstitutionId && { institutionId: resolvedInstitutionId })
    });

    const userObj = newUser.toObject();
    delete (userObj as any).passwordHash;

    return sendSuccess(res, 'User created and provisioned successfully', userObj, 201);
  } catch (err: any) {
    return sendError(res, err.message || 'Failed to create user', 500);
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };
    delete updates.passwordHash;

    if (updates.password) {
      updates.passwordHash = await bcrypt.hash(updates.password, 10);
      delete updates.password;
    }

    const user = await User.findByIdAndUpdate(id, { $set: updates }, { returnDocument: 'after' }).select('-passwordHash');
    if (!user) return sendError(res, 'User not found', 404);

    return sendSuccess(res, 'User updated successfully', user, 200);
  } catch (err: any) {
    return sendError(res, err.message || 'Failed to update user', 500);
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(id, { isDeleted: true, deletedAt: new Date(), status: 'inactive' }, { returnDocument: 'after' });
    if (!user) return sendError(res, 'User not found', 404);

    return sendSuccess(res, 'User soft-deleted successfully', { id: user._id }, 200);
  } catch (err: any) {
    return sendError(res, err.message || 'Failed to delete user', 500);
  }
};

export const restoreUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(id, { isDeleted: false, deletedAt: undefined, status: 'active' }, { returnDocument: 'after' });
    if (!user) return sendError(res, 'User not found', 404);

    return sendSuccess(res, 'User restored successfully', user, 200);
  } catch (err: any) {
    return sendError(res, err.message || 'Failed to restore user', 500);
  }
};

export const bulkImportUsers = async (req: Request, res: Response) => {
  try {
    const { users } = req.body;
    if (!Array.isArray(users) || users.length === 0) {
      return sendError(res, 'An array of users is required for bulk import', 400);
    }

    const createdUsers = [];
    for (const u of users) {
      if (!u.email || !u.firstName || !u.lastName) continue;
      const existing = await User.findOne({ email: u.email.toLowerCase() });
      if (existing) continue;

      const pwd = u.password || 'EduVerse@2026';
      const passwordHash = await bcrypt.hash(pwd, 10);
      const created = await User.create({
        firstName: u.firstName,
        lastName: u.lastName,
        email: u.email.toLowerCase(),
        passwordHash,
        role: (u.role || 'EMPLOYEE').toUpperCase(),
        department: u.department || 'General',
        status: 'active',
        permissions: ['View Profile']
      });
      createdUsers.push(created);
    }

    return sendSuccess(res, `Bulk import complete. Imported ${createdUsers.length} new users.`, { count: createdUsers.length }, 200);
  } catch (err: any) {
    return sendError(res, err.message || 'Bulk import failed', 500);
  }
};

export const updateUserStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['active', 'suspended', 'inactive'].includes(String(status).toLowerCase())) {
      return sendError(res, "Status must be 'active', 'suspended', or 'inactive'", 400);
    }

    const normalizedStatus = String(status).toLowerCase();
    const updateData: any = { status: normalizedStatus };

    // If suspending, clear refresh tokens to immediately invalidate active sessions
    if (normalizedStatus === 'suspended') {
      updateData.refreshTokens = [];
    }

    const user = await User.findByIdAndUpdate(
      id,
      { $set: updateData },
      { returnDocument: 'after' }
    ).select('-passwordHash');

    if (!user) {
      return sendError(res, 'User not found', 404);
    }

    return sendSuccess(
      res,
      `User account ${normalizedStatus === 'suspended' ? 'suspended' : 'activated'} successfully`,
      user,
      200
    );
  } catch (err: any) {
    return sendError(res, err.message || 'Failed to update user status', 500);
  }
};

export const resetUserPassword = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { password } = req.body;

    if (!password || typeof password !== 'string' || password.length < 6) {
      return sendError(res, 'New password is required and must be at least 6 characters', 400);
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.findByIdAndUpdate(
      id,
      {
        $set: {
          passwordHash,
          refreshTokens: [], // Invalidate previous sessions
          loginAttempts: 0
        },
        $unset: { lockUntil: 1 }
      },
      { returnDocument: 'after' }
    ).select('-passwordHash');

    if (!user) {
      return sendError(res, 'User not found', 404);
    }

    return sendSuccess(
      res,
      `Password for ${user.firstName} ${user.lastName} changed successfully`,
      { id: user._id, email: user.email },
      200
    );
  } catch (err: any) {
    return sendError(res, err.message || 'Failed to reset user password', 500);
  }
};

export default {
  listUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  restoreUser,
  bulkImportUsers,
  updateUserStatus,
  resetUserPassword
};

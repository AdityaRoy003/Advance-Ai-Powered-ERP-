import type { Request, Response } from 'express';
import Department from './department.model.js';
import { sendSuccess, sendError } from '../../core/response/apiResponse.js';

export const listDepartments = async (req: Request, res: Response) => {
  try {
    const institutionId = (req as any).institutionId;
    const filter: any = { status: 'active' };
    if (institutionId) filter.institutionId = institutionId;

    const departments = await Department.find(filter).sort({ name: 1 }).lean();
    return sendSuccess(res, 'Departments fetched successfully', departments, 200);
  } catch (err: any) {
    return sendError(res, err.message || 'Failed to list departments', 500);
  }
};

export const createDepartment = async (req: Request, res: Response) => {
  try {
    const institutionId = (req as any).institutionId;
    const { code, name, headOfDepartment, annualBudget, totalFaculty, totalStudents } = req.body;

    if (!code || !name || !headOfDepartment) {
      return sendError(res, 'Department code, name, and HOD name are required', 400);
    }

    // Code uniqueness scoped to institution
    const existingFilter: any = { code: code.toUpperCase() };
    if (institutionId) existingFilter.institutionId = institutionId;
    const existing = await Department.findOne(existingFilter);
    if (existing) {
      return sendError(res, 'Department code already exists in this institution', 409);
    }

    const department = await Department.create({
      code: code.toUpperCase(),
      name,
      headOfDepartment,
      annualBudget: annualBudget || '₹50,00,000',
      totalFaculty: totalFaculty || 10,
      totalStudents: totalStudents || 150,
      ...(institutionId && { institutionId })
    });

    return sendSuccess(res, 'Department created successfully', department, 201);
  } catch (err: any) {
    return sendError(res, err.message || 'Failed to create department', 500);
  }
};

export default { listDepartments, createDepartment };


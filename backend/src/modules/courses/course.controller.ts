import type { Request, Response } from 'express';
import Course from './course.model.js';
import { sendSuccess, sendError } from '../../core/response/apiResponse.js';

export const listCourses = async (req: Request, res: Response) => {
  try {
    const institutionId = (req as any).institutionId;
    const { department, semester, search } = req.query;
    const filter: any = { status: 'active' };
    if (institutionId) filter.institutionId = institutionId;

    if (department) filter.department = String(department);
    if (semester) filter.semester = Number(semester);
    if (search) {
      filter.$or = [
        { code: { $regex: String(search), $options: 'i' } },
        { title: { $regex: String(search), $options: 'i' } }
      ];
    }

    const courses = await Course.find(filter).sort({ code: 1 }).lean();
    return sendSuccess(res, 'Courses fetched successfully', courses, 200);
  } catch (err: any) {
    return sendError(res, err.message || 'Failed to list courses', 500);
  }
};

export const createCourse = async (req: Request, res: Response) => {
  try {
    const institutionId = (req as any).institutionId;
    const { code, title, department, credits, semester, description, syllabus } = req.body;

    if (!code || !title || !department) {
      return sendError(res, 'Course code, title, and department are required', 400);
    }

    // Uniqueness scoped per institution
    const existingFilter: any = { code: code.toUpperCase() };
    if (institutionId) existingFilter.institutionId = institutionId;
    const existing = await Course.findOne(existingFilter);
    if (existing) {
      return sendError(res, 'Course with this code already exists in this institution', 409);
    }

    const course = await Course.create({
      code: code.toUpperCase(),
      title,
      department,
      credits: credits || 3,
      semester: semester || 1,
      description,
      syllabus: syllabus || [],
      ...(institutionId && { institutionId })
    });

    return sendSuccess(res, 'Course created successfully', course, 201);
  } catch (err: any) {
    return sendError(res, err.message || 'Failed to create course', 500);
  }
};

export const updateCourse = async (req: Request, res: Response) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, { $set: req.body }, { returnDocument: 'after' });
    if (!course) return sendError(res, 'Course not found', 404);
    return sendSuccess(res, 'Course updated successfully', course, 200);
  } catch (err: any) {
    return sendError(res, err.message || 'Failed to update course', 500);
  }
};

export const deleteCourse = async (req: Request, res: Response) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, { status: 'inactive' }, { returnDocument: 'after' });
    if (!course) return sendError(res, 'Course not found', 404);
    return sendSuccess(res, 'Course deactivated successfully', { id: course._id }, 200);
  } catch (err: any) {
    return sendError(res, err.message || 'Failed to delete course', 500);
  }
};

export default { listCourses, createCourse, updateCourse, deleteCourse };


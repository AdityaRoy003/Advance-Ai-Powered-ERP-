import type { Request, Response } from 'express';
import User from '../users/user.model.js';
import Course from '../courses/course.model.js';
import bcrypt from 'bcrypt';
import { sendSuccess, sendError } from '../../core/response/apiResponse.js';

interface MigrationRow {
  [key: string]: any;
}

export const validateMigrationData = async (req: Request, res: Response) => {
  try {
    const { targetEntity, rows = [] } = req.body;

    if (!['students', 'faculty', 'courses', 'books'].includes(targetEntity)) {
      return sendError(res, 'Invalid target entity for migration', 400);
    }

    if (!Array.isArray(rows) || rows.length === 0) {
      return sendError(res, 'No data rows provided for validation', 400);
    }

    const errors: Array<{ row: number; field: string; message: string }> = [];
    const validatedRows: Array<any> = [];

    rows.forEach((row: MigrationRow, index: number) => {
      const rowNum = index + 1;
      const clean: any = { ...row };

      if (targetEntity === 'students' || targetEntity === 'faculty') {
        if (!row.firstName || String(row.firstName).trim().length === 0) {
          errors.push({ row: rowNum, field: 'firstName', message: 'First name is required' });
        }
        if (!row.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(row.email).trim())) {
          errors.push({ row: rowNum, field: 'email', message: 'Valid institutional email is required' });
        }
        clean.role = targetEntity === 'students' ? 'STUDENT' : 'TEACHER';
      } else if (targetEntity === 'courses') {
        if (!row.code) {
          errors.push({ row: rowNum, field: 'code', message: 'Course code is required' });
        }
        if (!row.title) {
          errors.push({ row: rowNum, field: 'title', message: 'Course title is required' });
        }
      }

      validatedRows.push(clean);
    });

    const isSuccess = errors.length === 0;

    return sendSuccess(res, 'Migration validation complete', {
      targetEntity,
      totalRows: rows.length,
      validCount: rows.length - errors.length,
      invalidCount: errors.length,
      hasErrors: !isSuccess,
      errors,
      preview: validatedRows.slice(0, 10)
    }, 200);
  } catch (err: any) {
    return sendError(res, err.message || 'Validation failed', 500);
  }
};

export const executeMigration = async (req: Request, res: Response) => {
  try {
    const { targetEntity, rows = [] } = req.body;
    const institutionId = (req.user as any)?.institutionId;

    if (!Array.isArray(rows) || rows.length === 0) {
      return sendError(res, 'No rows provided to import', 400);
    }

    let importedCount = 0;
    const defaultPasswordHash = await bcrypt.hash('EduVerse@2026', 10);

    if (targetEntity === 'students' || targetEntity === 'faculty') {
      const role = targetEntity === 'students' ? 'STUDENT' : 'TEACHER';
      
      for (const row of rows) {
        const email = String(row.email || '').trim().toLowerCase();
        if (!email) continue;

        const existing = await User.findOne({ email });
        if (!existing) {
          await User.create({
            firstName: row.firstName || 'Student',
            lastName: row.lastName || '',
            email,
            passwordHash: defaultPasswordHash,
            role,
            status: 'active',
            institutionId: institutionId || undefined,
            emailVerified: true
          });
          importedCount++;
        }
      }
    } else if (targetEntity === 'courses') {
      for (const row of rows) {
        const code = String(row.code || '').trim().toUpperCase();
        if (!code) continue;

        const existing = await Course.findOne({ code, institutionId });
        if (!existing) {
          await Course.create({
            code,
            title: row.title || 'Untitled Course',
            department: row.department || 'General',
            credits: Number(row.credits) || 3,
            semester: Number(row.semester) || 1,
            institutionId: institutionId || undefined
          });
          importedCount++;
        }
      }
    }

    return sendSuccess(res, `Successfully imported ${importedCount} records into ${targetEntity}`, {
      targetEntity,
      totalSubmitted: rows.length,
      importedCount,
      timestamp: new Date()
    }, 201);
  } catch (err: any) {
    return sendError(res, err.message || 'Migration execution failed', 500);
  }
};

export default {
  validateMigrationData,
  executeMigration
};

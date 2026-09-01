import type { Request, Response } from 'express';
import PlacementDrive from './placement.model.js';
import { sendSuccess, sendError } from '../../core/response/apiResponse.js';

export const listDrives = async (req: Request, res: Response) => {
  try {
    const drives = await PlacementDrive.find().sort({ driveDate: 1 }).lean();
    return sendSuccess(res, 'Placement drives fetched successfully', drives, 200);
  } catch (err: any) {
    return sendError(res, err.message || 'Failed to list placement drives', 500);
  }
};

export const createDrive = async (req: Request, res: Response) => {
  try {
    const { companyName, role, packageOffered, eligibilityCGPA, driveDate, location, description, requirements } = req.body;

    if (!companyName || !role || !packageOffered || !driveDate) {
      return sendError(res, 'Company name, role, package, and drive date are required', 400);
    }

    const drive = await PlacementDrive.create({
      companyName,
      role,
      packageOffered,
      eligibilityCGPA: eligibilityCGPA || 6.0,
      driveDate: new Date(driveDate),
      location: location || 'On Campus',
      description,
      requirements: requirements || []
    });

    return sendSuccess(res, 'Placement drive created successfully', drive, 201);
  } catch (err: any) {
    return sendError(res, err.message || 'Failed to create placement drive', 500);
  }
};

export const applyForDrive = async (req: Request, res: Response) => {
  try {
    const drive = await PlacementDrive.findByIdAndUpdate(req.params.id, { $inc: { applicantsCount: 1 } }, { new: true });
    if (!drive) return sendError(res, 'Placement drive not found', 404);
    return sendSuccess(res, 'Application submitted successfully', drive, 200);
  } catch (err: any) {
    return sendError(res, err.message || 'Failed to apply for drive', 500);
  }
};

export default { listDrives, createDrive, applyForDrive };

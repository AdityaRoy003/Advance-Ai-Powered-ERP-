import type { Request, Response } from 'express';
import HostelRoom from './hostel.model.js';
import { sendSuccess, sendError } from '../../core/response/apiResponse.js';

export const getHostelRooms = async (req: Request, res: Response) => {
  try {
    const rooms = await HostelRoom.find().lean();
    return sendSuccess(res, 'Hostel rooms retrieved', rooms);
  } catch (err: any) {
    return sendError(res, err.message || 'Failed to fetch hostel rooms', 500);
  }
};

export const createHostelRoom = async (req: Request, res: Response) => {
  try {
    const room = await HostelRoom.create(req.body);
    return sendSuccess(res, 'Hostel room created', room, 201);
  } catch (err: any) {
    return sendError(res, err.message || 'Failed to create hostel room', 400);
  }
};

export const updateHostelRoom = async (req: Request, res: Response) => {
  try {
    const room = await HostelRoom.findByIdAndUpdate(req.params.id, req.body, { new: true });
    return sendSuccess(res, 'Hostel room updated', room);
  } catch (err: any) {
    return sendError(res, err.message || 'Failed to update hostel room', 400);
  }
};

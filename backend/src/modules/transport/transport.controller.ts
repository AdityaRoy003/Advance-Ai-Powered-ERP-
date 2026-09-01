import type { Request, Response } from 'express';
import TransportRoute from './transport.model.js';
import { sendSuccess, sendError } from '../../core/response/apiResponse.js';

export const getTransportRoutes = async (req: Request, res: Response) => {
  try {
    const routes = await TransportRoute.find().lean();
    return sendSuccess(res, 'Transport routes retrieved', routes);
  } catch (err: any) {
    return sendError(res, err.message || 'Failed to fetch transport routes', 500);
  }
};

export const createTransportRoute = async (req: Request, res: Response) => {
  try {
    const route = await TransportRoute.create(req.body);
    return sendSuccess(res, 'Transport route created', route, 201);
  } catch (err: any) {
    return sendError(res, err.message || 'Failed to create transport route', 400);
  }
};

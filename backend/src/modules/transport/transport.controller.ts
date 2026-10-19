import type { Request, Response } from 'express';
import TransportRoute from './transport.model.js';
import { sendSuccess, sendError } from '../../core/response/apiResponse.js';

export const getTransportRoutes = async (req: Request, res: Response) => {
  try {
    let routes = await TransportRoute.find().lean();
    if (!routes || routes.length === 0) {
      await TransportRoute.insertMany([
        { routeName: 'Route 1 - Metro Connect', busNumber: 'BUS-01', driverName: 'Suresh Yadav', driverPhone: '+91 9876543211', stops: ['Metro Station Gate 2', 'City Center', 'Tech Park', 'Campus Gate 1'], capacity: 45, occupied: 38 },
        { routeName: 'Route 2 - North City Express', busNumber: 'BUS-04', driverName: 'Rajesh Sharma', driverPhone: '+91 9811224455', stops: ['North Square', 'Ring Road', 'Library Circle', 'Campus Gate 2'], capacity: 50, occupied: 42 }
      ]);
      routes = await TransportRoute.find().lean();
    }
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

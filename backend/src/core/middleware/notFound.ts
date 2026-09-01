import type { Request, Response } from 'express';
import { sendError } from '../response/apiResponse.js';

const notFound = (req: Request, res: Response) => {
  return sendError(res, 'Route not found', null, 404);
};

export default notFound;

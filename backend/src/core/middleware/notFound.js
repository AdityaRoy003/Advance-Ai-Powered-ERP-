import { sendError } from '../response/apiResponse.js';

const notFound = (req, res) => {
  return sendError(res, 'Route not found', null, 404);
};

export default notFound;

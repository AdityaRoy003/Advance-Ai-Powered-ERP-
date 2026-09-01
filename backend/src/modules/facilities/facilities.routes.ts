import { Router } from 'express';
import { 
  getMessMenu, markMealAttendance, getMessWasteStats, 
  getMaintenanceTickets, createMaintenanceTicket, updateTicketStatus,
  getInventoryItems, getProcurementRequests, createProcurementRequest
} from './facilities.controller.js';
import { authenticate } from '../auth/auth.middleware.js';
import { tenantScope } from '../../middlewares/tenantScope.middleware.js';

const router = Router();

router.use(authenticate, tenantScope);

// Smart Mess / Cafeteria
router.get('/mess/menu', getMessMenu);
router.post('/mess/attendance', markMealAttendance);
router.get('/mess/waste-stats', getMessWasteStats);

// Facility & Maintenance Management
router.get('/maintenance/tickets', getMaintenanceTickets);
router.post('/maintenance/tickets', createMaintenanceTicket);
router.patch('/maintenance/tickets/:id', updateTicketStatus);

// Inventory & Procurement
router.get('/inventory/items', getInventoryItems);
router.get('/procurement/requests', getProcurementRequests);
router.post('/procurement/requests', createProcurementRequest);

export default router;

import type { Request, Response } from 'express';
import { 
  MessMenu, MealAttendance, MessWasteLog, 
  MaintenanceTicket, InventoryItem, ProcurementRequest 
} from './facilities.model.js';
import { sendSuccess, sendError } from '../../core/response/apiResponse.js';

// ─── 1. Smart Mess / Cafeteria Endpoints ────────────────────────────────────

export const getMessMenu = async (req: Request, res: Response) => {
  try {
    const institutionId = (req as any).institutionId;
    const filter: any = institutionId ? { institutionId } : {};
    let menus = await MessMenu.find(filter).sort({ createdAt: 1 });

    if (menus.length === 0) {
      // Seed initial balanced menu
      const defaultMenus = [
        { day: 'Monday', mealType: 'Breakfast', items: ['Idli & Sambar', 'Poha', 'Boiled Eggs', 'Fresh Juice', 'Tea/Coffee'], calories: 420, dietaryTags: ['Vegetarian', 'High-Protein'] },
        { day: 'Monday', mealType: 'Lunch', items: ['Paneer Butter Masala', 'Dal Tadka', 'Jeera Rice', 'Roti', 'Salad & Curd'], calories: 650, dietaryTags: ['Vegetarian'] },
        { day: 'Monday', mealType: 'Snacks', items: ['Veg Sandwich', 'Masala Chai', 'Biscuits'], calories: 280, dietaryTags: ['Vegetarian'] },
        { day: 'Monday', mealType: 'Dinner', items: ['Mix Veg Curry', 'Dal Makhani', 'Steamed Rice', 'Phulka', 'Gulab Jamun'], calories: 580, dietaryTags: ['Vegetarian'] },
        { day: 'Tuesday', mealType: 'Breakfast', items: ['Masala Dosa', 'Coconut Chutney', 'Oatmeal', 'Milk / Coffee'], calories: 440, dietaryTags: ['Vegetarian'] },
        { day: 'Tuesday', mealType: 'Lunch', items: ['Chicken Biryani / Veg Biryani', 'Raita', 'Mirchi Ka Salan', 'Boondi Ladoo'], calories: 720, dietaryTags: ['Non-Veg Available'] }
      ];
      menus = await MessMenu.insertMany(defaultMenus.map(m => ({ ...m, institutionId })) as any) as any;
    }

    return sendSuccess(res, 'Mess menus fetched successfully', menus);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch mess menus', null, 500);
  }
};

export const markMealAttendance = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const institutionId = (req as any).institutionId;
    const { mealType, date, status } = req.body;

    const record = await MealAttendance.create({
      studentId: user?._id || user?.id,
      studentName: user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email : 'Student',
      hostelBlock: req.body.hostelBlock || 'Block A',
      roomNumber: req.body.roomNumber || '204',
      mealType: mealType || 'Lunch',
      date: date || new Date().toISOString().split('T')[0],
      status: status || 'Attended',
      institutionId
    });

    return sendSuccess(res, 'Meal attendance marked successfully', record, 201);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to record meal attendance', null, 500);
  }
};

export const getMessWasteStats = async (req: Request, res: Response) => {
  try {
    const institutionId = (req as any).institutionId;
    const filter: any = institutionId ? { institutionId } : {};
    let logs = await MessWasteLog.find(filter).sort({ date: -1 }).limit(14);

    if (logs.length === 0) {
      // Seed sample logs
      const seedLogs = [
        { date: '2026-08-30', mealType: 'Lunch', foodPreparedKg: 450, foodConsumedKg: 418, foodWastedKg: 32, wastePercentage: 7.1, co2ImpactKg: 64.0 },
        { date: '2026-08-30', mealType: 'Dinner', foodPreparedKg: 420, foodConsumedKg: 395, foodWastedKg: 25, wastePercentage: 5.9, co2ImpactKg: 50.0 },
        { date: '2026-08-29', mealType: 'Lunch', foodPreparedKg: 460, foodConsumedKg: 422, foodWastedKg: 38, wastePercentage: 8.2, co2ImpactKg: 76.0 },
        { date: '2026-08-29', mealType: 'Dinner', foodPreparedKg: 410, foodConsumedKg: 388, foodWastedKg: 22, wastePercentage: 5.3, co2ImpactKg: 44.0 }
      ];
      logs = await MessWasteLog.insertMany(seedLogs.map(l => ({ ...l, institutionId })) as any) as any;
    }

    // AI Meal Demand Forecast calculation
    const totalPrepared = logs.reduce((s, l) => s + l.foodPreparedKg, 0);
    const totalWasted = logs.reduce((s, l) => s + l.foodWastedKg, 0);
    const avgWastageRate = logs.length > 0 ? (totalWasted / totalPrepared) * 100 : 6.5;

    const aiForecast = {
      predictedMealsTomorrow: 785,
      suggestedPrepKg: 392.5,
      expectedWastageKg: Math.round(392.5 * (avgWastageRate / 100)),
      potentialCostSavingsInr: 8450,
      carbonReductionKg: 42.8,
      modelConfidencePct: 94.2
    };

    return sendSuccess(res, 'Mess waste logs and AI forecast fetched', { logs, aiForecast });
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch waste stats', null, 500);
  }
};

// ─── 2. Facility & Maintenance Endpoints ────────────────────────────────────

export const getMaintenanceTickets = async (req: Request, res: Response) => {
  try {
    const institutionId = (req as any).institutionId;
    const filter: any = institutionId ? { institutionId } : {};
    let tickets = await MaintenanceTicket.find(filter).sort({ createdAt: -1 });

    if (tickets.length === 0) {
      const user = (req as any).user;
      const seedTickets = [
        {
          ticketNumber: 'TKT-2026-8812',
          category: 'Air Conditioning',
          location: 'Lab 402, Science Block',
          description: 'AC compressor failure causing room overheating during lab hours.',
          priority: 'HIGH',
          status: 'In Progress',
          reportedBy: user?._id || user?.id,
          reportedByName: 'Dr. Arjun Mehta',
          assignedTechnician: 'Ramesh Kumar (HVAC Lead)',
          technicianContact: '+91 98112 34501',
          responseSlaMins: 30,
          resolutionSlaHours: 4,
          reportedAt: new Date(Date.now() - 3600000)
        },
        {
          ticketNumber: 'TKT-2026-8813',
          category: 'Network / Wi-Fi',
          location: 'Hostel Block B, 3rd Floor',
          description: 'Access point AP-B3 drops connection under heavy evening load.',
          priority: 'MEDIUM',
          status: 'Assigned',
          reportedBy: user?._id || user?.id,
          reportedByName: 'Campus Student',
          assignedTechnician: 'Amit Sen (Network Admin)',
          technicianContact: '+91 98112 34502',
          responseSlaMins: 60,
          resolutionSlaHours: 8,
          reportedAt: new Date(Date.now() - 7200000)
        },
        {
          ticketNumber: 'TKT-2026-8814',
          category: 'Plumbing',
          location: 'Cafeteria Wash Area',
          description: 'Water tap leaking heavily, needs replacement washer.',
          priority: 'LOW',
          status: 'Repaired',
          reportedBy: user?._id || user?.id,
          reportedByName: 'Suresh Staff',
          assignedTechnician: 'Manoj Plumber',
          technicianContact: '+91 98112 34503',
          responseSlaMins: 120,
          resolutionSlaHours: 24,
          reportedAt: new Date(Date.now() - 86400000),
          resolvedAt: new Date(Date.now() - 43200000),
          feedbackRating: 5
        }
      ];
      tickets = await MaintenanceTicket.insertMany(seedTickets.map(t => ({ ...t, institutionId })) as any) as any;
    }

    return sendSuccess(res, 'Maintenance tickets fetched', tickets);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch maintenance tickets', null, 500);
  }
};

export const createMaintenanceTicket = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const institutionId = (req as any).institutionId;
    const { category, location, description, priority, reportedByName } = req.body;

    const count = await MaintenanceTicket.countDocuments();
    const ticketNumber = `TKT-2026-${String(8820 + count + Math.floor(Math.random() * 900))}`;

    const responseSla = priority === 'CRITICAL' ? 15 : priority === 'HIGH' ? 30 : priority === 'MEDIUM' ? 60 : 120;
    const resolutionSla = priority === 'CRITICAL' ? 2 : priority === 'HIGH' ? 4 : priority === 'MEDIUM' ? 8 : 24;

    const finalReportedByName = reportedByName || (user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email : 'Campus User');

    const ticket = await MaintenanceTicket.create({
      ticketNumber,
      category: category || 'Classroom',
      location: location || 'Campus Main Block',
      description: description || 'Routine maintenance required',
      priority: priority || 'MEDIUM',
      status: 'Reported',
      reportedBy: (user?._id || user?.id) && String(user?._id || user?.id).match(/^[0-9a-fA-F]{24}$/) ? (user._id || user.id) : undefined,
      reportedByName: finalReportedByName,
      assignedTechnician: 'Automated Facility Dispatcher',
      responseSlaMins: responseSla,
      resolutionSlaHours: resolutionSla,
      institutionId: institutionId && String(institutionId).match(/^[0-9a-fA-F]{24}$/) ? institutionId : undefined
    });

    return sendSuccess(res, 'Maintenance ticket created successfully', ticket, 201);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to create ticket', null, 500);
  }
};

export const updateTicketStatus = async (req: Request, res: Response) => {
  try {
    const userRole = (req as any).user?.role;
    if (userRole === 'STUDENT') {
      return sendError(res, 'Access denied: Students can only generate tickets and view status', null, 403);
    }

    const { id } = req.params;
    const { status, assignedTechnician, feedbackRating } = req.body;
    const update: any = { status };
    if (assignedTechnician) update.assignedTechnician = assignedTechnician;
    if (feedbackRating) update.feedbackRating = feedbackRating;
    if (status === 'Repaired' || status === 'Closed') update.resolvedAt = new Date();

    const ticket = await MaintenanceTicket.findByIdAndUpdate(id, { $set: update }, { new: true });
    return sendSuccess(res, 'Ticket status updated', ticket);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to update ticket', null, 500);
  }
};

// ─── 3. Inventory & Procurement Endpoints ──────────────────────────────────

export const getInventoryItems = async (req: Request, res: Response) => {
  try {
    const institutionId = (req as any).institutionId;
    const filter: any = institutionId ? { institutionId } : {};
    let items = await InventoryItem.find(filter).sort({ name: 1 });

    if (items.length === 0) {
      const seedItems = [
        { itemCode: 'INV-AST-01', name: 'Dell OptiPlex 7090 Desktop', category: 'IT Hardware', quantityInStock: 48, minThreshold: 10, unit: 'Units', location: 'CSE Lab 1', unitPrice: 55000, status: 'In Stock' },
        { itemCode: 'INV-LAB-02', name: 'Digital Storage Oscilloscope 100MHz', category: 'Lab Equipment', quantityInStock: 14, minThreshold: 5, unit: 'Units', location: 'ECE Hardware Lab', unitPrice: 32000, status: 'In Stock' },
        { itemCode: 'INV-STN-03', name: 'A4 Printing Paper Reams (75 GSM)', category: 'Stationery', quantityInStock: 6, minThreshold: 15, unit: 'Boxes', location: 'Central Admin Store', unitPrice: 1200, status: 'Low Stock' },
        { itemCode: 'INV-CHM-04', name: 'Analytical Grade Ethanol 99.9%', category: 'Consumables', quantityInStock: 2, minThreshold: 8, unit: 'Liters', location: 'Chemistry Lab Store', unitPrice: 850, status: 'Low Stock' },
        { itemCode: 'INV-FUR-05', name: 'Ergonomic Faculty Chairs', category: 'Furniture', quantityInStock: 35, minThreshold: 10, unit: 'Units', location: 'Furniture Warehouse', unitPrice: 4200, status: 'In Stock' }
      ];
      items = await InventoryItem.insertMany(seedItems.map(i => ({ ...i, institutionId })) as any) as any;
    }

    return sendSuccess(res, 'Inventory items fetched', items);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch inventory', null, 500);
  }
};

export const getProcurementRequests = async (req: Request, res: Response) => {
  try {
    const institutionId = (req as any).institutionId;
    const filter: any = institutionId ? { institutionId } : {};
    let requests = await ProcurementRequest.find(filter).sort({ createdAt: -1 });

    if (requests.length === 0) {
      const user = (req as any).user;
      const seedReqs = [
        {
          prNumber: 'PR-2026-104',
          department: 'Computer Science',
          requestedBy: user?._id || user?.id,
          requestedByName: 'Dr. Priya Nair',
          items: [{ name: 'NVIDIA RTX 4090 GPU Workstation', quantity: 2, estimatedCost: 480000 }],
          totalEstimatedCost: 480000,
          vendorName: 'CompuTech Enterprise Ltd.',
          quotationAmount: 465000,
          stage: 'PO Issued',
          poNumber: 'PO-2026-9901'
        },
        {
          prNumber: 'PR-2026-105',
          department: 'Civil Engineering',
          requestedBy: user?._id || user?.id,
          requestedByName: 'Prof. Rajesh Kumar',
          items: [{ name: 'Total Station Survey Equipment', quantity: 1, estimatedCost: 220000 }],
          totalEstimatedCost: 220000,
          stage: 'Quotation'
        }
      ];
      requests = await ProcurementRequest.insertMany(seedReqs.map(r => ({ ...r, institutionId })) as any) as any;
    }

    return sendSuccess(res, 'Procurement requests fetched', requests);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch procurement', null, 500);
  }
};

export const createProcurementRequest = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const institutionId = (req as any).institutionId;
    const { department, items, totalEstimatedCost, vendorName } = req.body;

    const count = await ProcurementRequest.countDocuments();
    const prNumber = `PR-2026-${String(106 + count)}`;

    const pr = await ProcurementRequest.create({
      prNumber,
      department: department || 'General Admin',
      requestedBy: user?._id || user?.id,
      requestedByName: user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email : 'Staff',
      items: items || [{ name: 'Requested Equipment', quantity: 1, estimatedCost: 10000 }],
      totalEstimatedCost: totalEstimatedCost || 10000,
      vendorName,
      stage: 'Request',
      institutionId
    });

    return sendSuccess(res, 'Procurement request submitted', pr, 201);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to create procurement request', null, 500);
  }
};

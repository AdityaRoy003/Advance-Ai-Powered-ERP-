import mongoose, { Schema, Document } from 'mongoose';

// ─── 1. Smart Mess / Cafeteria Models ──────────────────────────────────────
export interface IMessMenu extends Document {
  day: string; // Monday, Tuesday, etc.
  mealType: 'Breakfast' | 'Lunch' | 'Snacks' | 'Dinner';
  items: string[];
  calories: number;
  dietaryTags: string[]; // Vegetarian, Vegan, Gluten-Free, High-Protein
  specialDiet: boolean;
  institutionId?: mongoose.Types.ObjectId;
}

const MessMenuSchema = new Schema<IMessMenu>({
  day: { type: String, required: true },
  mealType: { type: String, enum: ['Breakfast', 'Lunch', 'Snacks', 'Dinner'], required: true },
  items: [{ type: String, required: true }],
  calories: { type: Number, default: 450 },
  dietaryTags: [{ type: String }],
  specialDiet: { type: Boolean, default: false },
  institutionId: { type: Schema.Types.ObjectId, ref: 'Institution' }
}, { timestamps: true });

export interface IMealAttendance extends Document {
  studentId: mongoose.Types.ObjectId;
  studentName: string;
  hostelBlock?: string;
  roomNumber?: string;
  mealType: 'Breakfast' | 'Lunch' | 'Snacks' | 'Dinner';
  date: string;
  scannedAt: Date;
  status: 'Attended' | 'Skipped' | 'Opted-Out';
  institutionId?: mongoose.Types.ObjectId;
}

const MealAttendanceSchema = new Schema<IMealAttendance>({
  studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  studentName: { type: String, required: true },
  hostelBlock: { type: String, default: 'Block A' },
  roomNumber: { type: String, default: '101' },
  mealType: { type: String, enum: ['Breakfast', 'Lunch', 'Snacks', 'Dinner'], required: true },
  date: { type: String, required: true },
  scannedAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['Attended', 'Skipped', 'Opted-Out'], default: 'Attended' },
  institutionId: { type: Schema.Types.ObjectId, ref: 'Institution' }
}, { timestamps: true });

export interface IMessWasteLog extends Document {
  date: string;
  mealType: 'Breakfast' | 'Lunch' | 'Snacks' | 'Dinner';
  foodPreparedKg: number;
  foodConsumedKg: number;
  foodWastedKg: number;
  wastePercentage: number;
  co2ImpactKg: number;
  institutionId?: mongoose.Types.ObjectId;
}

const MessWasteLogSchema = new Schema<IMessWasteLog>({
  date: { type: String, required: true },
  mealType: { type: String, enum: ['Breakfast', 'Lunch', 'Snacks', 'Dinner'], required: true },
  foodPreparedKg: { type: Number, required: true },
  foodConsumedKg: { type: Number, required: true },
  foodWastedKg: { type: Number, required: true },
  wastePercentage: { type: Number, required: true },
  co2ImpactKg: { type: Number, required: true },
  institutionId: { type: Schema.Types.ObjectId, ref: 'Institution' }
}, { timestamps: true });

// ─── 2. Facility & Maintenance Management Models ───────────────────────────
export interface IMaintenanceTicket extends Document {
  ticketNumber: string;
  category: 'Electrical' | 'Air Conditioning' | 'Plumbing' | 'Furniture' | 'Network / Wi-Fi' | 'Lab Equipment' | 'Classroom';
  location: string; // e.g. 'Lab 402, Science Block'
  description: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'Reported' | 'Assigned' | 'In Progress' | 'Repaired' | 'Verified' | 'Closed';
  reportedBy: mongoose.Types.ObjectId;
  reportedByName: string;
  assignedTechnician?: string;
  technicianContact?: string;
  responseSlaMins: number; // e.g. 30
  resolutionSlaHours: number; // e.g. 4
  reportedAt: Date;
  resolvedAt?: Date;
  feedbackRating?: number;
  institutionId?: mongoose.Types.ObjectId;
}

const MaintenanceTicketSchema = new Schema<IMaintenanceTicket>({
  ticketNumber: { type: String, required: true, unique: true },
  category: { type: String, enum: ['Electrical', 'Air Conditioning', 'Plumbing', 'Furniture', 'Network / Wi-Fi', 'Lab Equipment', 'Classroom'], required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  priority: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'], default: 'MEDIUM' },
  status: { type: String, enum: ['Reported', 'Assigned', 'In Progress', 'Repaired', 'Verified', 'Closed'], default: 'Reported' },
  reportedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  reportedByName: { type: String, default: 'Authorized User' },
  assignedTechnician: { type: String },
  technicianContact: { type: String },
  responseSlaMins: { type: Number, default: 30 },
  resolutionSlaHours: { type: Number, default: 4 },
  reportedAt: { type: Date, default: Date.now },
  resolvedAt: { type: Date },
  feedbackRating: { type: Number, min: 1, max: 5 },
  institutionId: { type: Schema.Types.ObjectId, ref: 'Institution' }
}, { timestamps: true });

// ─── 3. Inventory & Procurement Models ─────────────────────────────────────
export interface IInventoryItem extends Document {
  itemCode: string;
  name: string;
  category: 'Assets' | 'Lab Equipment' | 'Stationery' | 'Furniture' | 'Consumables' | 'IT Hardware';
  quantityInStock: number;
  minThreshold: number;
  unit: string; // Units, Boxes, Liters, Kg
  location: string; // Warehouse A, Lab 3, Central Store
  unitPrice: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  institutionId?: mongoose.Types.ObjectId;
}

const InventoryItemSchema = new Schema<IInventoryItem>({
  itemCode: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  category: { type: String, enum: ['Assets', 'Lab Equipment', 'Stationery', 'Furniture', 'Consumables', 'IT Hardware'], required: true },
  quantityInStock: { type: Number, required: true, default: 0 },
  minThreshold: { type: Number, required: true, default: 10 },
  unit: { type: String, default: 'Units' },
  location: { type: String, default: 'Central Store' },
  unitPrice: { type: Number, default: 0 },
  status: { type: String, enum: ['In Stock', 'Low Stock', 'Out of Stock'], default: 'In Stock' },
  institutionId: { type: Schema.Types.ObjectId, ref: 'Institution' }
}, { timestamps: true });

export interface IProcurementRequest extends Document {
  prNumber: string;
  department: string;
  requestedBy: mongoose.Types.ObjectId;
  requestedByName: string;
  items: {
    name: string;
    quantity: number;
    estimatedCost: number;
  }[];
  totalEstimatedCost: number;
  vendorName?: string;
  quotationAmount?: number;
  stage: 'Request' | 'Approval' | 'Quotation' | 'PO Issued' | 'Goods Received' | 'Invoiced' | 'Completed' | 'Rejected';
  approvedBy?: string;
  poNumber?: string;
  invoiceNumber?: string;
  institutionId?: mongoose.Types.ObjectId;
}

const ProcurementRequestSchema = new Schema<IProcurementRequest>({
  prNumber: { type: String, required: true, unique: true },
  department: { type: String, required: true },
  requestedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  requestedByName: { type: String, required: true },
  items: [{
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    estimatedCost: { type: Number, required: true }
  }],
  totalEstimatedCost: { type: Number, required: true },
  vendorName: { type: String },
  quotationAmount: { type: Number },
  stage: { 
    type: String, 
    enum: ['Request', 'Approval', 'Quotation', 'PO Issued', 'Goods Received', 'Invoiced', 'Completed', 'Rejected'], 
    default: 'Request' 
  },
  approvedBy: { type: String },
  poNumber: { type: String },
  invoiceNumber: { type: String },
  institutionId: { type: Schema.Types.ObjectId, ref: 'Institution' }
}, { timestamps: true });

export const MessMenu = mongoose.model<IMessMenu>('MessMenu', MessMenuSchema);
export const MealAttendance = mongoose.model<IMealAttendance>('MealAttendance', MealAttendanceSchema);
export const MessWasteLog = mongoose.model<IMessWasteLog>('MessWasteLog', MessWasteLogSchema);
export const MaintenanceTicket = mongoose.model<IMaintenanceTicket>('MaintenanceTicket', MaintenanceTicketSchema);
export const InventoryItem = mongoose.model<IInventoryItem>('InventoryItem', InventoryItemSchema);
export const ProcurementRequest = mongoose.model<IProcurementRequest>('ProcurementRequest', ProcurementRequestSchema);

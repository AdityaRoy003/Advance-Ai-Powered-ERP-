import mongoose, { Schema, Document } from 'mongoose';

// ─── 1. Policy Versions (Policy Simulator & Impact Analyzer) ───
export interface IPolicyVersion extends Document {
  version: string;
  role: string;
  permissions: Record<string, Record<string, boolean>>;
  changeSummary: string;
  author: string;
  isHighRisk: boolean;
  approvalStatus: 'APPROVED' | 'PENDING_APPROVAL' | 'ROLLED_BACK';
  approvedBy?: string;
  institutionId?: mongoose.Types.ObjectId | string;
  createdAt: Date;
}

const PolicyVersionSchema = new Schema<IPolicyVersion>(
  {
    version: { type: String, required: true },
    role: { type: String, required: true },
    permissions: { type: Schema.Types.Mixed, required: true },
    changeSummary: { type: String, required: true },
    author: { type: String, default: 'Super Admin' },
    isHighRisk: { type: Boolean, default: false },
    approvalStatus: { type: String, default: 'APPROVED' },
    approvedBy: { type: String },
    institutionId: { type: Schema.Types.ObjectId, ref: 'Institution', index: true }
  },
  { timestamps: true }
);

// ─── 2. Student Lifecycle (Promotion, Detention, Graduation, Withdrawal) ───
export interface IStudentLifecycle extends Document {
  studentId: string;
  studentName: string;
  rollNumber: string;
  currentSemester: string;
  targetSemester: string;
  gpa: number;
  creditsEarned: number;
  type: 'PROMOTION' | 'DETENTION' | 'GRADUATION' | 'WITHDRAWAL';
  status: 'COMPLETED' | 'PENDING_REVIEW' | 'FLAGGED';
  remarks: string;
  actionDate: Date;
  institutionId?: mongoose.Types.ObjectId | string;
}

const StudentLifecycleSchema = new Schema<IStudentLifecycle>(
  {
    studentId: { type: String, required: true },
    studentName: { type: String, required: true },
    rollNumber: { type: String, required: true },
    currentSemester: { type: String, required: true },
    targetSemester: { type: String, required: true },
    gpa: { type: Number, required: true },
    creditsEarned: { type: Number, required: true },
    type: { type: String, enum: ['PROMOTION', 'DETENTION', 'GRADUATION', 'WITHDRAWAL'], required: true },
    status: { type: String, default: 'COMPLETED' },
    remarks: { type: String, default: '' },
    actionDate: { type: Date, default: Date.now },
    institutionId: { type: Schema.Types.ObjectId, ref: 'Institution', index: true }
  },
  { timestamps: true }
);

// ─── 3. Student Transfer (Section, Department, Campus) ───
export interface IStudentTransfer extends Document {
  transferId: string;
  studentId: string;
  studentName: string;
  transferType: 'SECTION' | 'DEPARTMENT' | 'CAMPUS';
  fromValue: string;
  toValue: string;
  reason: string;
  status: 'APPROVED' | 'PENDING' | 'REJECTED';
  approvedBy: string;
  effectiveDate: Date;
  institutionId?: mongoose.Types.ObjectId | string;
}

const StudentTransferSchema = new Schema<IStudentTransfer>(
  {
    transferId: { type: String, required: true, unique: true },
    studentId: { type: String, required: true },
    studentName: { type: String, required: true },
    transferType: { type: String, enum: ['SECTION', 'DEPARTMENT', 'CAMPUS'], required: true },
    fromValue: { type: String, required: true },
    toValue: { type: String, required: true },
    reason: { type: String, required: true },
    status: { type: String, default: 'APPROVED' },
    approvedBy: { type: String, default: 'Registrar Office' },
    effectiveDate: { type: Date, default: Date.now },
    institutionId: { type: Schema.Types.ObjectId, ref: 'Institution', index: true }
  },
  { timestamps: true }
);

// ─── 4. Emergency Contacts & Guardian Records ───
export interface IEmergencyContact extends Document {
  studentId: string;
  studentName: string;
  contacts: Array<{
    name: string;
    relation: string;
    phone: string;
    email: string;
    address: string;
    isPrimary: boolean;
    isAuthorizedToPickup: boolean;
  }>;
  institutionId?: mongoose.Types.ObjectId | string;
}

const EmergencyContactSchema = new Schema<IEmergencyContact>(
  {
    studentId: { type: String, required: true, unique: true },
    studentName: { type: String, required: true },
    contacts: [
      {
        name: { type: String, required: true },
        relation: { type: String, required: true },
        phone: { type: String, required: true },
        email: { type: String, default: '' },
        address: { type: String, default: '' },
        isPrimary: { type: Boolean, default: false },
        isAuthorizedToPickup: { type: Boolean, default: false }
      }
    ],
    institutionId: { type: Schema.Types.ObjectId, ref: 'Institution', index: true }
  },
  { timestamps: true }
);

// ─── 5. Document Expiry & Verification Tracker ───
export interface IStudentDocument extends Document {
  studentId: string;
  studentName: string;
  docType: 'Passport' | 'Student Visa' | 'Aadhaar / National ID' | 'Medical Clearance' | 'High School Transcripts';
  docNumber: string;
  expiryDate?: Date;
  status: 'VERIFIED' | 'EXPIRING_SOON' | 'EXPIRED' | 'PENDING_VERIFICATION';
  verifiedBy: string;
  fileUrl?: string;
  institutionId?: mongoose.Types.ObjectId | string;
}

const StudentDocumentSchema = new Schema<IStudentDocument>(
  {
    studentId: { type: String, required: true },
    studentName: { type: String, required: true },
    docType: { type: String, required: true },
    docNumber: { type: String, required: true },
    expiryDate: { type: Date },
    status: { type: String, enum: ['VERIFIED', 'EXPIRING_SOON', 'EXPIRED', 'PENDING_VERIFICATION'], default: 'VERIFIED' },
    verifiedBy: { type: String, default: 'Academic Affairs' },
    fileUrl: { type: String },
    institutionId: { type: Schema.Types.ObjectId, ref: 'Institution', index: true }
  },
  { timestamps: true }
);

// ─── 6. Academic Calendar & Holidays ───
export interface IAcademicCalendarEvent extends Document {
  title: string;
  type: 'TERM_START' | 'TERM_END' | 'HOLIDAY' | 'EXAMINATION' | 'RECESS' | 'HACKATHON';
  startDate: Date;
  endDate: Date;
  description: string;
  isGazettedHoliday: boolean;
  affectedAudiences: string[];
  institutionId?: mongoose.Types.ObjectId | string;
}

const AcademicCalendarEventSchema = new Schema<IAcademicCalendarEvent>(
  {
    title: { type: String, required: true },
    type: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    description: { type: String, default: '' },
    isGazettedHoliday: { type: Boolean, default: false },
    affectedAudiences: { type: [String], default: ['All'] },
    institutionId: { type: Schema.Types.ObjectId, ref: 'Institution', index: true }
  },
  { timestamps: true }
);

// ─── 7. Certificates (Bonafide, Transfer, Migration, Character) ───
export interface ICertificateRecord extends Document {
  serialNumber: string;
  certType: 'BONAFIDE' | 'TRANSFER_CERTIFICATE' | 'MIGRATION' | 'CHARACTER';
  studentId: string;
  studentName: string;
  course: string;
  department: string;
  issueDate: Date;
  reason: string;
  verificationHash: string;
  status: 'ISSUED' | 'REVOKED';
  institutionId?: mongoose.Types.ObjectId | string;
}

const CertificateRecordSchema = new Schema<ICertificateRecord>(
  {
    serialNumber: { type: String, required: true, unique: true },
    certType: { type: String, enum: ['BONAFIDE', 'TRANSFER_CERTIFICATE', 'MIGRATION', 'CHARACTER'], required: true },
    studentId: { type: String, required: true },
    studentName: { type: String, required: true },
    course: { type: String, required: true },
    department: { type: String, required: true },
    issueDate: { type: Date, default: Date.now },
    reason: { type: String, default: 'General Academic Purpose' },
    verificationHash: { type: String, required: true },
    status: { type: String, default: 'ISSUED' },
    institutionId: { type: Schema.Types.ObjectId, ref: 'Institution', index: true }
  },
  { timestamps: true }
);

// ─── 8. Fee Adjustments (Refunds, Reversals, Waivers, Scholarships) ───
export interface IFeeAdjustment extends Document {
  adjustmentNumber: string;
  studentId: string;
  studentName: string;
  type: 'REFUND' | 'REVERSAL' | 'WAIVER' | 'SCHOLARSHIP';
  amount: number;
  reason: string;
  status: 'APPROVED' | 'PENDING' | 'REJECTED';
  approvedBy: string;
  date: Date;
  institutionId?: mongoose.Types.ObjectId | string;
}

const FeeAdjustmentSchema = new Schema<IFeeAdjustment>(
  {
    adjustmentNumber: { type: String, required: true, unique: true },
    studentId: { type: String, required: true },
    studentName: { type: String, required: true },
    type: { type: String, enum: ['REFUND', 'REVERSAL', 'WAIVER', 'SCHOLARSHIP'], required: true },
    amount: { type: Number, required: true },
    reason: { type: String, required: true },
    status: { type: String, default: 'APPROVED' },
    approvedBy: { type: String, default: 'Finance Director' },
    date: { type: Date, default: Date.now },
    institutionId: { type: Schema.Types.ObjectId, ref: 'Institution', index: true }
  },
  { timestamps: true }
);

// ─── 9. Fee Receipts (Sequential Numbering & Duplicate Protection) ───
export interface IFeeReceipt extends Document {
  receiptNumber: string;
  studentId: string;
  studentName: string;
  semester: string;
  amount: number;
  paymentMode: 'UPI' | 'NET_BANKING' | 'CREDIT_CARD' | 'CASH' | 'CHEQUE';
  transactionReference: string;
  antiDuplicateHash: string;
  issuedAt: Date;
  institutionId?: mongoose.Types.ObjectId | string;
}

const FeeReceiptSchema = new Schema<IFeeReceipt>(
  {
    receiptNumber: { type: String, required: true, unique: true },
    studentId: { type: String, required: true },
    studentName: { type: String, required: true },
    semester: { type: String, required: true },
    amount: { type: Number, required: true },
    paymentMode: { type: String, required: true },
    transactionReference: { type: String, required: true },
    antiDuplicateHash: { type: String, required: true, unique: true },
    issuedAt: { type: Date, default: Date.now },
    institutionId: { type: Schema.Types.ObjectId, ref: 'Institution', index: true }
  },
  { timestamps: true }
);

// ─── 10. Vendor Bills & Expense Reimbursements ───
export interface IVendorBill extends Document {
  billNumber: string;
  vendorName: string;
  category: 'LAB_EQUIPMENT' | 'IT_SOFTWARE' | 'HOSTEL_SUPPLIES' | 'FACILITY_MAINTENANCE' | 'EVENTS';
  amount: number;
  poNumber: string;
  dueDate: Date;
  status: 'PENDING_APPROVAL' | 'APPROVED' | 'DISBURSED' | 'REJECTED';
  approvedBy?: string;
  threeWayMatched: boolean;
  institutionId?: mongoose.Types.ObjectId | string;
}

const VendorBillSchema = new Schema<IVendorBill>(
  {
    billNumber: { type: String, required: true, unique: true },
    vendorName: { type: String, required: true },
    category: { type: String, required: true },
    amount: { type: Number, required: true },
    poNumber: { type: String, required: true },
    dueDate: { type: Date, required: true },
    status: { type: String, default: 'APPROVED' },
    approvedBy: { type: String, default: 'Procurement Committee' },
    threeWayMatched: { type: Boolean, default: true },
    institutionId: { type: Schema.Types.ObjectId, ref: 'Institution', index: true }
  },
  { timestamps: true }
);

// ─── 11. Daily Cashbook & Bank Reconciliation ───
export interface ICashbookEntry extends Document {
  entryNumber: string;
  date: Date;
  type: 'INFLOW' | 'OUTFLOW';
  head: string;
  amount: number;
  mode: 'CASH' | 'BANK_TRANSFER' | 'GATEWAY';
  bankReconciled: boolean;
  reconciliationRef?: string;
  institutionId?: mongoose.Types.ObjectId | string;
}

const CashbookEntrySchema = new Schema<ICashbookEntry>(
  {
    entryNumber: { type: String, required: true, unique: true },
    date: { type: Date, default: Date.now },
    type: { type: String, enum: ['INFLOW', 'OUTFLOW'], required: true },
    head: { type: String, required: true },
    amount: { type: Number, required: true },
    mode: { type: String, required: true },
    bankReconciled: { type: Boolean, default: true },
    reconciliationRef: { type: String },
    institutionId: { type: Schema.Types.ObjectId, ref: 'Institution', index: true }
  },
  { timestamps: true }
);

// ─── 12. Central No-Dues Clearance ───
export interface INoDuesClearance extends Document {
  clearanceId: string;
  studentId: string;
  studentName: string;
  department: string;
  approvals: {
    library: { cleared: boolean; clearedBy?: string; pendingRemarks?: string };
    hostel: { cleared: boolean; clearedBy?: string; pendingRemarks?: string };
    finance: { cleared: boolean; clearedBy?: string; pendingRemarks?: string };
    department: { cleared: boolean; clearedBy?: string; pendingRemarks?: string };
    sports: { cleared: boolean; clearedBy?: string; pendingRemarks?: string };
  };
  overallStatus: 'CLEARED' | 'IN_PROGRESS' | 'BLOCKED';
  certificateIssued: boolean;
  institutionId?: mongoose.Types.ObjectId | string;
}

const NoDuesClearanceSchema = new Schema<INoDuesClearance>(
  {
    clearanceId: { type: String, required: true, unique: true },
    studentId: { type: String, required: true },
    studentName: { type: String, required: true },
    department: { type: String, required: true },
    approvals: {
      library: { cleared: { type: Boolean, default: true }, clearedBy: { type: String, default: 'Librarian' } },
      hostel: { cleared: { type: Boolean, default: true }, clearedBy: { type: String, default: 'Hostel Warden' } },
      finance: { cleared: { type: Boolean, default: true }, clearedBy: { type: String, default: 'Finance Officer' } },
      department: { cleared: { type: Boolean, default: true }, clearedBy: { type: String, default: 'HOD CSE' } },
      sports: { cleared: { type: Boolean, default: true }, clearedBy: { type: String, default: 'Sports Secretary' } }
    },
    overallStatus: { type: String, default: 'CLEARED' },
    certificateIssued: { type: Boolean, default: true },
    institutionId: { type: Schema.Types.ObjectId, ref: 'Institution', index: true }
  },
  { timestamps: true }
);

// ─── 13. Substitute Teacher Assignment & Timetable Conflict Checks ───
export interface ISubstituteAssignment extends Document {
  assignmentId: string;
  originalTeacherName: string;
  substituteTeacherName: string;
  day: string;
  timeSlot: string;
  room: string;
  subject: string;
  conflictChecked: boolean;
  hasConflict: boolean;
  status: 'CONFIRMED' | 'PENDING' | 'REJECTED';
  institutionId?: mongoose.Types.ObjectId | string;
}

const SubstituteAssignmentSchema = new Schema<ISubstituteAssignment>(
  {
    assignmentId: { type: String, required: true, unique: true },
    originalTeacherName: { type: String, required: true },
    substituteTeacherName: { type: String, required: true },
    day: { type: String, required: true },
    timeSlot: { type: String, required: true },
    room: { type: String, required: true },
    subject: { type: String, required: true },
    conflictChecked: { type: Boolean, default: true },
    hasConflict: { type: Boolean, default: false },
    status: { type: String, default: 'CONFIRMED' },
    institutionId: { type: Schema.Types.ObjectId, ref: 'Institution', index: true }
  },
  { timestamps: true }
);

// ─── 14. Faculty Workload & Teaching-Hour Tracking ───
export interface IFacultyWorkload extends Document {
  teacherName: string;
  department: string;
  lectureHoursWeekly: number;
  labHoursWeekly: number;
  researchHoursWeekly: number;
  totalWeeklyHours: number;
  maxPrescribedHours: number;
  complianceStatus: 'OPTIMAL' | 'OVERLOADED' | 'UNDERLOADED';
  institutionId?: mongoose.Types.ObjectId | string;
}

const FacultyWorkloadSchema = new Schema<IFacultyWorkload>(
  {
    teacherName: { type: String, required: true },
    department: { type: String, required: true },
    lectureHoursWeekly: { type: Number, required: true },
    labHoursWeekly: { type: Number, required: true },
    researchHoursWeekly: { type: Number, required: true },
    totalWeeklyHours: { type: Number, required: true },
    maxPrescribedHours: { type: Number, default: 22 },
    complianceStatus: { type: String, default: 'OPTIMAL' },
    institutionId: { type: Schema.Types.ObjectId, ref: 'Institution', index: true }
  },
  { timestamps: true }
);

// ─── 15. Staff Onboarding, Contract Expiry & Exit Clearance ───
export interface IStaffLifecycle extends Document {
  staffId: string;
  staffName: string;
  role: string;
  department: string;
  type: 'ONBOARDING' | 'CONTRACT_ACTIVE' | 'CONTRACT_EXPIRING' | 'EXIT_CLEARANCE';
  contractEndDate: Date;
  onboardingProgress: number; // 0 to 100%
  exitClearanceApproved: boolean;
  status: 'ACTIVE' | 'ACTION_REQUIRED' | 'COMPLETED';
  institutionId?: mongoose.Types.ObjectId | string;
}

const StaffLifecycleSchema = new Schema<IStaffLifecycle>(
  {
    staffId: { type: String, required: true },
    staffName: { type: String, required: true },
    role: { type: String, required: true },
    department: { type: String, required: true },
    type: { type: String, required: true },
    contractEndDate: { type: Date, required: true },
    onboardingProgress: { type: Number, default: 100 },
    exitClearanceApproved: { type: Boolean, default: false },
    status: { type: String, default: 'ACTIVE' },
    institutionId: { type: Schema.Types.ObjectId, ref: 'Institution', index: true }
  },
  { timestamps: true }
);

// ─── 16. Multi-Channel Dispatch Logs (Email, SMS, WhatsApp) ───
export interface IDispatchLog extends Document {
  messageId: string;
  channel: 'EMAIL' | 'SMS' | 'WHATSAPP';
  recipient: string;
  subjectOrTemplate: string;
  status: 'DELIVERED' | 'FAILED' | 'PENDING';
  retryCount: number;
  deliveryTime?: Date;
  institutionId?: mongoose.Types.ObjectId | string;
}

const DispatchLogSchema = new Schema<IDispatchLog>(
  {
    messageId: { type: String, required: true, unique: true },
    channel: { type: String, enum: ['EMAIL', 'SMS', 'WHATSAPP'], required: true },
    recipient: { type: String, required: true },
    subjectOrTemplate: { type: String, required: true },
    status: { type: String, enum: ['DELIVERED', 'FAILED', 'PENDING'], default: 'DELIVERED' },
    retryCount: { type: Number, default: 0 },
    deliveryTime: { type: Date, default: Date.now },
    institutionId: { type: Schema.Types.ObjectId, ref: 'Institution', index: true }
  },
  { timestamps: true }
);

// ─── 17. Event Registration & RSVP ───
export interface IEventRegistration extends Document {
  eventTitle: string;
  attendeeName: string;
  attendeeEmail: string;
  attendeeRole: string;
  rsvpStatus: 'ATTENDING' | 'DECLINED' | 'WAITLISTED';
  checkedIn: boolean;
  institutionId?: mongoose.Types.ObjectId | string;
}

const EventRegistrationSchema = new Schema<IEventRegistration>(
  {
    eventTitle: { type: String, required: true },
    attendeeName: { type: String, required: true },
    attendeeEmail: { type: String, required: true },
    attendeeRole: { type: String, required: true },
    rsvpStatus: { type: String, default: 'ATTENDING' },
    checkedIn: { type: Boolean, default: false },
    institutionId: { type: Schema.Types.ObjectId, ref: 'Institution', index: true }
  },
  { timestamps: true }
);

// ─── 18. Duplicate Record Detection ───
export interface IDuplicateRecord extends Document {
  recordA: { id: string; name: string; email: string; phone: string };
  recordB: { id: string; name: string; email: string; phone: string };
  matchedBy: 'EMAIL' | 'PHONE' | 'ENROLLMENT_NO' | 'SIMILAR_NAME';
  matchScore: number;
  status: 'OPEN_FLAG' | 'MERGED' | 'DISMISSED';
  institutionId?: mongoose.Types.ObjectId | string;
}

const DuplicateRecordSchema = new Schema<IDuplicateRecord>(
  {
    recordA: { type: Schema.Types.Mixed, required: true },
    recordB: { type: Schema.Types.Mixed, required: true },
    matchedBy: { type: String, required: true },
    matchScore: { type: Number, required: true },
    status: { type: String, default: 'OPEN_FLAG' },
    institutionId: { type: Schema.Types.ObjectId, ref: 'Institution', index: true }
  },
  { timestamps: true }
);

// ─── 19. Soft-Delete Recycle Bin & Change Audit History ───
export interface ISoftDeleteAudit extends Document {
  entityType: string;
  entityId: string;
  entityName: string;
  deletedBy: string;
  deletedAt: Date;
  snapshotData: Record<string, any>;
  isRestored: boolean;
  institutionId?: mongoose.Types.ObjectId | string;
}

const SoftDeleteAuditSchema = new Schema<ISoftDeleteAudit>(
  {
    entityType: { type: String, required: true },
    entityId: { type: String, required: true },
    entityName: { type: String, required: true },
    deletedBy: { type: String, default: 'Admin User' },
    deletedAt: { type: Date, default: Date.now },
    snapshotData: { type: Schema.Types.Mixed, required: true },
    isRestored: { type: Boolean, default: false },
    institutionId: { type: Schema.Types.ObjectId, ref: 'Institution', index: true }
  },
  { timestamps: true }
);

export const PolicyVersion = mongoose.model<IPolicyVersion>('PolicyVersion', PolicyVersionSchema);
export const StudentLifecycle = mongoose.model<IStudentLifecycle>('StudentLifecycle', StudentLifecycleSchema);
export const StudentTransfer = mongoose.model<IStudentTransfer>('StudentTransfer', StudentTransferSchema);
export const EmergencyContact = mongoose.model<IEmergencyContact>('EmergencyContact', EmergencyContactSchema);
export const StudentDocument = mongoose.model<IStudentDocument>('StudentDocument', StudentDocumentSchema);
export const AcademicCalendarEvent = mongoose.model<IAcademicCalendarEvent>('AcademicCalendarEvent', AcademicCalendarEventSchema);
export const CertificateRecord = mongoose.model<ICertificateRecord>('CertificateRecord', CertificateRecordSchema);
export const FeeAdjustment = mongoose.model<IFeeAdjustment>('FeeAdjustment', FeeAdjustmentSchema);
export const FeeReceipt = mongoose.model<IFeeReceipt>('FeeReceipt', FeeReceiptSchema);
export const VendorBill = mongoose.model<IVendorBill>('VendorBill', VendorBillSchema);
export const CashbookEntry = mongoose.model<ICashbookEntry>('CashbookEntry', CashbookEntrySchema);
export const NoDuesClearance = mongoose.model<INoDuesClearance>('NoDuesClearance', NoDuesClearanceSchema);
export const SubstituteAssignment = mongoose.model<ISubstituteAssignment>('SubstituteAssignment', SubstituteAssignmentSchema);
export const FacultyWorkload = mongoose.model<IFacultyWorkload>('FacultyWorkload', FacultyWorkloadSchema);
export const StaffLifecycle = mongoose.model<IStaffLifecycle>('StaffLifecycle', StaffLifecycleSchema);
export const DispatchLog = mongoose.model<IDispatchLog>('DispatchLog', DispatchLogSchema);
export const EventRegistration = mongoose.model<IEventRegistration>('EventRegistration', EventRegistrationSchema);
export const DuplicateRecord = mongoose.model<IDuplicateRecord>('DuplicateRecord', DuplicateRecordSchema);
export const SoftDeleteAudit = mongoose.model<ISoftDeleteAudit>('SoftDeleteAudit', SoftDeleteAuditSchema);

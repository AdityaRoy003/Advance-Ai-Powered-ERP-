import mongoose, { Schema, Document } from 'mongoose';

// ─── 1. ACADEMIC CALENDAR ───
export interface IAcademicCalendar extends Document {
  institutionId?: mongoose.Types.ObjectId | string;
  academicYear: string;
  systemType: 'semester' | 'trimester';
  currentTerm: string;
  isFrozen: boolean;
  isPublished: boolean;
  publishedAt?: Date;
  events: Array<{
    id: string;
    title: string;
    category: 'holiday' | 'event' | 'exam_window' | 'registration' | 'add_drop';
    startDate: string;
    endDate: string;
    description?: string;
    targetAudience: string[];
  }>;
}

const AcademicCalendarSchema = new Schema<IAcademicCalendar>(
  {
    institutionId: { type: Schema.Types.ObjectId, ref: 'Institution', index: true },
    academicYear: { type: String, required: true, default: '2026-2027' },
    systemType: { type: String, enum: ['semester', 'trimester'], default: 'semester' },
    currentTerm: { type: String, default: 'Semester 4 / Even Sem 2026' },
    isFrozen: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: true },
    publishedAt: { type: Date, default: Date.now },
    events: [
      {
        id: { type: String, required: true },
        title: { type: String, required: true },
        category: { 
          type: String, 
          enum: ['holiday', 'event', 'exam_window', 'registration', 'add_drop'], 
          required: true 
        },
        startDate: { type: String, required: true },
        endDate: { type: String, required: true },
        description: { type: String, default: '' },
        targetAudience: { type: [String], default: ['students', 'faculty', 'parents'] }
      }
    ]
  },
  { timestamps: true }
);

// ─── 2. TIMETABLE SLOT ───
export interface ITimetableSlot extends Document {
  institutionId?: mongoose.Types.ObjectId | string;
  courseCode: string;
  subjectTitle: string;
  teacherName: string;
  teacherId?: string;
  room: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  department: string;
  semester: number;
  batch?: string;
  isLab: boolean;
  isLocked: boolean;
  hasConflict?: boolean;
  conflictDetails?: string;
}

const TimetableSlotSchema = new Schema<ITimetableSlot>(
  {
    institutionId: { type: Schema.Types.ObjectId, ref: 'Institution', index: true },
    courseCode: { type: String, required: true, uppercase: true },
    subjectTitle: { type: String, required: true },
    teacherName: { type: String, required: true },
    teacherId: { type: String },
    room: { type: String, required: true },
    dayOfWeek: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    department: { type: String, required: true, default: 'Computer Science & Engineering' },
    semester: { type: Number, required: true, default: 4 },
    batch: { type: String, default: 'Batch A' },
    isLab: { type: Boolean, default: false },
    isLocked: { type: Boolean, default: false },
    hasConflict: { type: Boolean, default: false },
    conflictDetails: { type: String, default: '' }
  },
  { timestamps: true }
);

// ─── 3. EXAM SCHEDULE & SEATING PLAN ───
export interface IExamSchedule extends Document {
  institutionId?: mongoose.Types.ObjectId | string;
  title: string;
  type: 'midterm' | 'final' | 'practical' | 'viva' | 'internal' | 'backpaper';
  subject: string;
  courseCode: string;
  department: string;
  semester: number;
  date: string;
  startTime: string;
  durationMinutes: number;
  building: string;
  room: string;
  totalCapacity: number;
  status: 'draft' | 'review' | 'principal_approved' | 'published' | 'locked';
  approvalNotes?: string;
  seatingPlan: Array<{
    seatNumber: string;
    rollNumber: string;
    studentName: string;
    department: string;
    room: string;
  }>;
  invigilators: Array<{
    teacherName: string;
    department: string;
    dutyConfirmed: boolean;
  }>;
}

const ExamScheduleSchema = new Schema<IExamSchedule>(
  {
    institutionId: { type: Schema.Types.ObjectId, ref: 'Institution', index: true },
    title: { type: String, required: true },
    type: { 
      type: String, 
      enum: ['midterm', 'final', 'practical', 'viva', 'internal', 'backpaper'], 
      required: true 
    },
    subject: { type: String, required: true },
    courseCode: { type: String, required: true, uppercase: true },
    department: { type: String, required: true },
    semester: { type: Number, required: true },
    date: { type: String, required: true },
    startTime: { type: String, required: true },
    durationMinutes: { type: Number, default: 180 },
    building: { type: String, default: 'Aryabhatta Science Block' },
    room: { type: String, required: true },
    totalCapacity: { type: Number, default: 60 },
    status: { 
      type: String, 
      enum: ['draft', 'review', 'principal_approved', 'published', 'locked'], 
      default: 'draft' 
    },
    approvalNotes: { type: String, default: '' },
    seatingPlan: [
      {
        seatNumber: { type: String, required: true },
        rollNumber: { type: String, required: true },
        studentName: { type: String, required: true },
        department: { type: String, required: true },
        room: { type: String, required: true }
      }
    ],
    invigilators: [
      {
        teacherName: { type: String, required: true },
        department: { type: String, required: true },
        dutyConfirmed: { type: Boolean, default: false }
      }
    ]
  },
  { timestamps: true }
);

// ─── 4. FACULTY EXAM DUTY ───
export interface IFacultyDuty extends Document {
  institutionId?: mongoose.Types.ObjectId | string;
  examId?: string;
  examTitle: string;
  subject: string;
  teacherName: string;
  teacherEmail: string;
  department: string;
  date: string;
  timeSlot: string;
  room: string;
  status: 'assigned' | 'notified' | 'confirmed' | 'swapped';
}

const FacultyDutySchema = new Schema<IFacultyDuty>(
  {
    institutionId: { type: Schema.Types.ObjectId, ref: 'Institution', index: true },
    examId: { type: String },
    examTitle: { type: String, required: true },
    subject: { type: String, required: true },
    teacherName: { type: String, required: true },
    teacherEmail: { type: String, required: true },
    department: { type: String, required: true },
    date: { type: String, required: true },
    timeSlot: { type: String, required: true },
    room: { type: String, required: true },
    status: { 
      type: String, 
      enum: ['assigned', 'notified', 'confirmed', 'swapped'], 
      default: 'assigned' 
    }
  },
  { timestamps: true }
);

// ─── 5. HALL TICKET ───
export interface IHallTicket extends Document {
  institutionId?: mongoose.Types.ObjectId | string;
  ticketNumber: string;
  studentId: string;
  studentName: string;
  rollNumber: string;
  department: string;
  semester: number;
  photo?: string;
  examSession: string;
  attendancePercent: number;
  feesCleared: boolean;
  registrationDone: boolean;
  isEligible: boolean;
  ineligibilityReason?: string;
  seatNumber: string;
  examCenter: string;
  subjects: Array<{
    subject: string;
    code: string;
    date: string;
    time: string;
    room: string;
  }>;
  isPublished: boolean;
  publishedAt?: Date;
  verificationHash: string;
}

const HallTicketSchema = new Schema<IHallTicket>(
  {
    institutionId: { type: Schema.Types.ObjectId, ref: 'Institution', index: true },
    ticketNumber: { type: String, required: true, unique: true },
    studentId: { type: String, required: true },
    studentName: { type: String, required: true },
    rollNumber: { type: String, required: true },
    department: { type: String, required: true },
    semester: { type: Number, required: true },
    photo: { type: String },
    examSession: { type: String, default: 'May - June 2026 Regular End-Term' },
    attendancePercent: { type: Number, required: true },
    feesCleared: { type: Boolean, default: true },
    registrationDone: { type: Boolean, default: true },
    isEligible: { type: Boolean, default: true },
    ineligibilityReason: { type: String, default: '' },
    seatNumber: { type: String, default: 'LH-101/A-1' },
    examCenter: { type: String, default: 'EduVerse Central Examination Complex' },
    subjects: [
      {
        subject: { type: String, required: true },
        code: { type: String, required: true },
        date: { type: String, required: true },
        time: { type: String, required: true },
        room: { type: String, required: true }
      }
    ],
    isPublished: { type: Boolean, default: true },
    publishedAt: { type: Date, default: Date.now },
    verificationHash: { type: String, required: true }
  },
  { timestamps: true }
);

// ─── 6. EXAM RESULTS & MODERATION ───
export interface IExamResult extends Document {
  institutionId?: mongoose.Types.ObjectId | string;
  examTitle: string;
  semester: number;
  department: string;
  subject: string;
  studentName: string;
  rollNumber: string;
  marksObtained: number;
  maxMarks: number;
  graceMarks: number;
  grade: string;
  sgpa: number;
  cgpa: number;
  rank: number;
  status: 'draft' | 'moderated' | 'published' | 'locked';
  publishedAt?: Date;
}

const ExamResultSchema = new Schema<IExamResult>(
  {
    institutionId: { type: Schema.Types.ObjectId, ref: 'Institution', index: true },
    examTitle: { type: String, required: true },
    semester: { type: Number, required: true },
    department: { type: String, required: true },
    subject: { type: String, required: true },
    studentName: { type: String, required: true },
    rollNumber: { type: String, required: true },
    marksObtained: { type: Number, required: true },
    maxMarks: { type: Number, default: 100 },
    graceMarks: { type: Number, default: 0 },
    grade: { type: String, default: 'A' },
    sgpa: { type: Number, default: 8.5 },
    cgpa: { type: Number, default: 8.6 },
    rank: { type: Number, default: 1 },
    status: { 
      type: String, 
      enum: ['draft', 'moderated', 'published', 'locked'], 
      default: 'draft' 
    },
    publishedAt: { type: Date }
  },
  { timestamps: true }
);

// ─── 7. CLASSROOM INVENTORY ───
export interface IClassroom extends Document {
  institutionId?: mongoose.Types.ObjectId | string;
  roomNumber: string;
  building: string;
  capacity: number;
  hasProjector: boolean;
  isLab: boolean;
  labEquipment: string[];
  utilizationScore: number;
  currentStatus: 'Available' | 'Occupied' | 'Maintenance';
}

const ClassroomSchema = new Schema<IClassroom>(
  {
    institutionId: { type: Schema.Types.ObjectId, ref: 'Institution', index: true },
    roomNumber: { type: String, required: true },
    building: { type: String, required: true },
    capacity: { type: Number, required: true },
    hasProjector: { type: Boolean, default: true },
    isLab: { type: Boolean, default: false },
    labEquipment: { type: [String], default: [] },
    utilizationScore: { type: Number, default: 75 },
    currentStatus: { 
      type: String, 
      enum: ['Available', 'Occupied', 'Maintenance'], 
      default: 'Available' 
    }
  },
  { timestamps: true }
);

// ─── 8. GRADE MODERATION LOG ───
export interface IGradeModerationLog extends Document {
  institutionId?: mongoose.Types.ObjectId | string;
  subject: string;
  section: string;
  prevAverage: number;
  newAverage: number;
  adjustmentPoints: number;
  reason: string;
  outliersIdentified: number;
  aiRecommendation: string;
  moderatedBy: string;
}

const GradeModerationLogSchema = new Schema<IGradeModerationLog>(
  {
    institutionId: { type: Schema.Types.ObjectId, ref: 'Institution', index: true },
    subject: { type: String, required: true },
    section: { type: String, required: true },
    prevAverage: { type: Number, required: true },
    newAverage: { type: Number, required: true },
    adjustmentPoints: { type: Number, default: 0 },
    reason: { type: String, required: true },
    outliersIdentified: { type: Number, default: 0 },
    aiRecommendation: { type: String, default: '' },
    moderatedBy: { type: String, default: 'Academic Controller' }
  },
  { timestamps: true }
);

export const AcademicCalendar = mongoose.model<IAcademicCalendar>('AcademicCalendar', AcademicCalendarSchema);
export const TimetableSlot = mongoose.model<ITimetableSlot>('TimetableSlot', TimetableSlotSchema);
export const ExamSchedule = mongoose.model<IExamSchedule>('ExamSchedule', ExamScheduleSchema);
export const FacultyDuty = mongoose.model<IFacultyDuty>('FacultyDuty', FacultyDutySchema);
export const HallTicket = mongoose.model<IHallTicket>('HallTicket', HallTicketSchema);
export const ExamResult = mongoose.model<IExamResult>('ExamResult', ExamResultSchema);
export const Classroom = mongoose.model<IClassroom>('Classroom', ClassroomSchema);
export const GradeModerationLog = mongoose.model<IGradeModerationLog>('GradeModerationLog', GradeModerationLogSchema);

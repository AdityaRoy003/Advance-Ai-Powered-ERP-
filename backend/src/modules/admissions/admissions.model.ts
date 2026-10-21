import mongoose, { Schema, type Document } from 'mongoose';

export interface IApplication extends Document {
  applicationNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  program: string;
  department: string;
  stage: 'lead' | 'applied' | 'verification' | 'interview' | 'merit_list' | 'fee_deposit' | 'enrolled' | 'rejected';
  entranceScore?: number;
  highSchoolGPA?: number;
  documentStatus: 'pending' | 'verified' | 'rejected';
  documents: Array<{ name: string; url: string; verified: boolean }>;
  feeStatus: 'unpaid' | 'paid' | 'waived';
  applicationFee: number;
  scholarshipGranted?: string;
  assignedCounselor?: string;
  notes?: string[];
  institutionId?: mongoose.Types.ObjectId | string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const applicationSchema = new Schema<IApplication>(
  {
    applicationNumber: { type: String, required: true, unique: true, uppercase: true, trim: true },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true },
    program: { type: String, required: true },
    department: { type: String, required: true },
    stage: {
      type: String,
      enum: ['lead', 'applied', 'verification', 'interview', 'merit_list', 'fee_deposit', 'enrolled', 'rejected'],
      default: 'applied'
    },
    entranceScore: { type: Number, default: 85 },
    highSchoolGPA: { type: Number, default: 3.8 },
    documentStatus: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'pending' },
    documents: [
      {
        name: { type: String },
        url: { type: String },
        verified: { type: Boolean, default: false }
      }
    ],
    feeStatus: { type: String, enum: ['unpaid', 'paid', 'waived'], default: 'paid' },
    applicationFee: { type: Number, default: 1500 },
    scholarshipGranted: { type: String, default: null },
    assignedCounselor: { type: String, default: 'Dr. Sarah Connor' },
    notes: { type: [String], default: [] },
    institutionId: { type: Schema.Types.ObjectId, ref: 'Institution', index: true },
    isDeleted: { type: Boolean, default: false }
  },
  { timestamps: true }
);

applicationSchema.index({ stage: 1, institutionId: 1 });
applicationSchema.index({ email: 1 });

export default mongoose.model<IApplication>('Application', applicationSchema);

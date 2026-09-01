import mongoose, { Schema, type Document } from 'mongoose';

export interface IInstitution extends Document {
  name: string;
  code: string;
  type: 'university' | 'college' | 'school' | 'polytechnic' | 'institute';
  logo?: string;
  address?: string;
  city?: string;
  state?: string;
  country: string;
  phone?: string;
  email?: string;
  website?: string;
  adminEmail?: string;
  plan: 'free' | 'basic' | 'premium' | 'enterprise' | 'trial';
  status: 'active' | 'suspended' | 'trial' | 'inactive';
  settings: {
    enableHostel: boolean;
    enableTransport: boolean;
    enablePlacement: boolean;
    enableLibrary: boolean;
    enableFinance: boolean;
    enableExams: boolean;
    enableAI: boolean;
  };
  maxUsers: number;
  createdBy?: mongoose.Types.ObjectId;
  isDeleted: boolean;
  deletedAt?: Date;
}

const institutionSchema = new Schema<IInstitution>(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    type: {
      type: String,
      enum: ['university', 'college', 'school', 'polytechnic', 'institute'],
      default: 'college'
    },
    logo: { type: String },
    address: { type: String },
    city: { type: String },
    state: { type: String },
    country: { type: String, default: 'India' },
    phone: { type: String },
    email: { type: String, lowercase: true, trim: true },
    website: { type: String },
    adminEmail: { type: String, lowercase: true, trim: true },
    plan: {
      type: String,
      enum: ['free', 'basic', 'premium', 'enterprise'],
      default: 'trial'
    },
    status: {
      type: String,
      enum: ['active', 'suspended', 'trial', 'inactive'],
      default: 'trial'
    },
    settings: {
      enableHostel:    { type: Boolean, default: true },
      enableTransport: { type: Boolean, default: true },
      enablePlacement: { type: Boolean, default: true },
      enableLibrary:   { type: Boolean, default: true },
      enableFinance:   { type: Boolean, default: true },
      enableExams:     { type: Boolean, default: true },
      enableAI:        { type: Boolean, default: true }
    },
    maxUsers: { type: Number, default: 500 },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date }
  },
  { timestamps: true }
);

institutionSchema.index({ status: 1 });
institutionSchema.index({ code: 1 });
institutionSchema.index({ isDeleted: 1 });

export default mongoose.model<IInstitution>('Institution', institutionSchema);

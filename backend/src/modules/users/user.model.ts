import mongoose, { Schema, type Document } from 'mongoose';

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  passwordHash: string;
  avatar?: string;
  coverImage?: string;
  bio?: string;
  address?: string;
  emergencyContact?: string;
  socialLinks?: {
    website?: string;
    linkedin?: string;
    github?: string;
    researchgate?: string;
    portfolio?: string;
  };
  skills?: string[];
  certifications?: string[];
  role: string;
  permissions: string[];
  status: string;
  department?: string;
  instituteId?: string;
  institutionId?: mongoose.Types.ObjectId | string;
  lastLogin?: Date;
  emailVerified: boolean;
  twoFactorEnabled: boolean;
  refreshTokens: string[];
  otpSecret?: string;
  otpExpires?: Date;
  loginAttempts: number;
  lockUntil?: Date;
  isDeleted: boolean;
  deletedAt?: Date;
}

const userSchema = new Schema<IUser>(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    passwordHash: { type: String, required: true },
    avatar: { type: String },
    coverImage: { type: String },
    bio: { type: String },
    address: { type: String },
    emergencyContact: { type: String },
    socialLinks: {
      website: { type: String },
      linkedin: { type: String },
      github: { type: String },
      researchgate: { type: String },
      portfolio: { type: String }
    },
    skills: { type: [String], default: [] },
    certifications: { type: [String], default: [] },
    role: { type: String, default: 'STUDENT' },
    permissions: { type: [String], default: [] },
    status: { type: String, default: 'active' },
    department: { type: String },
    instituteId: { type: String },
    institutionId: { type: Schema.Types.ObjectId, ref: 'Institution', index: true },
    lastLogin: { type: Date },
    emailVerified: { type: Boolean, default: false },
    twoFactorEnabled: { type: Boolean, default: false },
    refreshTokens: { type: [String], default: [] },
    otpSecret: { type: String },
    otpExpires: { type: Date },
    loginAttempts: { type: Number, default: 0 },
    lockUntil: { type: Date },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date }
  },
  { timestamps: true }
);

userSchema.index({ role: 1, status: 1 });
userSchema.index({ department: 1 });
userSchema.index({ isDeleted: 1 });

export default mongoose.model<IUser>('User', userSchema);

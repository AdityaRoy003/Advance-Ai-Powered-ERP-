import mongoose, { Schema, type Document } from 'mongoose';

export interface IPlacementDrive extends Document {
  companyName: string;
  role: string;
  packageOffered: string;
  eligibilityCGPA: number;
  driveDate: Date;
  location: string;
  description?: string;
  requirements?: string[];
  status: 'upcoming' | 'ongoing' | 'completed';
  applicantsCount: number;
  institutionId?: mongoose.Types.ObjectId | string;
}

const placementSchema = new Schema<IPlacementDrive>(
  {
    companyName: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    packageOffered: { type: String, required: true },
    eligibilityCGPA: { type: Number, default: 6.0 },
    driveDate: { type: Date, required: true },
    location: { type: String, default: 'On Campus' },
    description: { type: String },
    requirements: { type: [String], default: [] },
    status: { type: String, enum: ['upcoming', 'ongoing', 'completed'], default: 'upcoming' },
    applicantsCount: { type: Number, default: 0 },
    institutionId: { type: Schema.Types.ObjectId, ref: 'Institution', index: true }
  },
  { timestamps: true }
);

export default mongoose.model<IPlacementDrive>('PlacementDrive', placementSchema);

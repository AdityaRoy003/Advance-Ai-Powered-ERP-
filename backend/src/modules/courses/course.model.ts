import mongoose, { Schema, type Document } from 'mongoose';

export interface ICourse extends Document {
  code: string;
  title: string;
  department: string;
  credits: number;
  semester: number;
  description?: string;
  syllabus?: string[];
  status: 'active' | 'inactive';
  institutionId?: mongoose.Types.ObjectId | string;
}

const courseSchema = new Schema<ICourse>(
  {
    code: { type: String, required: true, uppercase: true, trim: true },
    title: { type: String, required: true, trim: true },
    department: { type: String, required: true },
    credits: { type: Number, required: true, default: 3 },
    semester: { type: Number, required: true, default: 1 },
    description: { type: String },
    syllabus: { type: [String], default: [] },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    institutionId: { type: Schema.Types.ObjectId, ref: 'Institution', index: true }
  },
  { timestamps: true }
);

courseSchema.index({ code: 1, department: 1 });

export default mongoose.model<ICourse>('Course', courseSchema);

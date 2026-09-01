import mongoose, { Schema, type Document } from 'mongoose';

export interface IDepartment extends Document {
  code: string;
  name: string;
  headOfDepartment: string;
  annualBudget: string;
  totalFaculty: number;
  totalStudents: number;
  status: 'active' | 'inactive';
  institutionId?: mongoose.Types.ObjectId | string;
}

const departmentSchema = new Schema<IDepartment>(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    headOfDepartment: { type: String, required: true },
    annualBudget: { type: String, default: '₹50,00,000' },
    totalFaculty: { type: Number, default: 0 },
    totalStudents: { type: Number, default: 0 },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    institutionId: { type: Schema.Types.ObjectId, ref: 'Institution', index: true }
  },
  { timestamps: true }
);

export default mongoose.model<IDepartment>('Department', departmentSchema);

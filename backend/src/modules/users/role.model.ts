import mongoose, { Schema, Document } from 'mongoose';

export interface IRole extends Document {
  name: string;
  department: string;
  accessLevel: 'Full Access' | 'Manager Access' | 'Standard Access';
  permissions: string[];
  status: 'active' | 'suspended';
}

const roleSchema = new Schema<IRole>(
  {
    name: { type: String, required: true, unique: true },
    department: { type: String, required: true },
    accessLevel: { type: String, enum: ['Full Access', 'Manager Access', 'Standard Access'], required: true },
    permissions: { type: [String], default: [] },
    status: { type: String, enum: ['active', 'suspended'], default: 'active' }
  },
  { timestamps: true }
);

export default mongoose.model<IRole>('Role', roleSchema);

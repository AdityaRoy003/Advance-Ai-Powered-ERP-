import mongoose, { Schema, Document } from 'mongoose';

export interface IStudent extends Document {
  userId: mongoose.Types.ObjectId;
  rollNumber: string;
  className: string;
  department: string;
  gpa: number;
  attendancePercentage: number;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  feesPaid: number;
  feesDue: number;
  transportRoute: string;
  hostelRoom: string;
  courses: string[];
}

const studentSchema = new Schema<IStudent>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    rollNumber: { type: String, required: true, unique: true },
    className: { type: String, required: true },
    department: { type: String, required: true },
    gpa: { type: Number, default: 4.0 },
    attendancePercentage: { type: Number, default: 100 },
    parentName: { type: String, required: true },
    parentEmail: { type: String, required: true },
    parentPhone: { type: String, required: true },
    feesPaid: { type: Number, default: 0 },
    feesDue: { type: Number, default: 0 },
    transportRoute: { type: String, default: 'None' },
    hostelRoom: { type: String, default: 'None' },
    courses: { type: [String], default: [] }
  },
  { timestamps: true }
);

export default mongoose.model<IStudent>('Student', studentSchema);

import mongoose, { Schema, Document } from 'mongoose';

export interface ITeacher extends Document {
  userId: mongoose.Types.ObjectId;
  employeeId: string;
  department: string;
  designation: string;
  salary: number;
  subjects: string[];
  timetable: Array<{
    day: string;
    subject: string;
    className: string;
    timeSlot: string;
  }>;
}

const teacherSchema = new Schema<ITeacher>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    employeeId: { type: String, required: true, unique: true },
    department: { type: String, required: true },
    designation: { type: String, required: true },
    salary: { type: Number, required: true },
    subjects: { type: [String], default: [] },
    timetable: [
      {
        day: { type: String, required: true },
        subject: { type: String, required: true },
        className: { type: String, required: true },
        timeSlot: { type: String, required: true }
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model<ITeacher>('Teacher', teacherSchema);

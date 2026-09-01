import mongoose, { Schema, Document } from 'mongoose';

export interface IAttendance extends Document {
  studentId: mongoose.Types.ObjectId;
  date: Date;
  status: 'present' | 'absent' | 'late';
  className: string;
  subject: string;
  markedBy: mongoose.Types.ObjectId;
  institutionId?: mongoose.Types.ObjectId | string;
}

const attendanceSchema = new Schema<IAttendance>(
  {
    studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
    date: { type: Date, required: true },
    status: { type: String, enum: ['present', 'absent', 'late'], required: true },
    className: { type: String, required: true },
    subject: { type: String, required: true },
    markedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    institutionId: { type: Schema.Types.ObjectId, ref: 'Institution', index: true }
  },
  { timestamps: true }
);

export default mongoose.model<IAttendance>('Attendance', attendanceSchema);

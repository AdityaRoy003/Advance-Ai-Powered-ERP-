import mongoose, { Schema, Document } from 'mongoose';

export interface IExam extends Document {
  title: string;
  type: 'midterm' | 'final' | 'quiz' | 'assignment';
  className: string;
  subject: string;
  date: Date;
  maxMarks: number;
  results: Array<{
    studentId: mongoose.Types.ObjectId;
    marksObtained: number;
    grade: string;
    remarks: string;
  }>;
  institutionId?: mongoose.Types.ObjectId | string;
}

const examSchema = new Schema<IExam>(
  {
    title: { type: String, required: true },
    type: { type: String, enum: ['midterm', 'final', 'quiz', 'assignment'], required: true },
    className: { type: String, required: true },
    subject: { type: String, required: true },
    date: { type: Date, required: true },
    maxMarks: { type: Number, default: 100 },
    results: [
      {
        studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
        marksObtained: { type: Number, required: true },
        grade: { type: String, default: 'F' },
        remarks: { type: String, default: '' }
      }
    ],
    institutionId: { type: Schema.Types.ObjectId, ref: 'Institution', index: true }
  },
  { timestamps: true }
);

export default mongoose.model<IExam>('Exam', examSchema);

import mongoose, { Schema, type Document } from 'mongoose';

export interface ITimetable extends Document {
  courseId?: string;
  courseCode: string;
  subjectTitle: string;
  teacherName: string;
  room: string;
  dayOfWeek: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  startTime: string;
  endTime: string;
  department: string;
  semester: number;
  batch?: string;
  institutionId?: mongoose.Types.ObjectId | string;
}

const timetableSchema = new Schema<ITimetable>(
  {
    courseId: { type: String },
    courseCode: { type: String, required: true, uppercase: true, trim: true },
    subjectTitle: { type: String, required: true, trim: true },
    teacherName: { type: String, required: true, trim: true },
    room: { type: String, required: true, trim: true },
    dayOfWeek: { 
      type: String, 
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], 
      required: true 
    },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    department: { type: String, required: true, default: 'Computer Science' },
    semester: { type: Number, required: true, default: 1 },
    batch: { type: String },
    institutionId: { type: Schema.Types.ObjectId, ref: 'Institution', index: true }
  },
  { timestamps: true }
);

timetableSchema.index({ dayOfWeek: 1, room: 1, startTime: 1 });
timetableSchema.index({ teacherName: 1, dayOfWeek: 1 });

export default mongoose.model<ITimetable>('Timetable', timetableSchema);

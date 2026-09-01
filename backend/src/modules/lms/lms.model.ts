import mongoose, { Schema, Document } from 'mongoose';

export interface ILesson {
  _id?: string;
  title: string;
  duration: string;
  videoUrl?: string;
  content: string;
  resources?: string[];
  isCompleted?: boolean;
}

export interface IModule {
  _id?: string;
  title: string;
  order: number;
  lessons: ILesson[];
  quiz?: {
    title: string;
    questions: Array<{
      question: string;
      options: string[];
      correctAnswer: number;
      explanation: string;
    }>;
  };
}

export interface ILMSCourse extends Document {
  courseCode: string;
  title: string;
  description: string;
  instructorName: string;
  instructorId?: mongoose.Types.ObjectId;
  department: string;
  thumbnail?: string;
  enrolledStudents: Array<{
    studentId: mongoose.Types.ObjectId;
    enrolledAt: Date;
    completedLessons: string[];
    quizScores: Array<{ moduleIndex: number; score: number; passed: boolean }>;
    certificateIssued: boolean;
    certificateHash?: string;
  }>;
  modules: IModule[];
  adaptivePath?: {
    prerequisites: string[];
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    recommendedNext: string[];
  };
  institutionId?: mongoose.Types.ObjectId | string;
}

const lmsCourseSchema = new Schema<ILMSCourse>(
  {
    courseCode: { type: String, required: true, uppercase: true, trim: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    instructorName: { type: String, required: true },
    instructorId: { type: Schema.Types.ObjectId, ref: 'User' },
    department: { type: String, required: true },
    thumbnail: { type: String, default: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60' },
    enrolledStudents: [
      {
        studentId: { type: Schema.Types.ObjectId, ref: 'User' },
        enrolledAt: { type: Date, default: Date.now },
        completedLessons: { type: [String], default: [] },
        quizScores: [
          {
            moduleIndex: { type: Number },
            score: { type: Number },
            passed: { type: Boolean }
          }
        ],
        certificateIssued: { type: Boolean, default: false },
        certificateHash: { type: String }
      }
    ],
    modules: [
      {
        title: { type: String, required: true },
        order: { type: Number, default: 1 },
        lessons: [
          {
            title: { type: String, required: true },
            duration: { type: String, default: '15 mins' },
            videoUrl: { type: String, default: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
            content: { type: String, required: true },
            resources: { type: [String], default: [] }
          }
        ],
        quiz: {
          title: { type: String },
          questions: [
            {
              question: { type: String },
              options: [{ type: String }],
              correctAnswer: { type: Number },
              explanation: { type: String }
            }
          ]
        }
      }
    ],
    adaptivePath: {
      prerequisites: { type: [String], default: [] },
      difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'intermediate' },
      recommendedNext: { type: [String], default: [] }
    },
    institutionId: { type: Schema.Types.ObjectId, ref: 'Institution', index: true }
  },
  { timestamps: true }
);

export default mongoose.model<ILMSCourse>('LMSCourse', lmsCourseSchema);

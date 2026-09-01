import mongoose, { Schema, Document } from 'mongoose';

export interface ILibrary extends Document {
  title: string;
  author: string;
  isbn: string;
  copies: number;
  available: number;
  location: string;
  issues: Array<{
    _id?: mongoose.Types.ObjectId;
    studentId: mongoose.Types.ObjectId;
    issueDate: Date;
    dueDate: Date;
    returnDate?: Date;
    status: 'issued' | 'returned' | 'overdue';
    fineAmount: number;
  }>;
  institutionId?: mongoose.Types.ObjectId | string;
}

const librarySchema = new Schema<ILibrary>(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    isbn: { type: String, required: true },
    copies: { type: Number, required: true },
    available: { type: Number, required: true },
    location: { type: String, default: 'General Shelf' },
    issues: [
      {
        studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
        issueDate: { type: Date, default: Date.now },
        dueDate: { type: Date, required: true },
        returnDate: { type: Date },
        status: { type: String, enum: ['issued', 'returned', 'overdue'], default: 'issued' },
        fineAmount: { type: Number, default: 0 }
      }
    ],
    institutionId: { type: Schema.Types.ObjectId, ref: 'Institution', index: true }
  },
  { timestamps: true }
);

export default mongoose.model<ILibrary>('Library', librarySchema);

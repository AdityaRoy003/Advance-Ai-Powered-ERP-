import mongoose, { Schema, Document } from 'mongoose';

export interface IFinance extends Document {
  studentId?: mongoose.Types.ObjectId;
  studentName?: string;
  title: string;
  amountDue: number;
  amountPaid: number;
  status: 'paid' | 'partial' | 'unpaid';
  dueDate: Date;
  payments: Array<{
    amount: number;
    paymentDate: Date;
    transactionId: string;
    paymentMethod: string;
  }>;
  institutionId?: mongoose.Types.ObjectId | string;
}

const financeSchema = new Schema<IFinance>(
  {
    studentId: { type: Schema.Types.ObjectId, ref: 'Student' },
    studentName: { type: String, default: 'Aditya Roy' },
    title: { type: String, required: true },
    amountDue: { type: Number, required: true },
    amountPaid: { type: Number, default: 0 },
    status: { type: String, enum: ['paid', 'partial', 'unpaid'], default: 'unpaid' },
    dueDate: { type: Date, required: true },
    payments: [
      {
        amount: { type: Number, required: true },
        paymentDate: { type: Date, default: Date.now },
        transactionId: { type: String, required: true },
        paymentMethod: { type: String, required: true }
      }
    ],
    institutionId: { type: Schema.Types.ObjectId, ref: 'Institution', index: true }
  },
  { timestamps: true }
);

export default mongoose.model<IFinance>('Finance', financeSchema);

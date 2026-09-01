import mongoose, { Schema, Document } from 'mongoose';

export interface IHostelRoom extends Document {
  roomNumber: string;
  block: string;
  capacity: number;
  occupied: number;
  monthlyFee: number;
  status: 'available' | 'full' | 'maintenance';
  occupants: string[];
  institutionId?: mongoose.Types.ObjectId | string;
}

const hostelSchema = new Schema<IHostelRoom>(
  {
    roomNumber: { type: String, required: true },
    block: { type: String, required: true },
    capacity: { type: Number, required: true, default: 2 },
    occupied: { type: Number, default: 0 },
    monthlyFee: { type: Number, required: true },
    status: { type: String, enum: ['available', 'full', 'maintenance'], default: 'available' },
    occupants: [{ type: String }],
    institutionId: { type: Schema.Types.ObjectId, ref: 'Institution', index: true }
  },
  { timestamps: true }
);

hostelSchema.index({ roomNumber: 1, block: 1 });

export default mongoose.model<IHostelRoom>('HostelRoom', hostelSchema);

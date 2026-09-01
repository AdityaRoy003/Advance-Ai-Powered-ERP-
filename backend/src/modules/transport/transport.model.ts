import mongoose, { Schema, Document } from 'mongoose';

export interface ITransportRoute extends Document {
  routeName: string;
  vehicleNumber: string;
  driverName: string;
  driverPhone: string;
  capacity: number;
  assignedCount: number;
  feePerTerm: number;
  stops: string[];
  institutionId?: mongoose.Types.ObjectId | string;
}

const transportSchema = new Schema<ITransportRoute>(
  {
    routeName: { type: String, required: true },
    vehicleNumber: { type: String, required: true },
    driverName: { type: String, required: true },
    driverPhone: { type: String, required: true },
    capacity: { type: Number, required: true, default: 40 },
    assignedCount: { type: Number, default: 0 },
    feePerTerm: { type: Number, required: true },
    stops: [{ type: String }],
    institutionId: { type: Schema.Types.ObjectId, ref: 'Institution', index: true }
  },
  { timestamps: true }
);

transportSchema.index({ vehicleNumber: 1, routeName: 1 });

export default mongoose.model<ITransportRoute>('TransportRoute', transportSchema);

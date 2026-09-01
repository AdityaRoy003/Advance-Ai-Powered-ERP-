import mongoose, { Schema, Document } from 'mongoose';

// ─── 1. Smart Campus IoT Sensor Model ──────────────────────────────────────
export interface IIoTSensor extends Document {
  sensorId: string;
  name: string;
  type: 'Temperature' | 'Electricity' | 'Water Flow' | 'Air Quality (AQI)' | 'Occupancy' | 'Fire & Smoke' | 'Solar Generation';
  building: string;
  floor: string;
  room?: string;
  currentValue: number;
  unit: string;
  status: 'Online' | 'Offline' | 'Alert';
  minSafeValue: number;
  maxSafeValue: number;
  lastHeartbeat: Date;
  institutionId?: mongoose.Types.ObjectId;
}

const IoTSensorSchema = new Schema<IIoTSensor>({
  sensorId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['Temperature', 'Electricity', 'Water Flow', 'Air Quality (AQI)', 'Occupancy', 'Fire & Smoke', 'Solar Generation'], 
    required: true 
  },
  building: { type: String, required: true },
  floor: { type: String, required: true },
  room: { type: String },
  currentValue: { type: Number, required: true, default: 0 },
  unit: { type: String, required: true },
  status: { type: String, enum: ['Online', 'Offline', 'Alert'], default: 'Online' },
  minSafeValue: { type: Number, default: 0 },
  maxSafeValue: { type: Number, default: 100 },
  lastHeartbeat: { type: Date, default: Date.now },
  institutionId: { type: Schema.Types.ObjectId, ref: 'Institution' }
}, { timestamps: true });

// ─── 2. Time-Series Telemetry Data Points ──────────────────────────────────
export interface ITelemetryLog extends Document {
  sensorId: string;
  sensorType: string;
  timestamp: Date;
  value: number;
  unit: string;
  metadata?: Record<string, any>;
  institutionId?: mongoose.Types.ObjectId;
}

const TelemetryLogSchema = new Schema<ITelemetryLog>({
  sensorId: { type: String, required: true },
  sensorType: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  value: { type: Number, required: true },
  unit: { type: String, required: true },
  metadata: { type: Schema.Types.Mixed },
  institutionId: { type: Schema.Types.ObjectId, ref: 'Institution' }
}, { timestamps: true });

// ─── 3. Sustainability & Carbon Metrics ────────────────────────────────────
export interface ISustainabilitySnapshot extends Document {
  monthYear: string; // e.g. 'Aug 2026'
  totalElectricityKwh: number;
  solarGeneratedKwh: number;
  solarContributionPct: number;
  totalWaterKiloLiters: number;
  recycledWaterPct: number;
  wasteDivertedKg: number;
  co2EmissionsTonnes: number;
  co2ReductionPctFromLastMonth: number;
  energyReductionPct: number;
  waterReductionPct: number;
  paperSavedSheets: number;
  greenCampusScore: number; // e.g. 92.4 out of 100
  aiForecast: {
    nextMonthElectricityKwh: number;
    nextMonthWaterKiloLiters: number;
    estimatedSolarGenerationKwh: number;
    recommendedActions: string[];
  };
  institutionId?: mongoose.Types.ObjectId;
}

const SustainabilitySnapshotSchema = new Schema<ISustainabilitySnapshot>({
  monthYear: { type: String, required: true },
  totalElectricityKwh: { type: Number, required: true },
  solarGeneratedKwh: { type: Number, required: true },
  solarContributionPct: { type: Number, required: true },
  totalWaterKiloLiters: { type: Number, required: true },
  recycledWaterPct: { type: Number, required: true },
  wasteDivertedKg: { type: Number, required: true },
  co2EmissionsTonnes: { type: Number, required: true },
  co2ReductionPctFromLastMonth: { type: Number, required: true },
  energyReductionPct: { type: Number, required: true },
  waterReductionPct: { type: Number, required: true },
  paperSavedSheets: { type: Number, required: true },
  greenCampusScore: { type: Number, required: true },
  aiForecast: {
    nextMonthElectricityKwh: { type: Number, default: 0 },
    nextMonthWaterKiloLiters: { type: Number, default: 0 },
    estimatedSolarGenerationKwh: { type: Number, default: 0 },
    recommendedActions: [{ type: String }]
  },
  institutionId: { type: Schema.Types.ObjectId, ref: 'Institution' }
}, { timestamps: true });

export const IoTSensor = mongoose.model<IIoTSensor>('IoTSensor', IoTSensorSchema);
export const TelemetryLog = mongoose.model<ITelemetryLog>('TelemetryLog', TelemetryLogSchema);
export const SustainabilitySnapshot = mongoose.model<ISustainabilitySnapshot>('SustainabilitySnapshot', SustainabilitySnapshotSchema);

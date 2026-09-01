import mongoose, { Schema, Document } from 'mongoose';

export interface ICampusFacility extends Document {
  buildingName: string;
  category: 'Academic' | 'Hostel' | 'Library' | 'Sports' | 'Lab' | 'Administration' | 'Cafeteria';
  floorsCount: number;
  currentPowerKW: number;
  powerForecastTomorrowKW: number;
  currentWaterLitersPerHour: number;
  internetBandwidthGbps: number;
  occupancyCount: number;
  maxCapacity: number;
  crowdDensityStatus: 'Normal' | 'Moderate' | 'High' | 'Critical Alert';
  busLivePositions: Array<{
    busId: string;
    route: string;
    lat: number;
    lng: number;
    speedKmH: number;
    etaMinutes: number;
  }>;
  cvDetections: Array<{
    timestamp: Date;
    cameraZone: string;
    eventType: 'QR Attendance' | 'Vehicle ANPR' | 'Crowd Spike' | 'Lab PPE Verified' | 'Restricted Area Entry';
    confidence: number;
    plateNumberOrBadge?: string;
  }>;
  healthClinicRecords: Array<{
    patientName: string;
    role: string;
    symptoms: string;
    diagnosis: string;
    prescriptions: string[];
    emergencyContact: string;
    visitDate: Date;
    status: 'Treated' | 'Referred' | 'Under Observation';
  }>;
  institutionId?: mongoose.Types.ObjectId | string;
}

const campusFacilitySchema = new Schema<ICampusFacility>(
  {
    buildingName: { type: String, required: true, trim: true },
    category: { 
      type: String, 
      enum: ['Academic', 'Hostel', 'Library', 'Sports', 'Lab', 'Administration', 'Cafeteria'], 
      default: 'Academic' 
    },
    floorsCount: { type: Number, default: 4 },
    currentPowerKW: { type: Number, default: 142.5 },
    powerForecastTomorrowKW: { type: Number, default: 168.0 },
    currentWaterLitersPerHour: { type: Number, default: 420 },
    internetBandwidthGbps: { type: Number, default: 4.8 },
    occupancyCount: { type: Number, default: 320 },
    maxCapacity: { type: Number, default: 500 },
    crowdDensityStatus: { type: String, enum: ['Normal', 'Moderate', 'High', 'Critical Alert'], default: 'Normal' },
    busLivePositions: [
      {
        busId: { type: String },
        route: { type: String },
        lat: { type: Number },
        lng: { type: Number },
        speedKmH: { type: Number },
        etaMinutes: { type: Number }
      }
    ],
    cvDetections: [
      {
        timestamp: { type: Date, default: Date.now },
        cameraZone: { type: String },
        eventType: { type: String, enum: ['QR Attendance', 'Vehicle ANPR', 'Crowd Spike', 'Lab PPE Verified', 'Restricted Area Entry'] },
        confidence: { type: Number },
        plateNumberOrBadge: { type: String }
      }
    ],
    healthClinicRecords: [
      {
        patientName: { type: String },
        role: { type: String },
        symptoms: { type: String },
        diagnosis: { type: String },
        prescriptions: [{ type: String }],
        emergencyContact: { type: String },
        visitDate: { type: Date, default: Date.now },
        status: { type: String, enum: ['Treated', 'Referred', 'Under Observation'], default: 'Treated' }
      }
    ],
    institutionId: { type: Schema.Types.ObjectId, ref: 'Institution', index: true }
  },
  { timestamps: true }
);

export default mongoose.model<ICampusFacility>('CampusFacility', campusFacilitySchema);

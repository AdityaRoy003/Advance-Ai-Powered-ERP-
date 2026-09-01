import mongoose, { Schema, Document } from 'mongoose';

// ─── 1. Executive Briefing & Institutional Health ──────────────────────────
export interface IExecutiveBriefing extends Document {
  briefingType: 'Daily' | 'Weekly' | 'Monthly';
  periodDate: string;
  executiveSummary: string;
  kpis: {
    totalStudents: number;
    facultyCount: number;
    overallAttendancePct: number;
    feeCollectionRatePct: number;
    placementOffersCount: number;
    activeResearchGrantsInr: number;
    securityIncidentsCount: number;
    institutionalHealthIndex: number; // e.g. 94.6 / 100
  };
  keyHighlights: string[];
  riskAlerts: string[];
  aiGrowthOpportunities: string[];
  institutionId?: mongoose.Types.ObjectId;
}

const ExecutiveBriefingSchema = new Schema<IExecutiveBriefing>({
  briefingType: { type: String, enum: ['Daily', 'Weekly', 'Monthly'], default: 'Daily' },
  periodDate: { type: String, required: true },
  executiveSummary: { type: String, required: true },
  kpis: {
    totalStudents: { type: Number, default: 0 },
    facultyCount: { type: Number, default: 0 },
    overallAttendancePct: { type: Number, default: 0 },
    feeCollectionRatePct: { type: Number, default: 0 },
    placementOffersCount: { type: Number, default: 0 },
    activeResearchGrantsInr: { type: Number, default: 0 },
    securityIncidentsCount: { type: Number, default: 0 },
    institutionalHealthIndex: { type: Number, default: 90 }
  },
  keyHighlights: [{ type: String }],
  riskAlerts: [{ type: String }],
  aiGrowthOpportunities: [{ type: String }],
  institutionId: { type: Schema.Types.ObjectId, ref: 'Institution' }
}, { timestamps: true });

// ─── 2. AI "What Changed?" Delta Log ───────────────────────────────────────
export interface IWhatChangedDelta extends Document {
  deltaDate: string;
  metricDeltas: {
    category: 'Attendance' | 'Finance' | 'Admissions' | 'Security' | 'Placements' | 'Academics';
    metric: string;
    previousValue: string;
    currentValue: string;
    deltaPercentage: number;
    direction: 'UP' | 'DOWN' | 'STABLE';
    sentiment: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
    summaryNote: string;
  }[];
  institutionId?: mongoose.Types.ObjectId;
}

const WhatChangedDeltaSchema = new Schema<IWhatChangedDelta>({
  deltaDate: { type: String, required: true },
  metricDeltas: [{
    category: { type: String, enum: ['Attendance', 'Finance', 'Admissions', 'Security', 'Placements', 'Academics'], required: true },
    metric: { type: String, required: true },
    previousValue: { type: String, required: true },
    currentValue: { type: String, required: true },
    deltaPercentage: { type: Number, required: true },
    direction: { type: String, enum: ['UP', 'DOWN', 'STABLE'], required: true },
    sentiment: { type: String, enum: ['POSITIVE', 'NEGATIVE', 'NEUTRAL'], required: true },
    summaryNote: { type: String, required: true }
  }],
  institutionId: { type: Schema.Types.ObjectId, ref: 'Institution' }
}, { timestamps: true });

// ─── 3. AI Innovation Recommendations ──────────────────────────────────────
export interface IAIInnovationRec extends Document {
  title: string;
  observation: string;
  suggestion: string;
  departmentScope: string;
  impactLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'TRANSFORMATIVE';
  estimatedCostSavingInr?: number;
  status: 'New' | 'Under Review' | 'Approved' | 'Implemented';
  institutionId?: mongoose.Types.ObjectId;
}

const AIInnovationRecSchema = new Schema<IAIInnovationRec>({
  title: { type: String, required: true },
  observation: { type: String, required: true },
  suggestion: { type: String, required: true },
  departmentScope: { type: String, default: 'Institution Wide' },
  impactLevel: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH', 'TRANSFORMATIVE'], default: 'HIGH' },
  estimatedCostSavingInr: { type: Number, default: 0 },
  status: { type: String, enum: ['New', 'Under Review', 'Approved', 'Implemented'], default: 'New' },
  institutionId: { type: Schema.Types.ObjectId, ref: 'Institution' }
}, { timestamps: true });

export const ExecutiveBriefing = mongoose.model<IExecutiveBriefing>('ExecutiveBriefing', ExecutiveBriefingSchema);
export const WhatChangedDelta = mongoose.model<IWhatChangedDelta>('WhatChangedDelta', WhatChangedDeltaSchema);
export const AIInnovationRec = mongoose.model<IAIInnovationRec>('AIInnovationRec', AIInnovationRecSchema);

import mongoose, { Schema, Document } from 'mongoose';

export interface IAccreditation extends Document {
  framework: 'NAAC' | 'NBA' | 'NIRF' | 'AICTE' | 'UGC';
  criteriaList: Array<{
    criterionNumber: number;
    title: string;
    targetScore: number;
    currentScore: number;
    progressPercentage: number;
    evidenceDocuments: Array<{ name: string; url: string; uploadedAt: Date; verified: boolean }>;
    responsibleHOD: string;
    deadline: string;
  }>;
  obeMatrix: {
    courseCode: string;
    courseOutcomes: Array<{ coCode: string; description: string; targetAttainment: number; actualAttainment: number }>;
    programOutcomes: Array<{ poCode: string; description: string; targetAttainment: number; actualAttainment: number }>;
    programSpecificOutcomes: Array<{ psoCode: string; description: string; targetAttainment: number; actualAttainment: number }>;
  };
  overallReadiness: number;
  institutionId?: mongoose.Types.ObjectId | string;
}

const accreditationSchema = new Schema<IAccreditation>(
  {
    framework: { type: String, enum: ['NAAC', 'NBA', 'NIRF', 'AICTE', 'UGC'], default: 'NAAC' },
    criteriaList: [
      {
        criterionNumber: { type: Number, required: true },
        title: { type: String, required: true },
        targetScore: { type: Number, required: true },
        currentScore: { type: Number, default: 0 },
        progressPercentage: { type: Number, default: 0 },
        evidenceDocuments: [
          {
            name: { type: String },
            url: { type: String },
            uploadedAt: { type: Date, default: Date.now },
            verified: { type: Boolean, default: true }
          }
        ],
        responsibleHOD: { type: String, default: 'Dean Academics' },
        deadline: { type: String, default: '31 Dec 2026' }
      }
    ],
    obeMatrix: {
      courseCode: { type: String, default: 'CS-401' },
      courseOutcomes: [
        { coCode: { type: String }, description: { type: String }, targetAttainment: { type: Number }, actualAttainment: { type: Number } }
      ],
      programOutcomes: [
        { poCode: { type: String }, description: { type: String }, targetAttainment: { type: Number }, actualAttainment: { type: Number } }
      ],
      programSpecificOutcomes: [
        { psoCode: { type: String }, description: { type: String }, targetAttainment: { type: Number }, actualAttainment: { type: Number } }
      ]
    },
    overallReadiness: { type: Number, default: 84 },
    institutionId: { type: Schema.Types.ObjectId, ref: 'Institution', index: true }
  },
  { timestamps: true }
);

export default mongoose.model<IAccreditation>('Accreditation', accreditationSchema);

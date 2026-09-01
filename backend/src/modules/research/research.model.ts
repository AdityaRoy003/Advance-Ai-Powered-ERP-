import mongoose, { Schema, Document } from 'mongoose';

export interface IResearchPaper extends Document {
  title: string;
  authors: string[];
  abstract: string;
  journalOrConference: string;
  publicationDate: Date;
  doi?: string;
  citationsCount: number;
  grantFunded?: boolean;
  grantDetails?: {
    grantAgency: string;
    amountSanctioned: string;
    grantId: string;
  };
  patentFiled?: boolean;
  patentNumber?: string;
  status: 'draft' | 'under_review' | 'published' | 'patented';
  institutionId?: mongoose.Types.ObjectId | string;
}

const researchSchema = new Schema<IResearchPaper>(
  {
    title: { type: String, required: true, trim: true },
    authors: { type: [String], required: true },
    abstract: { type: String, required: true },
    journalOrConference: { type: String, required: true },
    publicationDate: { type: Date, default: Date.now },
    doi: { type: String },
    citationsCount: { type: Number, default: 0 },
    grantFunded: { type: Boolean, default: false },
    grantDetails: {
      grantAgency: { type: String },
      amountSanctioned: { type: String },
      grantId: { type: String }
    },
    patentFiled: { type: Boolean, default: false },
    patentNumber: { type: String },
    status: { type: String, enum: ['draft', 'under_review', 'published', 'patented'], default: 'published' },
    institutionId: { type: Schema.Types.ObjectId, ref: 'Institution', index: true }
  },
  { timestamps: true }
);

export default mongoose.model<IResearchPaper>('ResearchPaper', researchSchema);

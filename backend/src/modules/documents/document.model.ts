import mongoose, { Schema, Document } from 'mongoose';

export interface IDigitalDocument extends Document {
  studentId: mongoose.Types.ObjectId;
  studentName: string;
  docType: 'Degree Certificate' | 'Mark Sheet' | 'Bonafide' | 'Transfer Certificate' | 'Fee Receipt' | 'Internship Certificate';
  title: string;
  fileUrl: string;
  issuedDate: Date;
  qrCodeData: string;
  blockchainLedger: {
    txHash: string;
    blockNumber: number;
    merkleRoot: string;
    verifiedOnChain: boolean;
    contractAddress: string;
  };
  status: 'valid' | 'revoked' | 'pending';
  institutionId?: mongoose.Types.ObjectId | string;
}

const documentSchema = new Schema<IDigitalDocument>(
  {
    studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    studentName: { type: String, required: true },
    docType: { 
      type: String, 
      enum: ['Degree Certificate', 'Mark Sheet', 'Bonafide', 'Transfer Certificate', 'Fee Receipt', 'Internship Certificate'], 
      required: true 
    },
    title: { type: String, required: true },
    fileUrl: { type: String, default: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    issuedDate: { type: Date, default: Date.now },
    qrCodeData: { type: String, required: true },
    blockchainLedger: {
      txHash: { type: String, required: true },
      blockNumber: { type: Number, default: 4891024 },
      merkleRoot: { type: String, default: '0x8f14e45fceea167a5a36dedd01013a93ebf30e06' },
      verifiedOnChain: { type: Boolean, default: true },
      contractAddress: { type: String, default: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F' }
    },
    status: { type: String, enum: ['valid', 'revoked', 'pending'], default: 'valid' },
    institutionId: { type: Schema.Types.ObjectId, ref: 'Institution', index: true }
  },
  { timestamps: true }
);

export default mongoose.model<IDigitalDocument>('DigitalDocument', documentSchema);

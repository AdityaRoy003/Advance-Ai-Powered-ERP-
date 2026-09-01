import mongoose, { Schema, Document } from 'mongoose';

export interface IHackathon extends Document {
  title: string;
  theme: string;
  banner?: string;
  startDate: Date;
  endDate: Date;
  prizePool: string;
  registeredTeams: Array<{
    teamName: string;
    leadStudentId: mongoose.Types.ObjectId;
    members: Array<{ studentId: mongoose.Types.ObjectId; name: string; role: string; skills: string[] }>;
    projectTitle?: string;
    repoUrl?: string;
    demoUrl?: string;
    score?: number;
    rank?: number;
  }>;
  mentors: Array<{
    name: string;
    domain: string;
    company: string;
    availableSlots: string[];
  }>;
  status: 'upcoming' | 'live' | 'judging' | 'completed';
  institutionId?: mongoose.Types.ObjectId | string;
}

const hackathonSchema = new Schema<IHackathon>(
  {
    title: { type: String, required: true, trim: true },
    theme: { type: String, required: true },
    banner: { type: String, default: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=60' },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    prizePool: { type: String, default: '₹1,50,000' },
    registeredTeams: [
      {
        teamName: { type: String, required: true },
        leadStudentId: { type: Schema.Types.ObjectId, ref: 'User' },
        members: [
          {
            studentId: { type: Schema.Types.ObjectId, ref: 'User' },
            name: { type: String },
            role: { type: String },
            skills: { type: [String], default: [] }
          }
        ],
        projectTitle: { type: String },
        repoUrl: { type: String },
        demoUrl: { type: String },
        score: { type: Number, default: 0 },
        rank: { type: Number }
      }
    ],
    mentors: [
      {
        name: { type: String },
        domain: { type: String },
        company: { type: String },
        availableSlots: { type: [String], default: [] }
      }
    ],
    status: { type: String, enum: ['upcoming', 'live', 'judging', 'completed'], default: 'live' },
    institutionId: { type: Schema.Types.ObjectId, ref: 'Institution', index: true }
  },
  { timestamps: true }
);

export default mongoose.model<IHackathon>('Hackathon', hackathonSchema);

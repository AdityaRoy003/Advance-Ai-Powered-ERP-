import mongoose, { Schema, Document } from 'mongoose';

// ─── 1. Campus Social Network & Clubs ──────────────────────────────────────
export interface IStudentClub extends Document {
  clubId: string;
  name: string;
  category: 'Coding & AI' | 'Robotics' | 'Sports' | 'Cultural' | 'Entrepreneurship' | 'Research & Innovation';
  description: string;
  leadStudentName: string;
  facultyMentorName: string;
  memberCount: number;
  bannerColor: string;
  upcomingEventTitle?: string;
  institutionId?: mongoose.Types.ObjectId;
}

const StudentClubSchema = new Schema<IStudentClub>({
  clubId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  category: { type: String, enum: ['Coding & AI', 'Robotics', 'Sports', 'Cultural', 'Entrepreneurship', 'Research & Innovation'], required: true },
  description: { type: String, required: true },
  leadStudentName: { type: String, required: true },
  facultyMentorName: { type: String, required: true },
  memberCount: { type: Number, default: 1 },
  bannerColor: { type: String, default: 'from-indigo-600 to-purple-600' },
  upcomingEventTitle: { type: String },
  institutionId: { type: Schema.Types.ObjectId, ref: 'Institution' }
}, { timestamps: true });

export interface ICampusPost extends Document {
  authorId?: mongoose.Types.ObjectId;
  authorName: string;
  authorRole: string;
  clubCategory?: string;
  content: string;
  likesCount: number;
  commentsCount: number;
  isAnnouncement: boolean;
  moderationStatus: 'APPROVED' | 'FLAGGED' | 'REMOVED';
  institutionId?: mongoose.Types.ObjectId;
}

const CampusPostSchema = new Schema<ICampusPost>({
  authorId: { type: Schema.Types.ObjectId, ref: 'User' },
  authorName: { type: String, default: 'Campus Member' },
  authorRole: { type: String, default: 'STUDENT' },
  clubCategory: { type: String, default: 'General' },
  content: { type: String, required: true },
  likesCount: { type: Number, default: 0 },
  commentsCount: { type: Number, default: 0 },
  isAnnouncement: { type: Boolean, default: false },
  moderationStatus: { type: String, enum: ['APPROVED', 'FLAGGED', 'REMOVED'], default: 'APPROVED' },
  institutionId: { type: Schema.Types.ObjectId, ref: 'Institution' }
}, { timestamps: true });

// ─── 2. Gamification, Badges & Leaderboard ─────────────────────────────────
export interface IGamificationProfile extends Document {
  studentId?: mongoose.Types.ObjectId;
  studentName: string;
  department: string;
  totalXp: number;
  level: number;
  rank: number;
  unlockedBadges: {
    badgeId: string;
    name: string;
    icon: string;
    description: string;
    unlockedDate: string;
    rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  }[];
  questsCompleted: number;
  institutionId?: mongoose.Types.ObjectId;
}

const GamificationProfileSchema = new Schema<IGamificationProfile>({
  studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  studentName: { type: String, required: true },
  department: { type: String, default: 'Computer Science' },
  totalXp: { type: Number, default: 1200 },
  level: { type: Number, default: 3 },
  rank: { type: Number, default: 1 },
  unlockedBadges: [{
    badgeId: { type: String, required: true },
    name: { type: String, required: true },
    icon: { type: String, required: true },
    description: { type: String, required: true },
    unlockedDate: { type: String, required: true },
    rarity: { type: String, enum: ['Common', 'Rare', 'Epic', 'Legendary'], default: 'Common' }
  }],
  questsCompleted: { type: Number, default: 8 },
  institutionId: { type: Schema.Types.ObjectId, ref: 'Institution' }
}, { timestamps: true });

export const StudentClub = mongoose.model<IStudentClub>('StudentClub', StudentClubSchema);
export const CampusPost = mongoose.model<ICampusPost>('CampusPost', CampusPostSchema);
export const GamificationProfile = mongoose.model<IGamificationProfile>('GamificationProfile', GamificationProfileSchema);

import type { Request, Response } from 'express';
import { StudentClub, CampusPost, GamificationProfile } from './social.model.js';
import { sendSuccess, sendError } from '../../core/response/apiResponse.js';

// ─── 1. Campus Social Network & Clubs ──────────────────────────────────────

export const getClubs = async (req: Request, res: Response) => {
  try {
    const institutionId = (req as any).institutionId;
    const filter: any = institutionId ? { institutionId } : {};
    let clubs = await StudentClub.find(filter).sort({ memberCount: -1 });

    if (clubs.length === 0) {
      const defaultClubs = [
        { clubId: 'club-code', name: 'Binary Beasts: AI & Coding Guild', category: 'Coding & AI', description: 'Competitive programming, open-source hackathons, and deep learning study groups.', leadStudentName: 'Aditya Roy', facultyMentorName: 'Dr. Priya Nair', memberCount: 148, bannerColor: 'from-blue-600 to-indigo-600', upcomingEventTitle: 'Hack-the-Campus 48-hour Sprint' },
        { clubId: 'club-robo', name: 'RoboKnights Robotics & IoT', category: 'Robotics', description: 'Autonomous drones, embedded ROS systems, and national rover challenge team.', leadStudentName: 'Kunal Sharma', facultyMentorName: 'Prof. Rajesh Kumar', memberCount: 92, bannerColor: 'from-amber-600 to-rose-600', upcomingEventTitle: 'Line Follower & Drone Arena Battle' },
        { clubId: 'club-ecell', name: 'E-Cell: Nexus Incubator', category: 'Entrepreneurship', description: 'Pitch decks, seed grants, venture mentoring, and startup demo days.', leadStudentName: 'Ananya Mehta', facultyMentorName: 'Dr. Sarah Connor', memberCount: 110, bannerColor: 'from-emerald-600 to-teal-600', upcomingEventTitle: 'Angel Investor Pitch Night 2026' }
      ];
      clubs = await StudentClub.insertMany(defaultClubs.map(c => ({ ...c, institutionId })) as any) as any;
    }

    return sendSuccess(res, 'Clubs fetched', clubs);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch clubs', null, 500);
  }
};

export const getPosts = async (req: Request, res: Response) => {
  try {
    const institutionId = (req as any).institutionId;
    const filter: any = institutionId ? { institutionId, moderationStatus: 'APPROVED' } : { moderationStatus: 'APPROVED' };
    let posts = await CampusPost.find(filter).sort({ createdAt: -1 });

    if (posts.length === 0) {
      const user = (req as any).user;
      const defaultPosts = [
        {
          authorId: user?._id || user?.id,
          authorName: 'Dr. Priya Nair (Faculty Lead)',
          authorRole: 'TEACHER',
          clubCategory: 'Coding & AI',
          content: '🚀 Congratulations to Team EduVerse for securing 1st prize at the National AI Hackathon! Certificate badges have been notarized on the Blockchain Vault.',
          likesCount: 54,
          commentsCount: 12,
          isAnnouncement: true
        },
        {
          authorId: user?._id || user?.id,
          authorName: 'Aditya Roy',
          authorRole: 'STUDENT',
          clubCategory: 'Robotics',
          content: 'Our autonomous obstacle-avoidance rover completed its first campus lawn circuit test with 99.2% path accuracy. Testing telemetry now live on the 3D Digital Twin!',
          likesCount: 38,
          commentsCount: 7,
          isAnnouncement: false
        }
      ];
      posts = await CampusPost.insertMany(defaultPosts.map(p => ({ ...p, institutionId })) as any) as any;
    }

    return sendSuccess(res, 'Posts fetched', posts);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch posts', null, 500);
  }
};

export const createPost = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const institutionId = (req as any).institutionId;
    const { content, clubCategory, isAnnouncement } = req.body;

    const post = await CampusPost.create({
      authorId: user?._id || user?.id,
      authorName: user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email : 'Campus Member',
      authorRole: user?.role || 'STUDENT',
      clubCategory: clubCategory || 'General',
      content,
      isAnnouncement: isAnnouncement || false,
      moderationStatus: 'APPROVED',
      institutionId
    });

    return sendSuccess(res, 'Post published to campus community', post, 201);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to create post', null, 500);
  }
};

// ─── 2. Gamification & Leaderboard ─────────────────────────────────────────

export const getGamificationProfile = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const institutionId = (req as any).institutionId;
    let profile = await GamificationProfile.findOne({ studentId: user?._id || user?.id });

    if (!profile) {
      profile = await GamificationProfile.create({
        studentId: user?._id || user?.id,
        studentName: user ? (`${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email || 'Aditya Roy') : 'Aditya Roy',
        department: 'Computer Science',
        totalXp: 3450,
        level: 4,
        rank: 1,
        unlockedBadges: [
          { badgeId: 'badge-att-95', name: 'Attendance Vanguard', icon: '🏆', description: 'Maintained 95%+ attendance across all active subjects.', unlockedDate: '24 Aug 2026', rarity: 'Rare' },
          { badgeId: 'badge-hack-win', name: 'Hackathon Champion', icon: '🥇', description: 'Placed 1st in the Inter-College Innovation Sprint.', unlockedDate: '18 Aug 2026', rarity: 'Legendary' },
          { badgeId: 'badge-lms-10', name: 'Curriculum Master', icon: '📚', description: 'Completed 10 interactive LMS course modules with 90%+ quiz scores.', unlockedDate: '12 Aug 2026', rarity: 'Epic' },
          { badgeId: 'badge-code-100', name: 'Algorithmic Ace', icon: '⚡', description: 'Solved 100+ data structure & algorithm lab challenges.', unlockedDate: '05 Aug 2026', rarity: 'Rare' }
        ],
        questsCompleted: 14,
        institutionId
      });
    }

    // Get campus leaderboard
    const filter: any = institutionId ? { institutionId } : {};
    const leaderboard = await GamificationProfile.find(filter).sort({ totalXp: -1 }).limit(10);

    return sendSuccess(res, 'Gamification profile and leaderboard fetched', { profile, leaderboard });
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch gamification profile', null, 500);
  }
};

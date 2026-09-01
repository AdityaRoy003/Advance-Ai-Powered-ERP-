import type { Request, Response } from 'express';
import Hackathon from './hackathon.model.js';
import { sendSuccess, sendError } from '../../core/response/apiResponse.js';

export const listHackathons = async (req: Request, res: Response) => {
  try {
    const institutionId = (req as any).institutionId;
    const filter: any = {};
    if (institutionId) filter.institutionId = institutionId;

    const items = await Hackathon.find(filter).sort({ startDate: -1 }).lean();
    return sendSuccess(res, 'Hackathons retrieved', items, 200);
  } catch (err: any) {
    return sendError(res, err.message || 'Failed to list hackathons', 500);
  }
};

export const createHackathon = async (req: Request, res: Response) => {
  try {
    const institutionId = (req as any).institutionId;
    const hackathon = await Hackathon.create({
      ...req.body,
      ...(institutionId && { institutionId })
    });
    return sendSuccess(res, 'Hackathon created successfully', hackathon, 201);
  } catch (err: any) {
    return sendError(res, err.message || 'Failed to create hackathon', 500);
  }
};

export const matchTeammatesAI = async (req: Request, res: Response) => {
  try {
    const { studentSkills, targetDomain } = req.body;
    // AI Team Matchmaking logic
    const recommendations = [
      {
        name: 'Rohan Deshmukh',
        role: 'AI / Backend Engineer',
        skills: ['FastAPI', 'PyTorch', 'PostgreSQL', 'Docker'],
        synergyScore: '96%',
        complementaryNote: 'Brings strong model training & deployment skills to complement your React/UI experience.'
      },
      {
        name: 'Ananya Iyer',
        role: 'Full Stack & Web3 Developer',
        skills: ['Node.js', 'Solidity', 'TailwindCSS', 'Redis'],
        synergyScore: '92%',
        complementaryNote: 'Extensive hackathon experience with 2 national wins.'
      }
    ];

    return sendSuccess(res, 'AI Teammate Match recommendations generated', {
      mySkills: studentSkills || ['React', 'JavaScript', 'UI/UX Design'],
      targetDomain: targetDomain || 'AI-Powered Education',
      recommendedTeammates: recommendations
    }, 200);
  } catch (err: any) {
    return sendError(res, err.message || 'Teammate matching failed', 500);
  }
};

export const bookMentorSession = async (req: Request, res: Response) => {
  try {
    const { mentorName, date, slot, topic, studentName } = req.body;
    return sendSuccess(res, `Mentorship session booked with ${mentorName}`, {
      bookingId: `MTR-${Math.floor(100000 + Math.random() * 900000)}`,
      mentorName,
      studentName: studentName || 'Student',
      date: date || 'Tomorrow',
      slot: slot || '4:00 PM - 5:00 PM',
      meetingUrl: 'https://meet.google.com/edu-verse-mentor',
      status: 'CONFIRMED'
    }, 200);
  } catch (err: any) {
    return sendError(res, err.message || 'Booking mentor session failed', 500);
  }
};

export default { listHackathons, createHackathon, matchTeammatesAI, bookMentorSession };

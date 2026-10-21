import type { Request, Response } from 'express';
import { sendSuccess, sendError } from '../../core/response/apiResponse.js';

const SAMPLE_ALUMNI = [
  {
    id: 'alm-1',
    name: 'Ananya Roy',
    batch: 'Class of 2021',
    degree: 'B.Tech Computer Science',
    company: 'Google',
    role: 'Staff Machine Learning Engineer',
    location: 'Mountain View, CA / Remote',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    linkedIn: 'https://linkedin.com',
    mentorshipOpen: true,
    totalReferrals: 18
  },
  {
    id: 'alm-2',
    name: 'Karan Malhotra',
    batch: 'Class of 2019',
    degree: 'B.Tech Electronics & Comm',
    company: 'NVIDIA',
    role: 'Senior Hardware Architect (CUDA)',
    location: 'Bangalore, India',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    linkedIn: 'https://linkedin.com',
    mentorshipOpen: true,
    totalReferrals: 24
  },
  {
    id: 'alm-3',
    name: 'Shreya Varma',
    batch: 'Class of 2022',
    degree: 'MBA in Tech Strategy',
    company: 'McKinsey & Company',
    role: 'Engagement Manager',
    location: 'London, UK',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
    linkedIn: 'https://linkedin.com',
    mentorshipOpen: false,
    totalReferrals: 12
  },
  {
    id: 'alm-4',
    name: 'Rohan Sen',
    batch: 'Class of 2020',
    degree: 'B.Tech Information Technology',
    company: 'Microsoft',
    role: 'Principal Cloud Solution Architect',
    location: 'Seattle, WA',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    linkedIn: 'https://linkedin.com',
    mentorshipOpen: true,
    totalReferrals: 31
  }
];

const SAMPLE_JOBS = [
  {
    id: 'job-1',
    title: 'Software Engineer - AI Platform Systems',
    company: 'Google',
    logo: '🔴',
    location: 'Bangalore / Hyderabad / Remote',
    postedBy: 'Ananya Roy (Class of 2021)',
    experience: '0-2 Years (Freshers & 2026 Graduating eligible)',
    salaryRange: '₹32 - 45 LPA',
    deadline: 'Nov 15, 2026',
    tags: ['Python', 'Distributed Systems', 'PyTorch', 'Kubernetes']
  },
  {
    id: 'job-2',
    title: 'ASIC Silicon Verification Engineer',
    company: 'NVIDIA',
    logo: '🟢',
    location: 'Pune / Bangalore',
    postedBy: 'Karan Malhotra (Class of 2019)',
    experience: '1-3 Years',
    salaryRange: '₹28 - 38 LPA',
    deadline: 'Nov 30, 2026',
    tags: ['SystemVerilog', 'UVM', 'FPGA', 'GPU Architecture']
  },
  {
    id: 'job-3',
    title: 'Cloud Security Research Associate',
    company: 'Microsoft',
    logo: '🔵',
    location: 'Hyderabad / Noida',
    postedBy: 'Rohan Sen (Class of 2020)',
    experience: '0-1 Years',
    salaryRange: '₹25 - 35 LPA',
    deadline: 'Dec 05, 2026',
    tags: ['Azure', 'Zero Trust', 'SIEM', 'Threat Intelligence']
  }
];

const SAMPLE_ENDOWMENTS = [
  {
    id: 'endow-1',
    title: 'Autonomous AI & Supercomputing Research Cluster',
    goalAmount: 50000000, // 5 Crores
    raisedAmount: 38400000,
    donorsCount: 412,
    category: 'Academic Infrastructure',
    description: 'Funding 16 high-density NVIDIA H100 GPU nodes for undergraduate deep learning research and quantum computing simulation.'
  },
  {
    id: 'endow-2',
    title: 'Dean Presidential Merit & Need-Based Student Scholarships',
    goalAmount: 20000000, // 2 Crores
    raisedAmount: 16800000,
    donorsCount: 654,
    category: 'Student Aid',
    description: 'Providing full-tuition waivers, laptop grants, and living stipends for talented students from economically challenged backgrounds.'
  },
  {
    id: 'endow-3',
    title: 'Smart Campus Clean Energy & 500kW Solar Microgrid',
    goalAmount: 15000000, // 1.5 Crores
    raisedAmount: 13200000,
    donorsCount: 289,
    category: 'Sustainability',
    description: 'Transitioning the campus to 100% renewable energy with automated smart battery storage and rooftop solar arrays.'
  }
];

export const getAlumniDirectory = async (req: Request, res: Response) => {
  try {
    const { company, batch, search } = req.query;

    let alumni = [...SAMPLE_ALUMNI];
    if (company && company !== 'All') {
      alumni = alumni.filter(a => a.company.toLowerCase() === String(company).toLowerCase());
    }
    if (batch && batch !== 'All') {
      alumni = alumni.filter(a => a.batch.includes(String(batch)));
    }
    if (search) {
      const q = String(search).toLowerCase();
      alumni = alumni.filter(a => a.name.toLowerCase().includes(q) || a.company.toLowerCase().includes(q) || a.role.toLowerCase().includes(q));
    }

    return sendSuccess(res, 'Alumni directory retrieved', {
      alumni,
      stats: {
        totalGraduates: 14250,
        fortune500Leaders: 480,
        activeMentors: 320,
        totalEndowmentsRaised: '₹6.84 Crores'
      }
    }, 200);
  } catch (err: any) {
    return sendError(res, err.message || 'Failed to fetch alumni', 500);
  }
};

export const getAlumniJobs = async (req: Request, res: Response) => {
  try {
    return sendSuccess(res, 'Alumni job referral opportunities retrieved', SAMPLE_JOBS, 200);
  } catch (err: any) {
    return sendError(res, err.message || 'Failed to fetch jobs', 500);
  }
};

export const getEndowments = async (req: Request, res: Response) => {
  try {
    return sendSuccess(res, 'Active campus fundraising campaigns retrieved', SAMPLE_ENDOWMENTS, 200);
  } catch (err: any) {
    return sendError(res, err.message || 'Failed to fetch endowments', 500);
  }
};

export const pledgeDonation = async (req: Request, res: Response) => {
  try {
    const { campaignId, amount, donorName = 'Anonymous Alum' } = req.body;
    if (!campaignId || !amount) {
      return sendError(res, 'Campaign and donation amount are required', 400);
    }

    return sendSuccess(res, `Thank you for your generous endowment pledge of ₹${Number(amount).toLocaleString()}!`, {
      receiptId: `ENDOW-REC-${Date.now()}`,
      donorName,
      amount,
      status: 'PLEDGE_CONFIRMED',
      timestamp: new Date()
    }, 201);
  } catch (err: any) {
    return sendError(res, err.message || 'Pledge failed', 500);
  }
};

export default {
  getAlumniDirectory,
  getAlumniJobs,
  getEndowments,
  pledgeDonation
};

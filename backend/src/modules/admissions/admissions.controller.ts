import type { Request, Response } from 'express';
import Application from './admissions.model.js';
import { sendSuccess, sendError } from '../../core/response/apiResponse.js';

// Initial sample candidates if empty
const SAMPLE_APPLICATIONS = [
  {
    applicationNumber: 'EDV-ADM-2026-101',
    firstName: 'Rohan',
    lastName: 'Kulkarni',
    email: 'rohan.kulkarni@gmail.com',
    phone: '+91 98234 11223',
    program: 'B.Tech Computer Science & Engineering',
    department: 'Computer Science',
    stage: 'lead',
    entranceScore: 92,
    highSchoolGPA: 3.9,
    feeStatus: 'paid',
    assignedCounselor: 'Dr. Priya Nair',
    notes: ['Inquired via EduVerse AI portal', 'Targeting AI specialization']
  },
  {
    applicationNumber: 'EDV-ADM-2026-102',
    firstName: 'Aarav',
    lastName: 'Deshmukh',
    email: 'aarav.deshmukh@gmail.com',
    phone: '+91 97123 44556',
    program: 'B.Tech Artificial Intelligence & ML',
    department: 'Artificial Intelligence',
    stage: 'applied',
    entranceScore: 88,
    highSchoolGPA: 3.85,
    feeStatus: 'paid',
    assignedCounselor: 'Dr. Sarah Connor',
    notes: ['JEE percentile: 96.4', 'Submitted national olympiad certificate']
  },
  {
    applicationNumber: 'EDV-ADM-2026-103',
    firstName: 'Tanvi',
    lastName: 'Sharma',
    email: 'tanvi.sharma@gmail.com',
    phone: '+91 99345 66778',
    program: 'B.Tech Electronics & Communication',
    department: 'Electronics',
    stage: 'verification',
    entranceScore: 85,
    highSchoolGPA: 3.75,
    documentStatus: 'pending',
    feeStatus: 'paid',
    assignedCounselor: 'Prof. Ramesh Gupta',
    notes: ['Class 12th provisional transcript pending verification']
  },
  {
    applicationNumber: 'EDV-ADM-2026-104',
    firstName: 'Meera',
    lastName: 'Nambiar',
    email: 'meera.nambiar@gmail.com',
    phone: '+91 98450 12903',
    program: 'Master of Business Administration (MBA)',
    department: 'Management Studies',
    stage: 'interview',
    entranceScore: 94,
    highSchoolGPA: 3.92,
    documentStatus: 'verified',
    feeStatus: 'paid',
    assignedCounselor: 'Dean Vikram Sengupta',
    notes: ['CAT score: 98.2 percentile', 'Interview scheduled for Oct 24th']
  },
  {
    applicationNumber: 'EDV-ADM-2026-105',
    firstName: 'Vikram',
    lastName: 'Choudhury',
    email: 'vikram.c@gmail.com',
    phone: '+91 94321 88990',
    program: 'B.Tech Computer Science & Engineering',
    department: 'Computer Science',
    stage: 'merit_list',
    entranceScore: 96,
    highSchoolGPA: 3.98,
    scholarshipGranted: 'Dean 50% Merit Waiver',
    documentStatus: 'verified',
    feeStatus: 'paid',
    assignedCounselor: 'Dr. Priya Nair',
    notes: ['Offer letter dispatched via email', 'Rank 14 in Institutional Merit']
  },
  {
    applicationNumber: 'EDV-ADM-2026-106',
    firstName: 'Sneha',
    lastName: 'Patel',
    email: 'sneha.patel@gmail.com',
    phone: '+91 98980 33445',
    program: 'B.Des User Experience & Interaction Design',
    department: 'Design',
    stage: 'fee_deposit',
    entranceScore: 91,
    highSchoolGPA: 3.8,
    scholarshipGranted: 'Creative Talent Grant',
    documentStatus: 'verified',
    feeStatus: 'paid',
    assignedCounselor: 'Prof. Ananya Roy',
    notes: ['Seat reserved. Awaiting semester tuition deposit.']
  },
  {
    applicationNumber: 'EDV-ADM-2026-107',
    firstName: 'Aditya',
    lastName: 'Menon',
    email: 'aditya.menon@gmail.com',
    phone: '+91 97456 22334',
    program: 'B.Tech Computer Science & Engineering',
    department: 'Computer Science',
    stage: 'enrolled',
    entranceScore: 95,
    highSchoolGPA: 3.95,
    scholarshipGranted: 'Presidential Full Tuition',
    documentStatus: 'verified',
    feeStatus: 'paid',
    assignedCounselor: 'Dr. Sarah Connor',
    notes: ['Enrolled & Matriculated', 'Roll Number generated: 26CSE108', 'Hostel Block A allocated']
  }
];

export const listApplications = async (req: Request, res: Response) => {
  try {
    const institutionId = (req.user as any)?.institutionId;
    const { stage, program, search } = req.query;

    const filter: any = { isDeleted: { $ne: true } };
    if (institutionId) filter.institutionId = institutionId;
    if (stage && stage !== 'all') filter.stage = String(stage);
    if (program && program !== 'all') filter.program = { $regex: String(program), $options: 'i' };
    if (search) {
      filter.$or = [
        { firstName: { $regex: String(search), $options: 'i' } },
        { lastName: { $regex: String(search), $options: 'i' } },
        { email: { $regex: String(search), $options: 'i' } },
        { applicationNumber: { $regex: String(search), $options: 'i' } }
      ];
    }

    let applications = await Application.find(filter).sort({ createdAt: -1 }).lean();

    // Auto-seed sample candidates if empty
    if (applications.length === 0 && !search && !stage) {
      const seeded = await Application.insertMany(
        SAMPLE_APPLICATIONS.map(app => ({
          ...app,
          institutionId: institutionId || undefined
        }))
      );
      applications = seeded.map(s => s.toObject());
    }

    // Pipeline Stage Metrics
    const stageCounts = {
      lead: 0,
      applied: 0,
      verification: 0,
      interview: 0,
      merit_list: 0,
      fee_deposit: 0,
      enrolled: 0,
      rejected: 0
    };

    const allApps = await Application.find({ isDeleted: { $ne: true } }).lean();
    allApps.forEach(a => {
      if (stageCounts[a.stage as keyof typeof stageCounts] !== undefined) {
        stageCounts[a.stage as keyof typeof stageCounts]++;
      }
    });

    return sendSuccess(res, 'Applications retrieved', { applications, stageCounts }, 200);
  } catch (err: any) {
    return sendError(res, err.message || 'Failed to list applications', 500);
  }
};

export const updateApplicationStage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { stage, note } = req.body;

    const validStages = ['lead', 'applied', 'verification', 'interview', 'merit_list', 'fee_deposit', 'enrolled', 'rejected'];
    if (!validStages.includes(stage)) {
      return sendError(res, 'Invalid stage provided', 400);
    }

    const app = await Application.findById(id);
    if (!app) return sendError(res, 'Application not found', 404);

    app.stage = stage as any;
    if (note) {
      if (!app.notes) app.notes = [];
      app.notes.push(`[${new Date().toLocaleDateString()}] ${note}`);
    }
    await app.save();

    return sendSuccess(res, `Applicant moved to ${stage.replace('_', ' ').toUpperCase()}`, app, 200);
  } catch (err: any) {
    return sendError(res, err.message || 'Failed to update stage', 500);
  }
};

export const createApplication = async (req: Request, res: Response) => {
  try {
    const {
      firstName, lastName, email, phone, program, department,
      entranceScore, highSchoolGPA
    } = req.body;

    if (!firstName || !lastName || !email || !program) {
      return sendError(res, 'First name, last name, email, and program are required', 400);
    }

    const appNumber = `EDV-ADM-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const application = await Application.create({
      applicationNumber: appNumber,
      firstName,
      lastName,
      email: email.toLowerCase(),
      phone: phone || '+91 98000 00000',
      program,
      department: department || 'General Engineering',
      entranceScore: entranceScore || 85,
      highSchoolGPA: highSchoolGPA || 3.8,
      stage: 'applied',
      feeStatus: 'paid',
      institutionId: (req.user as any)?.institutionId || undefined,
      notes: [`Application submitted online on ${new Date().toLocaleDateString()}`]
    });

    return sendSuccess(res, 'Application submitted successfully', application, 201);
  } catch (err: any) {
    return sendError(res, err.message || 'Failed to create application', 500);
  }
};

export const trackCandidateApplication = async (req: Request, res: Response) => {
  try {
    const { appNumber } = req.params;
    const searchVal = String(appNumber || '').trim();
    const application = await Application.findOne({
      $or: [
        { applicationNumber: searchVal.toUpperCase() },
        { email: searchVal.toLowerCase() }
      ]
    }).lean();

    if (!application) {
      return sendError(res, 'No application record found with provided credentials', 404);
    }

    return sendSuccess(res, 'Application status retrieved', application, 200);
  } catch (err: any) {
    return sendError(res, err.message || 'Failed to track application', 500);
  }
};

export default {
  listApplications,
  updateApplicationStage,
  createApplication,
  trackCandidateApplication
};

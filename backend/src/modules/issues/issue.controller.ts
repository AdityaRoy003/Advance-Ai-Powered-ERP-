import { Request, Response } from 'express';
import { Issue } from './issue.model.js';
import { sendSuccess, sendError } from '../../core/response/apiResponse.js';

// Seed initial realistic issues if database collection is empty
const seedInitialIssues = async () => {
  const count = await Issue.countDocuments();
  if (count === 0) {
    const initial = [
      {
        ticketId: 'ISS-2026-1042',
        title: 'Timetable conflict alert false-positive in CSE Dept',
        description: 'While generating the semester 4 schedule, room 302 flagged a double-booking error although the other lecture was marked online.',
        category: 'Bug',
        severity: 'High',
        status: 'In Progress',
        reportedBy: {
          name: 'Dr. Priya Nair',
          email: 'priya.nair@eduverse.edu',
          userId: 'usr_faculty_02',
          role: 'TEACHER'
        },
        adminNotes: 'Checked CP-SAT constraints in academic controller engine.',
        resolutionNotes: 'Constraint logic adjusted in PR #402. Verification under way.',
        updates: [
          {
            message: 'Issue received and assigned to Academic Engineering team.',
            updatedBy: 'System Auto-Router',
            status: 'Open',
            timestamp: new Date(Date.now() - 86400000 * 2)
          },
          {
            message: 'Identified conflict matrix glitch with virtual hybrid rooms. Fix deploying.',
            updatedBy: 'Super Admin',
            status: 'In Progress',
            timestamp: new Date(Date.now() - 86400000)
          }
        ]
      },
      {
        ticketId: 'ISS-2026-1043',
        title: 'Student Fee Receipt PDF rendering issue on iOS Safari',
        description: 'When downloading semester 2 tuition receipt from mobile, the institution seal overlay shifts into the header.',
        category: 'UI/UX',
        severity: 'Medium',
        status: 'Open',
        reportedBy: {
          name: 'Aditya Raj',
          email: 'aditya.raj@student.eduverse.edu',
          userId: 'usr_student_01',
          role: 'STUDENT'
        },
        adminNotes: 'Review CSS viewport and print layout styles for WebKit.',
        updates: [
          {
            message: 'Issue ticket logged. Investigating WebKit rendering pipeline.',
            updatedBy: 'Super Admin',
            status: 'Open',
            timestamp: new Date(Date.now() - 43200000)
          }
        ]
      },
      {
        ticketId: 'ISS-2026-1039',
        title: 'Biometric Attendance Facial Scan Timeout on Entrance Gate #2',
        description: 'IoT scanner terminal at Entrance Gate 2 took over 12 seconds to confirm student check-in during morning rush.',
        category: 'Performance',
        severity: 'High',
        status: 'Resolved',
        reportedBy: {
          name: 'Security Admin Desk',
          email: 'campus.security@eduverse.edu',
          role: 'EMPLOYEE'
        },
        adminNotes: 'Flushed local edge buffer and refreshed websocket heartbeat.',
        resolutionNotes: 'Edge inference cache flushed and websocket reconnect frequency tuned to 500ms. Latency dropped to 140ms.',
        updates: [
          {
            message: 'Report logged from Campus IoT monitor.',
            updatedBy: 'System',
            status: 'Open',
            timestamp: new Date(Date.now() - 86400000 * 4)
          },
          {
            message: 'Edge gateway restarted and socket heartbeat verified.',
            updatedBy: 'Super Admin',
            status: 'Resolved',
            timestamp: new Date(Date.now() - 86400000 * 3)
          }
        ]
      }
    ];

    await Issue.insertMany(initial);
  }
};

/**
 * Submit a new issue (Public visitors or Authenticated users)
 */
export const createIssue = async (req: Request, res: Response) => {
  try {
    const { title, description, category, severity, email, name, role, institutionId } = req.body;

    if (!title || !description || !email || !name) {
      return sendError(res, 'Title, description, name, and email are required fields', null, 400);
    }

    const count = await Issue.countDocuments();
    const ticketId = `ISS-2026-${String(1050 + count + Math.floor(Math.random() * 90))}`;

    const newIssue = await Issue.create({
      ticketId,
      title: title.trim(),
      description: description.trim(),
      category: category || 'Bug',
      severity: severity || 'Medium',
      status: 'Open',
      reportedBy: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        userId: (req as any).user?.id || (req as any).user?._id || undefined,
        role: role || (req as any).user?.role || 'Public / Visitor'
      },
      institutionId: institutionId || (req as any).user?.institutionId || undefined,
      updates: [
        {
          message: 'Issue report received and assigned reference ticket number.',
          updatedBy: 'System Intake Desk',
          status: 'Open',
          timestamp: new Date()
        }
      ]
    });

    return sendSuccess(res, 'Issue reported successfully. Our team will review and update you.', newIssue, 201);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to submit issue report', null, 500);
  }
};

/**
 * Get all issues with filtering & search (Super Admin)
 */
export const getIssues = async (req: Request, res: Response) => {
  try {
    await seedInitialIssues();

    const { status, severity, category, search } = req.query;
    const filter: any = {};

    if (status && status !== 'ALL') {
      filter.status = status;
    }
    if (severity && severity !== 'ALL') {
      filter.severity = severity;
    }
    if (category && category !== 'ALL') {
      filter.category = category;
    }
    if (search) {
      const q = String(search).trim();
      filter.$or = [
        { ticketId: { $regex: q, $options: 'i' } },
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { 'reportedBy.name': { $regex: q, $options: 'i' } },
        { 'reportedBy.email': { $regex: q, $options: 'i' } }
      ];
    }

    const issues = await Issue.find(filter).sort({ createdAt: -1 }).lean();
    return sendSuccess(res, 'Issues retrieved successfully', issues);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch issues', null, 500);
  }
};

/**
 * Get single issue by Ticket ID (Public tracking or admin)
 */
export const getIssueByTicketId = async (req: Request, res: Response) => {
  try {
    const { ticketId } = req.params;
    const issue = await Issue.findOne({ ticketId }).lean();
    if (!issue) {
      return sendError(res, 'Issue ticket not found', null, 404);
    }
    return sendSuccess(res, 'Issue ticket details retrieved', issue);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to lookup issue ticket', null, 500);
  }
};

/**
 * Update issue status and send update note to the reporting user (Super Admin)
 */
export const updateIssueStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, resolutionNotes, adminNotes, updateMessage } = req.body;

    const issue = await Issue.findById(id);
    if (!issue) {
      return sendError(res, 'Issue not found', null, 404);
    }

    const adminUser = (req as any).user;
    const adminName = adminUser ? `${adminUser.firstName || ''} ${adminUser.lastName || ''}`.trim() || 'Super Admin' : 'Super Admin';

    if (status) issue.status = status;
    if (resolutionNotes !== undefined) issue.resolutionNotes = resolutionNotes;
    if (adminNotes !== undefined) issue.adminNotes = adminNotes;

    // Add timeline update entry
    if (updateMessage || status) {
      const msg = updateMessage || `Status changed to ${status}${resolutionNotes ? `: ${resolutionNotes}` : ''}`;
      issue.updates.push({
        message: msg,
        updatedBy: adminName,
        status: status || issue.status,
        timestamp: new Date()
      });
    }

    await issue.save();
    return sendSuccess(res, 'Issue status updated and resolution logged successfully', issue);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to update issue', null, 500);
  }
};

/**
 * Issue stats summary for Super Admin Dashboard
 */
export const getIssueStats = async (_req: Request, res: Response) => {
  try {
    await seedInitialIssues();

    const [total, open, inProgress, resolved, critical] = await Promise.all([
      Issue.countDocuments(),
      Issue.countDocuments({ status: 'Open' }),
      Issue.countDocuments({ status: { $in: ['In Progress', 'Under Review'] } }),
      Issue.countDocuments({ status: { $in: ['Resolved', 'Closed'] } }),
      Issue.countDocuments({ severity: 'Critical', status: { $ne: 'Closed' } })
    ]);

    return sendSuccess(res, 'Issue metrics calculated', {
      total,
      open,
      inProgress,
      resolved,
      critical
    });
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch issue metrics', null, 500);
  }
};

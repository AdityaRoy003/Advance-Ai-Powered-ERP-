import type { Request, Response } from 'express';
import { ExecutiveBriefing, WhatChangedDelta, AIInnovationRec } from './executive.model.js';
import { sendSuccess, sendError } from '../../core/response/apiResponse.js';

// ─── 1. Executive Briefing ──────────────────────────────────────────────────

export const getExecutiveBriefing = async (req: Request, res: Response) => {
  try {
    const institutionId = (req as any).institutionId;
    const filter: any = institutionId ? { institutionId } : {};
    let briefing = await ExecutiveBriefing.findOne(filter).sort({ createdAt: -1 });

    if (!briefing) {
      briefing = await ExecutiveBriefing.create({
        briefingType: 'Daily',
        periodDate: '31 August 2026',
        executiveSummary: 'EduVerse operational metrics indicate strong performance across admissions and placement conversion, with minor attendance fluctuations in Semester 4 CSE.',
        kpis: {
          totalStudents: 3420,
          facultyCount: 184,
          overallAttendancePct: 91.8,
          feeCollectionRatePct: 94.2,
          placementOffersCount: 384,
          activeResearchGrantsInr: 42500000,
          securityIncidentsCount: 0,
          institutionalHealthIndex: 94.8
        },
        keyHighlights: [
          'Fee reconciliation achieved 94.2% collection with ₹1.82 Cr collected in August.',
          'Google and Microsoft placement drives completed with 28 premium Tier-1 offers.',
          'NAAC Criteria 1–7 digital evidence repository readiness verified at A++ level.'
        ],
        riskAlerts: [
          'Semester 4 CSE Lab attendance slipped 2.4% below 14-day rolling average.',
          '2 server HVAC sensors alerted minor temperature spikes in Tech Hub.'
        ],
        aiGrowthOpportunities: [
          'Introduce afternoon peer learning sessions in the Central Library to boost room utilization.',
          'Automate hostel room check-ins with RFID biometric turnstiles.'
        ],
        institutionId
      });
    }

    return sendSuccess(res, 'Executive briefing fetched', briefing);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch executive briefing', null, 500);
  }
};

// ─── 2. AI "What Changed?" Engine ──────────────────────────────────────────

export const getWhatChangedDeltas = async (req: Request, res: Response) => {
  try {
    const institutionId = (req as any).institutionId;
    const filter: any = institutionId ? { institutionId } : {};
    let deltas = await WhatChangedDelta.findOne(filter).sort({ createdAt: -1 });

    if (!deltas) {
      deltas = await WhatChangedDelta.create({
        deltaDate: '31 Aug 2026 vs Yesterday',
        metricDeltas: [
          { category: 'Attendance', metric: 'Campus Overall Attendance', previousValue: '94.2%', currentValue: '91.8%', deltaPercentage: -2.4, direction: 'DOWN', sentiment: 'NEGATIVE', summaryNote: 'Attendance decreased 2.4% primarily due to semester end sports trials.' },
          { category: 'Finance', metric: 'Daily Fee Collection', previousValue: '₹14.2 L', currentValue: '₹15.4 L', deltaPercentage: 8.0, direction: 'UP', sentiment: 'POSITIVE', summaryNote: 'Fee collection increased 8% following automated SMS reminders.' },
          { category: 'Admissions', metric: 'New Applicant Registrations', previousValue: '28', currentValue: '42', deltaPercentage: 50.0, direction: 'UP', sentiment: 'POSITIVE', summaryNote: '14 new admissions processed across B.Tech & MBA cohorts.' },
          { category: 'Security', metric: 'AI Firewall Jailbreak Blocks', previousValue: '0', currentValue: '3', deltaPercentage: 300.0, direction: 'UP', sentiment: 'NEUTRAL', summaryNote: '3 prompt injection probes neutralized with zero data leakage.' },
          { category: 'Placements', metric: 'New Placement Offers', previousValue: '376', currentValue: '384', deltaPercentage: 2.1, direction: 'UP', sentiment: 'POSITIVE', summaryNote: '8 new placement offers received from Amazon and Oracle.' }
        ],
        institutionId
      });
    }

    return sendSuccess(res, 'What Changed deltas fetched', deltas);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch deltas', null, 500);
  }
};

// ─── 3. What-If Mathematical Simulation Engine ─────────────────────────────

export const runWhatIfSimulation = async (req: Request, res: Response) => {
  try {
    const { scenarioType, intakeChangePct, attendanceThresholdPct, tuitionFeeChangePct } = req.body;

    const baseStudents = 3400;
    const baseFaculty = 180;
    const baseClassrooms = 45;
    const baseHostelCapacity = 1600;
    const baseBuses = 24;
    const baseAnnualTuition = 120000;

    let result: any = {};

    if (scenarioType === 'INTAKE_EXPANSION' || intakeChangePct !== undefined) {
      const pct = Number(intakeChangePct || 20);
      const studentDelta = Math.round((baseStudents * pct) / 100);
      const newTotalStudents = baseStudents + studentDelta;
      const additionalFacultyReq = Math.ceil(studentDelta / 20); // 1:20 student-faculty ratio
      const additionalClassroomsReq = Math.ceil(studentDelta / 60); // 60 students per classroom
      const additionalHostelBedsReq = Math.round(studentDelta * 0.5); // 50% hostel occupancy rate
      const additionalBusesReq = Math.ceil(studentDelta * 0.3 / 50); // 30% bus commuters, 50 seats/bus
      const additionalRevenueInr = studentDelta * baseAnnualTuition;
      const estimatedOperatingCostInr = (additionalFacultyReq * 1200000) + (additionalBusesReq * 800000);

      result = {
        scenario: `Intake Adjustment (+${pct}%)`,
        projectedStudents: newTotalStudents,
        studentDelta: `+${studentDelta}`,
        requiredFaculty: `+${additionalFacultyReq} faculty members`,
        requiredClassrooms: `+${additionalClassroomsReq} lecture halls`,
        requiredHostelBeds: `+${additionalHostelBedsReq} hostel beds`,
        requiredBuses: `+${additionalBusesReq} transport buses`,
        financialImpact: {
          additionalGrossRevenueInr: additionalRevenueInr,
          estimatedOperatingExpenditureInr: estimatedOperatingCostInr,
          netInstitutionalMarginInr: additionalRevenueInr - estimatedOperatingCostInr
        },
        feasibilityScore: pct > 35 ? 'Moderate Feasibility (Requires Infra Expansion)' : 'High Feasibility (Within Campus Capacity)'
      };
    } else if (scenarioType === 'ATTENDANCE_CRITERIA' || attendanceThresholdPct !== undefined) {
      const threshold = Number(attendanceThresholdPct || 80);
      const affectedCount = threshold > 75 ? Math.round(3400 * ((threshold - 75) * 0.035)) : 45;
      result = {
        scenario: `Attendance Requirement Shift to ${threshold}%`,
        impactedStudents: affectedCount,
        percentageOfCohortImpacted: ((affectedCount / baseStudents) * 100).toFixed(1) + '%',
        suggestedRemedialClasses: Math.ceil(affectedCount / 30),
        parentNotificationsToDispatch: affectedCount,
        recommendation: threshold > 80 ? 'Phase in mandatory 80% threshold across 2 semesters to prevent sudden examination debarments.' : 'Standard regulatory compliance.'
      };
    }

    return sendSuccess(res, 'What-if simulation computed', result);
  } catch (error: any) {
    return sendError(res, error.message || 'Simulation error', null, 500);
  }
};

// ─── 4. AI Innovation Recommendation Engine ────────────────────────────────

export const getInnovationRecommendations = async (req: Request, res: Response) => {
  try {
    const institutionId = (req as any).institutionId;
    const filter: any = institutionId ? { institutionId } : {};
    let recs = await AIInnovationRec.find(filter).sort({ createdAt: -1 });

    if (recs.length === 0) {
      const defaultRecs = [
        {
          title: 'Library Off-Peak Peer Learning Optimization',
          observation: 'Library seat occupancy drops to 24% between 2:00 PM – 5:00 PM on weekdays.',
          suggestion: 'Introduce peer-tutoring circles, coding sprint workshops, and faculty office hours during this off-peak window.',
          departmentScope: 'Central Library & Academic Support',
          impactLevel: 'HIGH',
          estimatedCostSavingInr: 120000,
          status: 'New'
        },
        {
          title: 'HVAC Solar Shifting for Tech Hub',
          observation: 'Solar generation peaks between 11:30 AM and 2:30 PM (64.2 kW average output).',
          suggestion: 'Pre-cool Tech Hub computational labs during solar peak hours to reduce evening grid power tariffs by 14%.',
          departmentScope: 'Facilities & Sustainability',
          impactLevel: 'TRANSFORMATIVE',
          estimatedCostSavingInr: 280000,
          status: 'Under Review'
        },
        {
          title: 'Automated Cafeteria Buffer Calibration',
          observation: 'Food wastage spikes by 4.2% on Friday evenings due to weekend hostel departures.',
          suggestion: 'Auto-adjust Friday dinner prep baseline by -18% via AI hostel check-out telemetry.',
          departmentScope: 'Smart Mess & Hospitality',
          impactLevel: 'MEDIUM',
          estimatedCostSavingInr: 95000,
          status: 'Approved'
        }
      ];
      recs = await AIInnovationRec.insertMany(defaultRecs.map(r => ({ ...r, institutionId })) as any) as any;
    }

    return sendSuccess(res, 'AI Innovation recommendations fetched', recs);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch recommendations', null, 500);
  }
};

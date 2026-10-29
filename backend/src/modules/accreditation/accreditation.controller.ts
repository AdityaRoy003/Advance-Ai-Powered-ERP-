import type { Request, Response } from 'express';
import Accreditation from './accreditation.model.js';
import { sendSuccess, sendError } from '../../core/response/apiResponse.js';

export const getAccreditationReport = async (req: Request, res: Response) => {
  try {
    const institutionId = (req as any).institutionId;
    const filter: any = {};
    if (institutionId) filter.institutionId = institutionId;

    let report = await Accreditation.findOne(filter).lean();
    if (!report) {
      // Auto-provision initial NAAC & OBE record if first query
      report = (await Accreditation.create({
        framework: 'NAAC',
        overallReadiness: 86.4,
        criteriaList: [
          { criterionNumber: 1, title: 'Curricular Aspects', targetScore: 100, currentScore: 92, progressPercentage: 92, responsibleHOD: 'Prof. S. Verma', deadline: 'Oct 2026', evidenceDocuments: [] },
          { criterionNumber: 2, title: 'Teaching-Learning & Evaluation', targetScore: 350, currentScore: 310, progressPercentage: 88, responsibleHOD: 'Dean Academics', deadline: 'Nov 2026', evidenceDocuments: [] },
          { criterionNumber: 3, title: 'Research, Innovations & Extension', targetScore: 150, currentScore: 124, progressPercentage: 82, responsibleHOD: 'Dr. A. Roy', deadline: 'Dec 2026', evidenceDocuments: [] },
          { criterionNumber: 4, title: 'Infrastructure & Learning Resources', targetScore: 100, currentScore: 94, progressPercentage: 94, responsibleHOD: 'Estate Officer', deadline: 'Sep 2026', evidenceDocuments: [] },
          { criterionNumber: 5, title: 'Student Support & Progression', targetScore: 100, currentScore: 89, progressPercentage: 89, responsibleHOD: 'Dean Student Affairs', deadline: 'Oct 2026', evidenceDocuments: [] },
          { criterionNumber: 6, title: 'Governance, Leadership & Management', targetScore: 100, currentScore: 85, progressPercentage: 85, responsibleHOD: 'Registrar', deadline: 'Nov 2026', evidenceDocuments: [] },
          { criterionNumber: 7, title: 'Institutional Values & Best Practices', targetScore: 100, currentScore: 91, progressPercentage: 91, responsibleHOD: 'IQAC Coordinator', deadline: 'Dec 2026', evidenceDocuments: [] }
        ],
        obeMatrix: {
          courseCode: 'CSE-401 (Distributed Cloud AI)',
          courseOutcomes: [
            { coCode: 'CO1', description: 'Analyze distributed consensus algorithms', targetAttainment: 80, actualAttainment: 84.5 },
            { coCode: 'CO2', description: 'Deploy fault-tolerant containerized microservices', targetAttainment: 75, actualAttainment: 79.2 },
            { coCode: 'CO3', description: 'Evaluate vector databases for high-throughput RAG', targetAttainment: 85, actualAttainment: 91.0 }
          ],
          programOutcomes: [
            { poCode: 'PO1 (Engineering Knowledge)', description: 'Apply mathematics and cloud principles', targetAttainment: 80, actualAttainment: 86.4 },
            { poCode: 'PO2 (Problem Analysis)', description: 'Identify complex system bottlenecks', targetAttainment: 75, actualAttainment: 78.9 },
            { poCode: 'PO3 (Design & Development)', description: 'Design secure multi-tier architectures', targetAttainment: 80, actualAttainment: 88.0 }
          ],
          programSpecificOutcomes: [
            { psoCode: 'PSO1', description: 'Proficiency in Enterprise AI & Cloud Native Solutions', targetAttainment: 85, actualAttainment: 89.6 }
          ]
        },
        ...(institutionId && { institutionId })
      })) as any;
    }

    return sendSuccess(res, 'Accreditation & OBE report fetched', report, 200);
  } catch (err: any) {
    return sendError(res, err.message || 'Failed to fetch accreditation metrics', 500);
  }
};

export const updateCriterionScore = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const report = await Accreditation.findByIdAndUpdate(id, { $set: req.body }, { returnDocument: 'after' });
    return sendSuccess(res, 'Accreditation criterion updated', report, 200);
  } catch (err: any) {
    return sendError(res, err.message || 'Update failed', 500);
  }
};

export default { getAccreditationReport, updateCriterionScore };

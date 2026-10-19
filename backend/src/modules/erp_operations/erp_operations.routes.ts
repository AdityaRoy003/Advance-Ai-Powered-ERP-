import { Router } from 'express';
import { 
  simulatePolicyChange, getPolicyVersions, savePolicyVersion, rollbackPolicyVersion,
  getLifecycleRecords, createLifecycleAction, getStudentTransfers, requestStudentTransfer,
  getEmergencyContacts, getStudentDocuments, getAcademicCalendar, getCertificates, generateCertificate,
  getFeeAdjustments, createFeeAdjustment, getFeeReceipts, createFeeReceipt, getVendorBills,
  getCashbookEntries, getNoDuesClearance, getSubstituteAssignments, assignSubstituteTeacher,
  getFacultyWorkload, getStaffLifecycle, sendBulkAnnouncement, getDispatchLogs, retryDispatch,
  getEventRegistrations, validateBatchImport, getDuplicateRecords, resolveDuplicateRecord,
  getRecycleBin, restoreDeletedRecord, runTenantIsolationTest
} from './erp_operations.controller.js';

const router = Router();

// 1. Policy Simulator & Permission Impact Analyzer
router.post('/policy/simulate', simulatePolicyChange);
router.get('/policy/versions', getPolicyVersions);
router.post('/policy/versions', savePolicyVersion);
router.post('/policy/rollback/:versionId', rollbackPolicyVersion);

// 2. Student & Academic Operations
router.get('/lifecycle', getLifecycleRecords);
router.post('/lifecycle', createLifecycleAction);
router.get('/transfers', getStudentTransfers);
router.post('/transfers', requestStudentTransfer);
router.get('/emergency-contacts', getEmergencyContacts);
router.get('/documents', getStudentDocuments);
router.get('/calendar', getAcademicCalendar);
router.get('/certificates', getCertificates);
router.post('/certificates', generateCertificate);

// 3. Finance & Administration
router.get('/finance/adjustments', getFeeAdjustments);
router.post('/finance/adjustments', createFeeAdjustment);
router.get('/finance/receipts', getFeeReceipts);
router.post('/finance/receipts', createFeeReceipt);
router.get('/finance/bills', getVendorBills);
router.get('/finance/cashbook', getCashbookEntries);
router.get('/no-dues', getNoDuesClearance);

// 4. Faculty & Staff Operations
router.get('/faculty/substitutes', getSubstituteAssignments);
router.post('/faculty/substitutes', assignSubstituteTeacher);
router.get('/faculty/workload', getFacultyWorkload);
router.get('/staff/lifecycle', getStaffLifecycle);

// 5. Communication & Usability
router.post('/communication/announcements', sendBulkAnnouncement);
router.get('/communication/dispatch-logs', getDispatchLogs);
router.post('/communication/retry/:messageId', retryDispatch);
router.get('/events/registrations', getEventRegistrations);

// 6. Data & System Consistency
router.post('/data/validate-import', validateBatchImport);
router.get('/data/duplicates', getDuplicateRecords);
router.patch('/data/duplicates/:duplicateId', resolveDuplicateRecord);
router.get('/data/recycle-bin', getRecycleBin);
router.post('/data/restore/:id', restoreDeletedRecord);
router.get('/data/tenant-isolation-test', runTenantIsolationTest);

export default router;

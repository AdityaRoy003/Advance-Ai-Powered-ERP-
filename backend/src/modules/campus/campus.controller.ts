import type { Request, Response } from 'express';
import CampusFacility from './campus.model.js';
import { sendSuccess, sendError } from '../../core/response/apiResponse.js';

export const getDigitalTwinData = async (req: Request, res: Response) => {
  try {
    const institutionId = (req as any).institutionId;
    const filter: any = {};
    if (institutionId) filter.institutionId = institutionId;

    let facilities = await CampusFacility.find(filter).lean();

    if (facilities.length === 0) {
      // Seed default digital twin buildings
      facilities = await CampusFacility.create([
        {
          buildingName: 'Aryabhata Academic Complex (Block A)',
          category: 'Academic',
          floorsCount: 5,
          currentPowerKW: 164.2,
          powerForecastTomorrowKW: 185.0,
          currentWaterLitersPerHour: 510,
          internetBandwidthGbps: 8.4,
          occupancyCount: 420,
          maxCapacity: 600,
          crowdDensityStatus: 'Moderate',
          busLivePositions: [
            { busId: 'BUS-01 (South Route)', route: 'Central Station -> Campus Gate 1', lat: 28.545, lng: 77.192, speedKmH: 42, etaMinutes: 8 },
            { busId: 'BUS-04 (North Loop)', route: 'Tech Park -> Engineering Block', lat: 28.549, lng: 77.198, speedKmH: 35, etaMinutes: 14 }
          ],
          cvDetections: [
            { cameraZone: 'Gate 1 ANPR', eventType: 'Vehicle ANPR', confidence: 0.98, plateNumberOrBadge: 'DL-01-AB-2026' },
            { cameraZone: 'Lab 4 Robotics', eventType: 'Lab PPE Verified', confidence: 0.95, plateNumberOrBadge: 'Goggles + Coat OK' }
          ],
          healthClinicRecords: [
            { patientName: 'Rahul Sharma', role: 'STUDENT', symptoms: 'Mild headache & eye strain', diagnosis: 'Digital Eye Strain', prescriptions: ['Lubricant Eye Drops', 'Hydration Advice'], emergencyContact: '+91 9876543210', status: 'Treated' },
            { patientName: 'Dr. Arjun Mehta', role: 'TEACHER', symptoms: 'Seasonal allergic rhinitis', diagnosis: 'Allergic Rhinitis', prescriptions: ['Cetirizine 10mg'], emergencyContact: '+91 9811223344', status: 'Treated' }
          ],
          ...(institutionId && { institutionId })
        },
        {
          buildingName: 'Turing Advanced Research & AI Labs (Block B)',
          category: 'Lab',
          floorsCount: 4,
          currentPowerKW: 240.8,
          powerForecastTomorrowKW: 295.0,
          currentWaterLitersPerHour: 320,
          internetBandwidthGbps: 10.0,
          occupancyCount: 185,
          maxCapacity: 250,
          crowdDensityStatus: 'Normal',
          busLivePositions: [],
          cvDetections: [
            { cameraZone: 'Server Room 2', eventType: 'Restricted Area Entry', confidence: 0.99, plateNumberOrBadge: 'Badge: CSO-ADMIN-01' }
          ],
          healthClinicRecords: [],
          ...(institutionId && { institutionId })
        }
      ]) as any;
    }

    return sendSuccess(res, 'Digital twin spatial telemetry retrieved', facilities, 200);
  } catch (err: any) {
    return sendError(res, err.message || 'Failed to fetch digital twin', 500);
  }
};

export const getClinicRecords = async (req: Request, res: Response) => {
  try {
    const institutionId = (req as any).institutionId;
    const filter: any = {};
    if (institutionId) filter.institutionId = institutionId;

    const facility = await CampusFacility.findOne(filter).select('healthClinicRecords').lean();
    const records = facility?.healthClinicRecords || [
      { patientName: 'Aditya Roy', role: 'STUDENT', symptoms: 'Mild headache & eye strain', diagnosis: 'Digital Eye Strain', prescriptions: ['Lubricant Eye Drops', 'Hydration Advice'], emergencyContact: '+91 9876543210', status: 'Treated', visitDate: new Date() },
      { patientName: 'Dr. Priya Nair', role: 'TEACHER', symptoms: 'Seasonal allergic rhinitis', diagnosis: 'Allergic Rhinitis', prescriptions: ['Cetirizine 10mg'], emergencyContact: '+91 9811223344', status: 'Treated', visitDate: new Date() }
    ];

    return sendSuccess(res, 'Health clinic records retrieved', records, 200);
  } catch (err: any) {
    return sendError(res, err.message || 'Failed to fetch clinic records', 500);
  }
};

export const createClinicRecord = async (req: Request, res: Response) => {
  try {
    const institutionId = (req as any).institutionId;
    const filter: any = {};
    if (institutionId) filter.institutionId = institutionId;

    let facility = await CampusFacility.findOne(filter);
    if (!facility) {
      facility = await CampusFacility.create({ buildingName: 'Central Health Center', ...(institutionId && { institutionId }) });
    }

    facility.healthClinicRecords.push({
      patientName: req.body.patientName || 'Anonymous Student',
      role: req.body.role || 'STUDENT',
      symptoms: req.body.symptoms || 'General Checkup',
      diagnosis: req.body.diagnosis || 'Vitals Normal',
      prescriptions: req.body.prescriptions || ['Multivitamins'],
      emergencyContact: req.body.emergencyContact || '+91 9999999999',
      visitDate: new Date(),
      status: req.body.status || 'Treated'
    });

    await facility.save();
    return sendSuccess(res, 'Health Clinic Consultation logged', facility.healthClinicRecords, 201);
  } catch (err: any) {
    return sendError(res, err.message || 'Failed to log health clinic consultation', 500);
  }
};

export const logCVDetection = async (req: Request, res: Response) => {
  try {
    const institutionId = (req as any).institutionId;
    const filter: any = {};
    if (institutionId) filter.institutionId = institutionId;

    let facility = await CampusFacility.findOne(filter);
    if (!facility) {
      facility = await CampusFacility.create({ buildingName: 'Security Gate', ...(institutionId && { institutionId }) });
    }

    const newDetection = {
      timestamp: new Date(),
      cameraZone: req.body.cameraZone || 'Gate 1 AI Cam',
      eventType: req.body.eventType || 'QR Attendance',
      confidence: req.body.confidence || 0.97,
      plateNumberOrBadge: req.body.plateNumberOrBadge || 'VERIFIED-TOKEN'
    };

    facility.cvDetections.unshift(newDetection as any);
    if (facility.cvDetections.length > 50) facility.cvDetections.pop();

    await facility.save();
    return sendSuccess(res, 'Computer Vision event processed & logged', newDetection, 200);
  } catch (err: any) {
    return sendError(res, err.message || 'CV processing error', 500);
  }
};

export default { getDigitalTwinData, getClinicRecords, createClinicRecord, logCVDetection };

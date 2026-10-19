import type { Request, Response } from 'express';
import { IoTSensor, TelemetryLog, SustainabilitySnapshot } from './iot.model.js';
import { sendSuccess, sendError } from '../../core/response/apiResponse.js';

// ─── 1. IoT Sensor & Telemetry Endpoints ────────────────────────────────────

export const getAllSensors = async (req: Request, res: Response) => {
  try {
    const institutionId = (req as any).institutionId;
    const filter: any = institutionId ? { institutionId } : {};
    let sensors = await IoTSensor.find(filter).sort({ building: 1 });

    if (sensors.length === 0) {
      const defaultSensors = [
        { sensorId: 'IOT-TEMP-01', name: 'Main Server Room HVAC Ambient', type: 'Temperature', building: 'Tech Hub', floor: 'Basement', currentValue: 21.4, unit: '°C', status: 'Online', minSafeValue: 18, maxSafeValue: 24 },
        { sensorId: 'IOT-PWR-02', name: 'Engineering Block A Main Transformer', type: 'Electricity', building: 'Engineering Block A', floor: 'Ground', currentValue: 142.8, unit: 'kW', status: 'Online', minSafeValue: 50, maxSafeValue: 200 },
        { sensorId: 'IOT-WTR-03', name: 'Hostel Tank Flow Meter', type: 'Water Flow', building: 'Hostel Block B', floor: 'Roof', currentValue: 38.5, unit: 'L/min', status: 'Online', minSafeValue: 5, maxSafeValue: 60 },
        { sensorId: 'IOT-AQI-04', name: 'Central Library Indoor Air Monitor', type: 'Air Quality (AQI)', building: 'Central Library', floor: '1st Floor', currentValue: 42.0, unit: 'AQI', status: 'Online', minSafeValue: 0, maxSafeValue: 100 },
        { sensorId: 'IOT-OCC-05', name: 'Seminar Hall 1 PIR Motion Scanner', type: 'Occupancy', building: 'Admin Block', floor: '2nd Floor', currentValue: 88.0, unit: '%', status: 'Online', minSafeValue: 0, maxSafeValue: 100 },
        { sensorId: 'IOT-SOL-06', name: 'Rooftop Solar Array Inverter 1', type: 'Solar Generation', building: 'Tech Hub', floor: 'Rooftop', currentValue: 64.2, unit: 'kW', status: 'Online', minSafeValue: 0, maxSafeValue: 80 }
      ];
      sensors = await IoTSensor.insertMany(defaultSensors.map(s => ({ ...s, institutionId })) as any) as any;
    }

    return sendSuccess(res, 'IoT sensors fetched successfully', sensors);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch sensors', null, 500);
  }
};

export const ingestTelemetry = async (req: Request, res: Response) => {
  try {
    const institutionId = (req as any).institutionId;
    const { sensorId, value, unit, metadata } = req.body;

    if (!sensorId) {
      return sendError(res, 'sensorId is required', null, 400);
    }

    let sensor = await IoTSensor.findOne({ sensorId });
    if (!sensor) {
      // Auto register sensor if not present
      sensor = await IoTSensor.create({
        sensorId,
        name: `${sensorId} Live Node`,
        type: sensorId.includes('TEMP') ? 'Temperature' : sensorId.includes('PWR') ? 'Electricity' : sensorId.includes('WTR') ? 'Water Flow' : sensorId.includes('AQI') ? 'Air Quality (AQI)' : 'Occupancy',
        building: 'Tech Hub Main',
        floor: 'Ground',
        currentValue: value || 22.0,
        unit: unit || '°C',
        status: 'Online',
        minSafeValue: 10,
        maxSafeValue: 50,
        institutionId: institutionId && String(institutionId).match(/^[0-9a-fA-F]{24}$/) ? institutionId : undefined
      });
    }

    // Update sensor state
    sensor.currentValue = value;
    sensor.lastHeartbeat = new Date();
    if (value > sensor.maxSafeValue || value < sensor.minSafeValue) {
      sensor.status = 'Alert';
    } else {
      sensor.status = 'Online';
    }
    await sensor.save();

    // Log time-series telemetry
    const log = await TelemetryLog.create({
      sensorId,
      sensorType: sensor.type,
      value,
      unit: unit || sensor.unit,
      metadata: metadata || { gateway: 'MQTT-TLS-Bridge-v2' },
      institutionId: institutionId && String(institutionId).match(/^[0-9a-fA-F]{24}$/) ? institutionId : undefined
    });

    return sendSuccess(res, 'Telemetry data point ingested', { sensor, log }, 201);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to ingest telemetry', null, 500);
  }
};

// ─── 2. Sustainability & Carbon Metrics ────────────────────────────────────

export const getSustainabilitySnapshot = async (req: Request, res: Response) => {
  try {
    const institutionId = (req as any).institutionId;
    const filter: any = institutionId ? { institutionId } : {};
    let snapshot = await SustainabilitySnapshot.findOne(filter).sort({ createdAt: -1 });

    if (!snapshot) {
      snapshot = await SustainabilitySnapshot.create({
        monthYear: 'August 2026',
        totalElectricityKwh: 48200,
        solarGeneratedKwh: 16400,
        solarContributionPct: 34.0,
        totalWaterKiloLiters: 1240,
        recycledWaterPct: 42.5,
        wasteDivertedKg: 3820,
        co2EmissionsTonnes: 28.4,
        co2ReductionPctFromLastMonth: 12.4,
        energyReductionPct: 8.7,
        waterReductionPct: 5.2,
        paperSavedSheets: 84000,
        greenCampusScore: 92.4,
        aiForecast: {
          nextMonthElectricityKwh: 46100,
          nextMonthWaterKiloLiters: 1190,
          estimatedSolarGenerationKwh: 17200,
          recommendedActions: [
            'Shift chiller load in Tech Hub to solar peak hours (11 AM – 2 PM) to save ~1,200 kWh/month.',
            'Expand Greywater recycling in Hostel Block C to boost water reuse to 50%.',
            'Enforce digital exam paperless submission policy to save 35,000 additional sheets.'
          ]
        },
        institutionId
      });
    }

    return sendSuccess(res, 'Sustainability snapshot fetched', snapshot);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch sustainability data', null, 500);
  }
};

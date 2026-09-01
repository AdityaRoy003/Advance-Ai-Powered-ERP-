import type { Request, Response } from 'express';
import Timetable from './timetable.model.js';
import { sendSuccess, sendError } from '../../core/response/apiResponse.js';

export const listTimetable = async (req: Request, res: Response) => {
  try {
    const { dayOfWeek, department, semester, teacherName, room } = req.query;
    const filter: any = {};

    if (dayOfWeek) filter.dayOfWeek = String(dayOfWeek);
    if (department) filter.department = String(department);
    if (semester) filter.semester = Number(semester);
    if (teacherName) filter.teacherName = { $regex: String(teacherName), $options: 'i' };
    if (room) filter.room = String(room);

    const schedule = await Timetable.find(filter).sort({ dayOfWeek: 1, startTime: 1 }).lean();
    return sendSuccess(res, 'Timetable schedule fetched successfully', schedule, 200);
  } catch (err: any) {
    return sendError(res, err.message || 'Failed to list timetable', 500);
  }
};

export const createTimetableSlot = async (req: Request, res: Response) => {
  try {
    const { courseCode, subjectTitle, teacherName, room, dayOfWeek, startTime, endTime, department, semester, batch } = req.body;

    if (!courseCode || !subjectTitle || !teacherName || !room || !dayOfWeek || !startTime || !endTime) {
      return sendError(res, 'Course code, subject, teacher, room, day, start, and end times are required', 400);
    }

    // Room Conflict Check
    const roomConflict = await Timetable.findOne({
      dayOfWeek,
      room,
      $or: [
        { startTime: { $lt: endTime }, endTime: { $gt: startTime } }
      ]
    });

    if (roomConflict) {
      return sendError(res, `Room ${room} is already booked on ${dayOfWeek} between ${roomConflict.startTime} - ${roomConflict.endTime} for ${roomConflict.subjectTitle}`, 409);
    }

    // Teacher Conflict Check
    const teacherConflict = await Timetable.findOne({
      dayOfWeek,
      teacherName,
      $or: [
        { startTime: { $lt: endTime }, endTime: { $gt: startTime } }
      ]
    });

    if (teacherConflict) {
      return sendError(res, `Teacher ${teacherName} is already assigned on ${dayOfWeek} between ${teacherConflict.startTime} - ${teacherConflict.endTime}`, 409);
    }

    const slot = await Timetable.create({
      courseCode: courseCode.toUpperCase(),
      subjectTitle,
      teacherName,
      room,
      dayOfWeek,
      startTime,
      endTime,
      department: department || 'Computer Science',
      semester: semester || 1,
      batch
    });

    return sendSuccess(res, 'Timetable slot created successfully', slot, 201);
  } catch (err: any) {
    return sendError(res, err.message || 'Failed to create timetable slot', 500);
  }
};

export const deleteTimetableSlot = async (req: Request, res: Response) => {
  try {
    const slot = await Timetable.findByIdAndDelete(req.params.id);
    if (!slot) return sendError(res, 'Timetable slot not found', 404);
    return sendSuccess(res, 'Timetable slot removed successfully', { id: req.params.id }, 200);
  } catch (err: any) {
    return sendError(res, err.message || 'Failed to delete timetable slot', 500);
  }
};

export default { listTimetable, createTimetableSlot, deleteTimetableSlot };

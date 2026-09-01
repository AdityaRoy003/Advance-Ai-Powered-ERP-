export const Permissions = {
  STUDENT_CREATE: 'student.create',
  STUDENT_READ: 'student.read',
  STUDENT_UPDATE: 'student.update',
  STUDENT_DELETE: 'student.delete',
  TEACHER_CREATE: 'teacher.create',
  TEACHER_UPDATE: 'teacher.update',
  LIBRARY_ISSUE: 'library.issue',
  FEE_COLLECT: 'fee.collect',
  EXAM_PUBLISH: 'exam.publish',
  ATTENDANCE_MARK: 'attendance.mark',
  AI_CHAT: 'ai.chat',
  AI_ANALYTICS: 'ai.analytics'
} as const;

export type Permission = (typeof Permissions)[keyof typeof Permissions];

export default Permissions;

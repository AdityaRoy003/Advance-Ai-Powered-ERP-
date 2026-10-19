import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

apiClient.interceptors.request.use((config) => {
  const savedUser = localStorage.getItem('eduverse_user');
  if (savedUser) {
    try {
      const parsed = JSON.parse(savedUser);
      if (parsed?.token && !parsed.token.startsWith('demo-')) {
        config.headers.Authorization = `Bearer ${parsed.token}`;
      } else {
        config.headers.Authorization = 'Bearer demo-superadmin-token';
      }
    } catch (e) {
      console.error('Error parsing token from storage', e);
      config.headers.Authorization = 'Bearer demo-superadmin-token';
    }
  } else {
    config.headers.Authorization = 'Bearer demo-superadmin-token';
  }
  return config;
});

export const AuthAPI = {
  forgotPassword: async (email) => {
    const res = await apiClient.post('/auth/forgot-password', { email });
    return res.data;
  },
  resetPassword: async ({ email, otp, newPassword }) => {
    const res = await apiClient.post('/auth/reset-password', { email, otp, newPassword });
    return res.data;
  },
  updateProfile: async (profileData) => {
    const res = await apiClient.put('/auth/profile', profileData);
    return res.data?.data || res.data;
  }
};

export const UsersAPI = {
  getAll: async (params = {}) => {
    try {
      const res = await apiClient.get('/users', { params });
      return res.data?.data || res.data || [];
    } catch (err) {
      return [];
    }
  },
  create: async (userData) => {
    const res = await apiClient.post('/users', userData);
    return res.data?.data || res.data;
  },
  update: async (id, userData) => {
    const res = await apiClient.put(`/users/${id}`, userData);
    return res.data?.data || res.data;
  },
  getById: async (id) => {
    const res = await apiClient.get(`/users/${id}`);
    return res.data?.data || res.data;
  },
  updateStatus: async (id, status) => {
    const res = await apiClient.patch(`/users/${id}/status`, { status });
    return res.data?.data || res.data;
  },
  resetPassword: async (id, password) => {
    const res = await apiClient.patch(`/users/${id}/password`, { password });
    return res.data?.data || res.data;
  },
  delete: async (id) => {
    const res = await apiClient.delete(`/users/${id}`);
    return res.data;
  },
  restore: async (id) => {
    const res = await apiClient.post(`/users/${id}/restore`);
    return res.data?.data || res.data;
  },
  bulkImport: async (usersArray) => {
    const res = await apiClient.post('/users/bulk-import', { users: usersArray });
    return res.data;
  }
};

export const CoursesAPI = {
  getAll: async (params = {}) => {
    try {
      const res = await apiClient.get('/courses', { params });
      return res.data?.data || res.data || [];
    } catch (err) {
      return [];
    }
  },
  create: async (courseData) => {
    const res = await apiClient.post('/courses', courseData);
    return res.data?.data || res.data;
  },
  update: async (id, courseData) => {
    const res = await apiClient.put(`/courses/${id}`, courseData);
    return res.data?.data || res.data;
  },
  delete: async (id) => {
    const res = await apiClient.delete(`/courses/${id}`);
    return res.data;
  }
};

export const TimetableAPI = {
  getSchedule: async (params = {}) => {
    try {
      const res = await apiClient.get('/timetable', { params });
      return res.data?.data || res.data || [];
    } catch (err) {
      return [];
    }
  },
  createSlot: async (slotData) => {
    const res = await apiClient.post('/timetable', slotData);
    return res.data?.data || res.data;
  },
  deleteSlot: async (id) => {
    const res = await apiClient.delete(`/timetable/${id}`);
    return res.data;
  }
};

export const PlacementAPI = {
  getDrives: async () => {
    try {
      const res = await apiClient.get('/placement');
      return res.data?.data || res.data || [];
    } catch (err) {
      return [];
    }
  },
  createDrive: async (driveData) => {
    const res = await apiClient.post('/placement', driveData);
    return res.data?.data || res.data;
  },
  apply: async (id) => {
    const res = await apiClient.post(`/placement/${id}/apply`);
    return res.data?.data || res.data;
  }
};

export const DepartmentsAPI = {
  getAll: async () => {
    try {
      const res = await apiClient.get('/departments');
      return res.data?.data || res.data || [];
    } catch (err) {
      return [];
    }
  },
  create: async (deptData) => {
    const res = await apiClient.post('/departments', deptData);
    return res.data?.data || res.data;
  }
};

export const StudentsAPI = {
  getAll: async () => {
    try {
      const res = await apiClient.get('/students');
      return res.data?.data?.students || res.data?.data || [];
    } catch {
      return [];
    }
  },
  getMyProfile: async () => {
    try {
      const res = await apiClient.get('/students/me');
      return res.data?.data || res.data;
    } catch {
      return null;
    }
  },
  getById: async (id) => {
    try {
      const res = await apiClient.get(`/students/${id}`);
      return res.data?.data || res.data;
    } catch {
      return null;
    }
  }
};

export const ExamsAPI = {
  getAll: async () => {
    try {
      const res = await apiClient.get('/exams');
      return res.data?.data?.exams || res.data?.data || res.data || [];
    } catch (err) {
      return [];
    }
  },
  getResults: async (studentId) => {
    try {
      const res = await apiClient.get(`/exams/results/${studentId}`);
      return res.data?.data?.grades || res.data?.data || res.data || [];
    } catch (err) {
      return [];
    }
  }
};

export const AttendanceAPI = {
  getSummary: async () => {
    try {
      const res = await apiClient.get('/attendance');
      return res.data?.data || res.data || { overallPercentage: 0, totalClasses: 0, presentClasses: 0, absentClasses: 0, breakdown: [] };
    } catch (err) {
      return { overallPercentage: 0, totalClasses: 0, presentClasses: 0, absentClasses: 0, breakdown: [] };
    }
  }
};

export const FinanceAPI = {
  getOverview: async () => {
    try {
      const res = await apiClient.get('/finance');
      return res.data?.data || res.data || { totalRevenue: '₹0', pendingFees: '₹0', dispatchedSalaries: '₹0', recentTransactions: [] };
    } catch (err) {
      return { totalRevenue: '₹0', pendingFees: '₹0', dispatchedSalaries: '₹0', recentTransactions: [] };
    }
  }
};

export const LibraryAPI = {
  getBooks: async () => {
    try {
      const res = await apiClient.get('/library');
      return res.data?.data || res.data || [];
    } catch (err) {
      return [];
    }
  },
  getAll: async () => {
    try {
      const res = await apiClient.get('/library');
      return res.data?.data || res.data || [];
    } catch (err) {
      return [];
    }
  }
};

export const HostelAPI = {
  getRooms: async () => {
    try {
      const res = await apiClient.get('/hostel');
      return res.data?.data || res.data || [];
    } catch (err) {
      return [];
    }
  }
};

export const TransportAPI = {
  getRoutes: async () => {
    try {
      const res = await apiClient.get('/transport');
      return res.data?.data || res.data || [];
    } catch (err) {
      return [];
    }
  }
};

export const CybersecurityAPI = {
  getAuditLogs: async () => {
    try {
      const res = await apiClient.get('/cybersecurity');
      return res.data?.data || res.data || [];
    } catch (err) {
      return [];
    }
  }
};

export const NotificationsAPI = {
  getAll: async (params = {}) => {
    try {
      const res = await apiClient.get('/notifications', { params });
      return res.data?.data || res.data || [];
    } catch (err) {
      return [];
    }
  },
  create: async (notifData) => {
    const res = await apiClient.post('/notifications', notifData);
    return res.data?.data || res.data;
  },
  markAsRead: async (id, userId) => {
    const res = await apiClient.patch(`/notifications/${id}/read`, { userId });
    return res.data;
  },
  markAllAsRead: async (userId) => {
    const res = await apiClient.patch('/notifications/mark-all-read', { userId });
    return res.data;
  },
  delete: async (id) => {
    const res = await apiClient.delete(`/notifications/${id}`);
    return res.data;
  }
};

export const InstitutionsAPI = {
  getAll: async (params = {}) => {
    try {
      const res = await apiClient.get('/institutions', { params });
      return res.data?.data || res.data || [];
    } catch (err) {
      return [];
    }
  },
  get: async (id) => {
    try {
      const res = await apiClient.get(`/institutions/${id}`);
      return res.data?.data || res.data;
    } catch (err) {
      return null;
    }
  },
  create: async (data) => {
    const res = await apiClient.post('/institutions', data);
    return res.data?.data || res.data;
  },
  update: async (id, data) => {
    const res = await apiClient.put(`/institutions/${id}`, data);
    return res.data?.data || res.data;
  },
  suspend: async (id) => {
    const res = await apiClient.patch(`/institutions/${id}/suspend`);
    return res.data?.data || res.data;
  },
  reactivate: async (id) => {
    const res = await apiClient.patch(`/institutions/${id}/reactivate`);
    return res.data?.data || res.data;
  },
  delete: async (id) => {
    const res = await apiClient.delete(`/institutions/${id}`);
    return res.data;
  },
  getUsers: async (id, params = {}) => {
    try {
      const res = await apiClient.get(`/institutions/${id}/users`, { params });
      return res.data?.data || res.data || [];
    } catch (err) {
      return [];
    }
  }
};

export const LMSAPI = {
  getCourses: async () => {
    try {
      const res = await apiClient.get('/lms/courses');
      return res.data?.data || res.data || [];
    } catch (err) {
      return [];
    }
  },
  getCourse: async (id) => {
    try {
      const res = await apiClient.get(`/lms/courses/${id}`);
      return res.data?.data || res.data;
    } catch (err) {
      return null;
    }
  },
  createCourse: async (data) => {
    const res = await apiClient.post('/lms/courses', data);
    return res.data?.data || res.data;
  },
  completeLesson: async (courseId, studentId, lessonTitle) => {
    const res = await apiClient.post(`/lms/courses/${courseId}/complete-lesson`, { studentId, lessonTitle });
    return res.data?.data || res.data;
  },
  getAdaptiveRecommendations: async (studentId) => {
    try {
      const res = await apiClient.get(`/lms/adaptive-recommendations/${studentId}`);
      return res.data?.data || res.data;
    } catch (err) {
      return null;
    }
  }
};

export const ResearchAPI = {
  getAll: async () => {
    try {
      const res = await apiClient.get('/research');
      return res.data?.data || res.data || [];
    } catch (err) {
      return [];
    }
  },
  create: async (data) => {
    const res = await apiClient.post('/research', data);
    return res.data?.data || res.data;
  },
  runLiteratureDiscovery: async (topic) => {
    const res = await apiClient.post('/research/literature-discovery', { topic });
    return res.data?.data || res.data;
  }
};

export const InnovationAPI = {
  getHackathons: async () => {
    try {
      const res = await apiClient.get('/innovation/hackathons');
      return res.data?.data || res.data || [];
    } catch (err) {
      return [];
    }
  },
  createHackathon: async (data) => {
    const res = await apiClient.post('/innovation/hackathons', data);
    return res.data?.data || res.data;
  },
  matchTeammates: async (studentSkills, targetDomain) => {
    const res = await apiClient.post('/innovation/match-teammates', { studentSkills, targetDomain });
    return res.data?.data || res.data;
  },
  bookMentor: async (bookingData) => {
    const res = await apiClient.post('/innovation/mentorship/book', bookingData);
    return res.data?.data || res.data;
  }
};

export const AccreditationAPI = {
  getReport: async () => {
    try {
      const res = await apiClient.get('/accreditation');
      return res.data?.data || res.data;
    } catch (err) {
      return null;
    }
  },
  updateScore: async (id, data) => {
    const res = await apiClient.put(`/accreditation/${id}`, data);
    return res.data?.data || res.data;
  }
};

export const DocumentsAPI = {
  getAll: async (studentId) => {
    try {
      const res = await apiClient.get('/documents', { params: { studentId } });
      return res.data?.data || res.data || [];
    } catch (err) {
      return [];
    }
  },
  issue: async (data) => {
    const res = await apiClient.post('/documents', data);
    return res.data?.data || res.data;
  },
  verifyHash: async (txHash) => {
    const res = await apiClient.get(`/documents/verify/${txHash}`);
    return res.data?.data || res.data;
  }
};

export const CampusAPI = {
  getDigitalTwin: async () => {
    try {
      const res = await apiClient.get('/campus/digital-twin');
      return res.data?.data || res.data || [];
    } catch (err) {
      return [];
    }
  },
  getClinicRecords: async () => {
    try {
      const res = await apiClient.get('/campus/health/clinic-records');
      return res.data?.data || res.data || [];
    } catch (err) {
      return [];
    }
  },
  createClinicRecord: async (data) => {
    const res = await apiClient.post('/campus/health/clinic-record', data);
    return res.data?.data || res.data;
  },
  logCVDetection: async (data) => {
    const res = await apiClient.post('/campus/cv/detection', data);
    return res.data?.data || res.data;
  }
};

export const AIEngineAPI = {
  gatewayQuery: async (query, pipeline, userRole) => {
    const res = await apiClient.post('/ai/gateway', { query, pipeline, userRole });
    return res.data?.data || res.data;
  },
  inspectFirewall: async (prompt) => {
    const res = await apiClient.post('/ai/firewall/inspect', { prompt });
    return res.data?.data || res.data;
  },
  getStudentRiskRoster: async () => {
    try {
      const res = await apiClient.get('/ai/student-risk-engine');
      return res.data?.data || res.data;
    } catch (err) {
      return null;
    }
  },
  getCareerAnalysis: async (currentSkills) => {
    const res = await apiClient.post('/ai/career-engine', { currentSkills });
    return res.data?.data || res.data;
  },
  sendVoiceCommand: async (transcript) => {
    const res = await apiClient.post('/ai/voice-command', { transcript });
    return res.data?.data || res.data;
  }
};

export const FacilitiesAPI = {
  getMessMenu: async () => {
    try {
      const res = await apiClient.get('/facilities/mess/menu');
      return res.data?.data || res.data || [];
    } catch { return []; }
  },
  markMealAttendance: async (data) => {
    const res = await apiClient.post('/facilities/mess/attendance', data);
    return res.data?.data || res.data;
  },
  getMessWasteStats: async () => {
    try {
      const res = await apiClient.get('/facilities/mess/waste-stats');
      return res.data?.data || res.data || { logs: [], aiForecast: null };
    } catch { return { logs: [], aiForecast: null }; }
  },
  getMaintenanceTickets: async () => {
    try {
      const res = await apiClient.get('/facilities/maintenance/tickets');
      return res.data?.data || res.data || [];
    } catch { return []; }
  },
  createMaintenanceTicket: async (data) => {
    const res = await apiClient.post('/facilities/maintenance/tickets', data);
    return res.data?.data || res.data;
  },
  updateTicketStatus: async (id, data) => {
    const res = await apiClient.patch(`/facilities/maintenance/tickets/${id}`, data);
    return res.data?.data || res.data;
  },
  getInventoryItems: async () => {
    try {
      const res = await apiClient.get('/facilities/inventory/items');
      return res.data?.data || res.data || [];
    } catch { return []; }
  },
  getProcurementRequests: async () => {
    try {
      const res = await apiClient.get('/facilities/procurement/requests');
      return res.data?.data || res.data || [];
    } catch { return []; }
  },
  createProcurementRequest: async (data) => {
    const res = await apiClient.post('/facilities/procurement/requests', data);
    return res.data?.data || res.data;
  }
};

export const IoTAPI = {
  getSensors: async () => {
    try {
      const res = await apiClient.get('/iot/sensors');
      return res.data?.data || res.data || [];
    } catch { return []; }
  },
  ingestTelemetry: async (data) => {
    const res = await apiClient.post('/iot/telemetry/ingest', data);
    return res.data?.data || res.data;
  },
  getSustainability: async () => {
    try {
      const res = await apiClient.get('/iot/sustainability');
      return res.data?.data || res.data || null;
    } catch { return null; }
  }
};

export const AutomationAPI = {
  getWorkflows: async () => {
    try {
      const res = await apiClient.get('/automation/workflows');
      return res.data?.data || res.data || [];
    } catch { return []; }
  },
  createWorkflow: async (data) => {
    const res = await apiClient.post('/automation/workflows', data);
    return res.data?.data || res.data;
  },
  toggleWorkflow: async (id) => {
    const res = await apiClient.patch(`/automation/workflows/${id}/toggle`);
    return res.data?.data || res.data;
  },
  getIntegrations: async () => {
    try {
      const res = await apiClient.get('/automation/integrations');
      return res.data?.data || res.data || [];
    } catch { return []; }
  },
  toggleIntegration: async (appKey) => {
    const res = await apiClient.patch(`/automation/integrations/${appKey}/toggle`);
    return res.data?.data || res.data;
  },
  getApiKeys: async () => {
    try {
      const res = await apiClient.get('/automation/developer/keys');
      return res.data?.data || res.data || [];
    } catch { return []; }
  },
  createApiKey: async (data) => {
    const res = await apiClient.post('/automation/developer/keys', data);
    return res.data?.data || res.data;
  }
};

export const ExecutiveAPI = {
  getBriefing: async () => {
    try {
      const res = await apiClient.get('/executive/briefing');
      return res.data?.data || res.data || null;
    } catch { return null; }
  },
  getWhatChanged: async () => {
    try {
      const res = await apiClient.get('/executive/what-changed');
      return res.data?.data || res.data || null;
    } catch { return null; }
  },
  simulate: async (data) => {
    const res = await apiClient.post('/executive/simulate', data);
    return res.data?.data || res.data;
  },
  getRecommendations: async () => {
    try {
      const res = await apiClient.get('/executive/recommendations');
      return res.data?.data || res.data || [];
    } catch { return []; }
  }
};

export const SystemOpsAPI = {
  getModels: async () => {
    try {
      const res = await apiClient.get('/system-ops/mlops/models');
      return res.data?.data || res.data || [];
    } catch { return []; }
  },
  rollbackModel: async (id) => {
    const res = await apiClient.patch(`/system-ops/mlops/models/${id}/rollback`);
    return res.data?.data || res.data;
  },
  getITDiagnostics: async () => {
    try {
      const res = await apiClient.get('/system-ops/it/diagnostics');
      return res.data?.data || res.data || { incidents: [], systemHealth: null };
    } catch { return { incidents: [], systemHealth: null }; }
  },
  getPrivacyConsent: async () => {
    try {
      const res = await apiClient.get('/system-ops/privacy/consent');
      return res.data?.data || res.data || null;
    } catch { return null; }
  },
  updatePrivacyConsent: async (data) => {
    const res = await apiClient.patch('/system-ops/privacy/consent', data);
    return res.data?.data || res.data;
  },
  requestDataExport: async () => {
    const res = await apiClient.post('/system-ops/privacy/export');
    return res.data?.data || res.data;
  }
};

export const SocialGamificationAPI = {
  getClubs: async () => {
    try {
      const res = await apiClient.get('/social/clubs');
      return res.data?.data || res.data || [];
    } catch { return []; }
  },
  getPosts: async () => {
    try {
      const res = await apiClient.get('/social/posts');
      return res.data?.data || res.data || [];
    } catch { return []; }
  },
  createPost: async (data) => {
    const res = await apiClient.post('/social/posts', data);
    return res.data?.data || res.data;
  },
  getGamificationProfile: async () => {
    try {
      const res = await apiClient.get('/social/gamification/profile');
      return res.data?.data || res.data || { profile: null, leaderboard: [] };
    } catch { return { profile: null, leaderboard: [] }; }
  }
};

export const PolicySimulatorAPI = {
  simulate: async (data) => {
    const res = await apiClient.post('/operations/policy/simulate', data);
    return res.data?.data || res.data;
  },
  getVersions: async () => {
    try {
      const res = await apiClient.get('/operations/policy/versions');
      return res.data?.data || res.data || [];
    } catch { return []; }
  },
  saveVersion: async (data) => {
    const res = await apiClient.post('/operations/policy/versions', data);
    return res.data?.data || res.data;
  },
  rollback: async (versionId) => {
    const res = await apiClient.post(`/operations/policy/rollback/${versionId}`);
    return res.data?.data || res.data;
  }
};

export const OperationsAPI = {
  // Student & Academic
  getLifecycle: async () => {
    try {
      const res = await apiClient.get('/operations/lifecycle');
      return res.data?.data || res.data || [];
    } catch { return []; }
  },
  createLifecycle: async (data) => {
    const res = await apiClient.post('/operations/lifecycle', data);
    return res.data?.data || res.data;
  },
  getTransfers: async () => {
    try {
      const res = await apiClient.get('/operations/transfers');
      return res.data?.data || res.data || [];
    } catch { return []; }
  },
  requestTransfer: async (data) => {
    const res = await apiClient.post('/operations/transfers', data);
    return res.data?.data || res.data;
  },
  getEmergencyContacts: async () => {
    try {
      const res = await apiClient.get('/operations/emergency-contacts');
      return res.data?.data || res.data || [];
    } catch { return []; }
  },
  getDocuments: async () => {
    try {
      const res = await apiClient.get('/operations/documents');
      return res.data?.data || res.data || [];
    } catch { return []; }
  },
  getCalendar: async () => {
    try {
      const res = await apiClient.get('/operations/calendar');
      return res.data?.data || res.data || [];
    } catch { return []; }
  },
  getCertificates: async () => {
    try {
      const res = await apiClient.get('/operations/certificates');
      return res.data?.data || res.data || [];
    } catch { return []; }
  },
  generateCertificate: async (data) => {
    const res = await apiClient.post('/operations/certificates', data);
    return res.data?.data || res.data;
  },

  // Finance & Admin
  getAdjustments: async () => {
    try {
      const res = await apiClient.get('/operations/finance/adjustments');
      return res.data?.data || res.data || [];
    } catch { return []; }
  },
  createAdjustment: async (data) => {
    const res = await apiClient.post('/operations/finance/adjustments', data);
    return res.data?.data || res.data;
  },
  getReceipts: async () => {
    try {
      const res = await apiClient.get('/operations/finance/receipts');
      return res.data?.data || res.data || [];
    } catch { return []; }
  },
  createReceipt: async (data) => {
    const res = await apiClient.post('/operations/finance/receipts', data);
    return res.data?.data || res.data;
  },
  getVendorBills: async () => {
    try {
      const res = await apiClient.get('/operations/finance/bills');
      return res.data?.data || res.data || [];
    } catch { return []; }
  },
  getCashbook: async () => {
    try {
      const res = await apiClient.get('/operations/finance/cashbook');
      return res.data?.data || res.data || [];
    } catch { return []; }
  },
  getNoDues: async () => {
    try {
      const res = await apiClient.get('/operations/no-dues');
      return res.data?.data || res.data || [];
    } catch { return []; }
  },

  // Faculty & Staff
  getSubstitutes: async () => {
    try {
      const res = await apiClient.get('/operations/faculty/substitutes');
      return res.data?.data || res.data || [];
    } catch { return []; }
  },
  assignSubstitute: async (data) => {
    const res = await apiClient.post('/operations/faculty/substitutes', data);
    return res.data?.data || res.data;
  },
  getFacultyWorkload: async () => {
    try {
      const res = await apiClient.get('/operations/faculty/workload');
      return res.data?.data || res.data || [];
    } catch { return []; }
  },
  getStaffLifecycle: async () => {
    try {
      const res = await apiClient.get('/operations/staff/lifecycle');
      return res.data?.data || res.data || [];
    } catch { return []; }
  },

  // Communication
  sendAnnouncement: async (data) => {
    const res = await apiClient.post('/operations/communication/announcements', data);
    return res.data?.data || res.data;
  },
  getDispatchLogs: async () => {
    try {
      const res = await apiClient.get('/operations/communication/dispatch-logs');
      return res.data?.data || res.data || [];
    } catch { return []; }
  },
  retryDispatch: async (messageId) => {
    const res = await apiClient.post(`/operations/communication/retry/${messageId}`);
    return res.data?.data || res.data;
  },
  getEventRegistrations: async () => {
    try {
      const res = await apiClient.get('/operations/events/registrations');
      return res.data?.data || res.data || [];
    } catch { return []; }
  },

  // Data & System Consistency
  validateImport: async (data) => {
    const res = await apiClient.post('/operations/data/validate-import', data);
    return res.data?.data || res.data;
  },
  getDuplicates: async () => {
    try {
      const res = await apiClient.get('/operations/data/duplicates');
      return res.data?.data || res.data || [];
    } catch { return []; }
  },
  resolveDuplicate: async (duplicateId, resolutionAction) => {
    const res = await apiClient.patch(`/operations/data/duplicates/${duplicateId}`, { resolutionAction });
    return res.data?.data || res.data;
  },
  getRecycleBin: async () => {
    try {
      const res = await apiClient.get('/operations/data/recycle-bin');
      return res.data?.data || res.data || [];
    } catch { return []; }
  },
  restoreRecord: async (id) => {
    const res = await apiClient.post(`/operations/data/restore/${id}`);
    return res.data?.data || res.data;
  },
  runTenantIsolationTest: async () => {
    const res = await apiClient.get('/operations/data/tenant-isolation-test');
    return res.data?.data || res.data;
  }
};

export default apiClient;



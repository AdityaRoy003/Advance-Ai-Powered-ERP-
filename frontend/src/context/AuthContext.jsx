import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const API_URL = 'http://localhost:5000/api/v1';

// Predefined demo credential accounts — each email maps to a full user profile
const demoAccounts = {
  'superadmin@eduverse.com': {
    firstName: 'Super',
    lastName: 'Admin',
    role: 'SUPER_ADMIN',
    roleName: 'Super Admin',
    designation: 'Executive Board Director & CIO',
    department: 'Executive Governance & Security',
    accessLevel: 'Full Access',
    avatarColor: 'from-violet-600 to-indigo-600',
    permissions: ['User Management', 'Roles Configuration', 'Finance Control', 'SIEM Logs Audit', 'Settings Override', 'Reports Generation', 'Department Management', 'All System Modules']
  },
  'admin@eduverse.com': {
    firstName: 'Aditya',
    lastName: 'Roy',
    role: 'ADMIN',
    roleName: 'Administrator',
    designation: 'Academic Operations Manager',
    department: 'Academic Administration',
    accessLevel: 'Full Access',
    avatarColor: 'from-indigo-500 to-purple-600',
    permissions: ['User Management', 'Roles Configuration', 'Finance Control', 'SIEM Logs Audit', 'Settings Override', 'Reports Generation', 'Department Management']
  },
  'hr@eduverse.com': {
    firstName: 'Sarah',
    lastName: 'Connor',
    role: 'HR_MANAGER',
    roleName: 'HR Manager',
    designation: 'Head of Human Resources',
    department: 'Human Resources',
    accessLevel: 'Manager Access',
    avatarColor: 'from-emerald-500 to-teal-600',
    permissions: ['View Employees', 'Edit Employees', 'View Payroll', 'Approve Leaves', 'Recruitment Control', 'Reports Generation']
  },
  'employee@eduverse.com': {
    firstName: 'Rahul',
    lastName: 'Sharma',
    role: 'EMPLOYEE',
    roleName: 'Employee',
    designation: 'Software Engineer',
    department: 'Engineering',
    accessLevel: 'Standard Access',
    avatarColor: 'from-pink-500 to-rose-600',
    permissions: ['View Profile', 'Update Profile', 'Apply Leave', 'Download Payslip', 'Chat Access']
  },
  'finance@eduverse.com': {
    firstName: 'Priya',
    lastName: 'Mehta',
    role: 'EMPLOYEE',
    roleName: 'Finance Coordinator',
    designation: 'Senior Finance Analyst',
    department: 'Finance & Accounting',
    accessLevel: 'Standard Access',
    avatarColor: 'from-amber-500 to-orange-600',
    permissions: ['View Payroll', 'Generate Reports', 'View Finance', 'Apply Leave', 'Download Payslip']
  },
  'student@eduverse.com': {
    firstName: 'Aditya',
    lastName: 'Raj',
    role: 'STUDENT',
    roleName: 'Student',
    designation: 'Student (B.Tech CSE)',
    department: 'Computer Science',
    accessLevel: 'Student Access',
    avatarColor: 'from-blue-500 to-cyan-500',
    permissions: ['View Grades', 'View Timetable', 'Library Access', 'Apply Leave']
  },
  'teacher@eduverse.com': {
    firstName: 'Sarah',
    lastName: 'Connor',
    role: 'TEACHER',
    roleName: 'Teacher',
    designation: 'Professor (Machine Learning)',
    department: 'Artificial Intelligence',
    accessLevel: 'Faculty Access',
    avatarColor: 'from-purple-500 to-indigo-500',
    permissions: ['Grade Management', 'Classroom Attendance', 'Syllabus Control', 'View Salary']
  },
  'parent@eduverse.com': {
    firstName: 'Mr.',
    lastName: 'Raj',
    role: 'PARENT',
    roleName: 'Parent',
    designation: 'Guardian',
    department: 'Parent Services',
    accessLevel: 'Guardian Access',
    avatarColor: 'from-teal-500 to-emerald-500',
    permissions: ['View Ward Grades', 'View Ward Attendance', 'Fee Payments', 'Chat with Teachers']
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('eduverse_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user && user.token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [user]);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      // Attempt real backend login
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      const { user: backendUser, tokens } = response.data.data;
      const actualRole = backendUser.role || (email.toLowerCase() === 'superadmin@eduverse.com' ? 'SUPER_ADMIN' : 'EMPLOYEE');
      const originalRole = backendUser.originalRole || (email.toLowerCase() === 'superadmin@eduverse.com' ? 'SUPER_ADMIN' : actualRole);

      const userData = {
        id: backendUser._id || backendUser.id,
        firstName: backendUser.firstName || 'User',
        lastName: backendUser.lastName || '',
        email: (backendUser.email || email).toLowerCase(),
        role: actualRole,
        originalRole: originalRole,
        roleName: actualRole.replace(/_/g, ' '),
        designation: backendUser.designation || (actualRole === 'SUPER_ADMIN' ? 'Super Administrator' : actualRole === 'STUDENT' ? 'Student' : actualRole === 'TEACHER' ? 'Faculty Member' : 'Staff Member'),
        department: backendUser.department || 'General',
        accessLevel: actualRole === 'SUPER_ADMIN' ? 'Full Access' : 'Standard Access',
        avatarColor: 'from-indigo-600 to-purple-600',
        permissions: backendUser.permissions || ['View Profile', 'Apply Leave'],
        token: tokens.accessToken,
        // Multi-tenant: institutionId scopes all data queries
        institutionId: backendUser.institutionId || null
      };

      setUser(userData);
      localStorage.setItem('eduverse_user', JSON.stringify(userData));
      return { success: true, user: userData };
    } catch (err) {
      const errMsg = err?.response?.data?.message || err?.message || 'Invalid email or password.';
      return { success: false, error: errMsg };
    } finally {
      setLoading(false);
    }
  };

  const register = async (firstName, lastName, email, password, role) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_URL}/auth/register`, { firstName, lastName, email, password, role });
      const { user: backendUser, tokens } = response.data.data;

      const userData = {
        id: backendUser._id || backendUser.id,
        firstName: backendUser.firstName,
        lastName: backendUser.lastName,
        email: backendUser.email,
        role: backendUser.role,
        originalRole: backendUser.role,
        roleName: backendUser.role,
        designation: 'Staff Member',
        department: 'General',
        accessLevel: 'Standard Access',
        avatarColor: 'from-indigo-500 to-purple-500',
        permissions: ['View Profile', 'Apply Leave', 'Download Payslip'],
        token: tokens.accessToken
      };

      setUser(userData);
      localStorage.setItem('eduverse_user', JSON.stringify(userData));
      return { success: true, user: userData };
    } catch (err) {
      // Mock register fallback
      const userData = {
        id: 'demo-' + Math.random().toString(36).slice(2, 8),
        firstName,
        lastName,
        email,
        role: role || 'EMPLOYEE',
        originalRole: role || 'EMPLOYEE',
        roleName: role || 'Employee',
        designation: role === 'STUDENT' ? 'Student' : role === 'TEACHER' ? 'Teacher' : 'Staff Member',
        department: role === 'STUDENT' ? 'Computer Science' : 'General',
        accessLevel: 'Standard Access',
        avatarColor: 'from-indigo-500 to-purple-500',
        permissions: ['View Profile', 'Apply Leave', 'Download Payslip'],
        token: 'demo-new-user'
      };
      setUser(userData);
      localStorage.setItem('eduverse_user', JSON.stringify(userData));
      return { success: true, user: userData };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('eduverse_user');
  };

  // Switch role for active session (preserves original admin role for easy return)
  const switchRole = (newRole) => {
    if (!user) return;
    const originalRole = user.originalRole || (user.email?.toLowerCase() === 'superadmin@eduverse.com' ? 'SUPER_ADMIN' : user.role);
    const updated = {
      ...user,
      role: newRole,
      roleName: newRole,
      originalRole: originalRole
    };
    setUser(updated);
    localStorage.setItem('eduverse_user', JSON.stringify(updated));
  };

  const updatePermissions = (updatedPermissions) => {
    if (!user) return;
    const updated = { ...user, permissions: updatedPermissions };
    setUser(updated);
    localStorage.setItem('eduverse_user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout, switchRole, updatePermissions }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

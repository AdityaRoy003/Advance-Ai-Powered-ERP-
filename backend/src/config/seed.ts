import bcrypt from 'bcrypt';
import User from '../modules/users/user.model.js';
import Institution from '../modules/institutions/institution.model.js';

export const seedDatabase = async () => {
  try {
    // 1. Ensure Default Institution exists
    let institution = await Institution.findOne({ code: 'EDUVERSE-MAIN' });
    if (!institution) {
      institution = await Institution.create({
        name: 'EduVerse Main Campus',
        code: 'EDUVERSE-MAIN',
        type: 'university',
        city: 'New Delhi',
        state: 'Delhi',
        country: 'India',
        plan: 'enterprise',
        status: 'active',
        settings: {
          enableHostel: true,
          enableTransport: true,
          enablePlacement: true,
          enableLibrary: true,
          enableFinance: true,
          enableExams: true,
          enableAI: true
        },
        maxUsers: 10000,
        isDeleted: false
      });
    }

    const defaultPassHash = await bcrypt.hash('EduVerse@2026', 10);
    const superAdminPassHash = await bcrypt.hash('SuperAdminSecretPass#2026', 10);

    const defaultUsers = [
      {
        firstName: 'Super',
        lastName: 'Admin',
        email: 'superadmin@eduverse.com',
        phone: '+91 98765 00001',
        passwordHash: superAdminPassHash,
        role: 'SUPER_ADMIN',
        department: 'Executive Governance & Security',
        status: 'active',
        institutionId: institution._id,
        permissions: ['All System Modules', 'User Management', 'Roles Configuration', 'Finance Control', 'SIEM Logs Audit', 'System Override', 'All Access']
      },
      {
        firstName: 'Aditya',
        lastName: 'Roy',
        email: 'admin@eduverse.com',
        phone: '+91 98765 00002',
        passwordHash: defaultPassHash,
        role: 'ADMIN',
        department: 'Academic Administration',
        status: 'active',
        institutionId: institution._id,
        permissions: ['User Management', 'Roles Configuration', 'Finance Control', 'SIEM Logs Audit', 'Settings Override', 'Reports Generation', 'Department Management']
      },
      {
        firstName: 'Dr. Arjun',
        lastName: 'Mehta',
        email: 'teacher@eduverse.com',
        phone: '+91 98765 00003',
        passwordHash: defaultPassHash,
        role: 'TEACHER',
        department: 'Computer Science',
        status: 'active',
        institutionId: institution._id,
        permissions: ['Grade Management', 'Classroom Attendance', 'Syllabus Control', 'View Salary']
      },
      {
        firstName: 'Prof. Rajesh',
        lastName: 'Kumar',
        email: 'prof.kumar@eduverse.com',
        phone: '+91 98765 00004',
        passwordHash: defaultPassHash,
        role: 'TEACHER',
        department: 'Electronics & Communication',
        status: 'active',
        institutionId: institution._id,
        permissions: ['Grade Management', 'Classroom Attendance']
      },
      {
        firstName: 'Dr. Sneha',
        lastName: 'Nair',
        email: 'dr.nair@eduverse.com',
        phone: '+91 98765 00005',
        passwordHash: defaultPassHash,
        role: 'TEACHER',
        department: 'Mechanical Engineering',
        status: 'active',
        institutionId: institution._id,
        permissions: ['Grade Management', 'Classroom Attendance']
      },
      {
        firstName: 'Aditya',
        lastName: 'Raj',
        email: 'student@eduverse.com',
        phone: '+91 98765 00006',
        passwordHash: defaultPassHash,
        role: 'STUDENT',
        department: 'Computer Science',
        status: 'active',
        institutionId: institution._id,
        permissions: ['View Grades', 'View Timetable', 'Library Access', 'Apply Leave']
      },
      {
        firstName: 'Nandan',
        lastName: 'R',
        email: 'student12@gmail.com',
        phone: '+91 98765 00007',
        passwordHash: defaultPassHash,
        role: 'STUDENT',
        department: 'Computer Science',
        status: 'active',
        institutionId: institution._id,
        permissions: ['View Grades', 'View Timetable', 'Library Access']
      },
      {
        firstName: 'Rohit',
        lastName: 'Sharma',
        email: 'rohit.sharma@eduverse.com',
        phone: '+91 98765 00008',
        passwordHash: defaultPassHash,
        role: 'STUDENT',
        department: 'Electronics & Communication',
        status: 'active',
        institutionId: institution._id,
        permissions: ['View Grades', 'View Timetable']
      },
      {
        firstName: 'Ananya',
        lastName: 'Singh',
        email: 'ananya.singh@eduverse.com',
        phone: '+91 98765 00009',
        passwordHash: defaultPassHash,
        role: 'STUDENT',
        department: 'Biotechnology',
        status: 'active',
        institutionId: institution._id,
        permissions: ['View Grades', 'View Timetable']
      },
      {
        firstName: 'Mr. Rajesh',
        lastName: 'Raj',
        email: 'parent@eduverse.com',
        phone: '+91 98765 00010',
        passwordHash: defaultPassHash,
        role: 'PARENT',
        department: 'Parent Advisory Council',
        status: 'active',
        institutionId: institution._id,
        permissions: ['View Ward Grades', 'View Ward Attendance', 'Fee Payments', 'Chat with Teachers']
      },
      {
        firstName: 'Mrs. Sunita',
        lastName: 'Sharma',
        email: 'parent.sharma@eduverse.com',
        phone: '+91 98765 00011',
        passwordHash: defaultPassHash,
        role: 'PARENT',
        department: 'Parent Services',
        status: 'active',
        institutionId: institution._id,
        permissions: ['View Ward Grades', 'View Ward Attendance']
      },
      {
        firstName: 'Sarah',
        lastName: 'Connor',
        email: 'hr@eduverse.com',
        phone: '+91 98765 00012',
        passwordHash: defaultPassHash,
        role: 'HR_MANAGER',
        department: 'Human Resources',
        status: 'active',
        institutionId: institution._id,
        permissions: ['View Employees', 'Edit Employees', 'View Payroll', 'Approve Leaves', 'Recruitment Control']
      },
      {
        firstName: 'Priya',
        lastName: 'Mehta',
        email: 'finance@eduverse.com',
        phone: '+91 98765 00013',
        passwordHash: defaultPassHash,
        role: 'FINANCE_OFFICER',
        department: 'Finance & Accounting',
        status: 'active',
        institutionId: institution._id,
        permissions: ['View Payroll', 'Generate Reports', 'View Finance', 'Apply Leave', 'Download Payslip']
      },
      {
        firstName: 'Vikram',
        lastName: 'Singh',
        email: 'security@eduverse.com',
        phone: '+91 98765 00014',
        passwordHash: defaultPassHash,
        role: 'CYBER_SECURITY_OFFICER',
        department: 'Cybersecurity & SOC',
        status: 'active',
        institutionId: institution._id,
        permissions: ['SIEM Logs Audit', 'AI Firewall Monitoring', 'Audit Timeline']
      },
      {
        firstName: 'Anita',
        lastName: 'Desai',
        email: 'librarian@eduverse.com',
        phone: '+91 98765 00015',
        passwordHash: defaultPassHash,
        role: 'LIBRARIAN',
        department: 'Central Library',
        status: 'active',
        institutionId: institution._id,
        permissions: ['Issue Books', 'Catalog Management', 'Fine Tracking']
      },
      {
        firstName: 'Ramesh',
        lastName: 'Kumar',
        email: 'transport@eduverse.com',
        phone: '+91 98765 00016',
        passwordHash: defaultPassHash,
        role: 'TRANSPORT_MANAGER',
        department: 'Logistics & Fleet',
        status: 'active',
        institutionId: institution._id,
        permissions: ['Bus Route Management', 'Vehicle Tracking', 'Driver Management']
      },
      {
        firstName: 'Deepak',
        lastName: 'Verma',
        email: 'placement@eduverse.com',
        phone: '+91 98765 00017',
        passwordHash: defaultPassHash,
        role: 'PLACEMENT_OFFICER',
        department: 'Career & Placements',
        status: 'active',
        institutionId: institution._id,
        permissions: ['Recruiter Management', 'Job Drives', 'Resume Verification']
      },
      {
        firstName: 'Kavita',
        lastName: 'Sharma',
        email: 'receptionist@eduverse.com',
        phone: '+91 98765 00018',
        passwordHash: defaultPassHash,
        role: 'RECEPTIONIST',
        department: 'Front Desk & Admissions',
        status: 'active',
        institutionId: institution._id,
        permissions: ['Visitor Logs', 'Inquiry Handling', 'Gate Passes']
      },
      {
        firstName: 'Rahul',
        lastName: 'Sharma',
        email: 'employee@eduverse.com',
        phone: '+91 98765 00019',
        passwordHash: defaultPassHash,
        role: 'EMPLOYEE',
        department: 'IT & Infrastructure',
        status: 'active',
        institutionId: institution._id,
        permissions: ['View Profile', 'Apply Leave', 'Download Payslip']
      },
      {
        firstName: 'Dev',
        lastName: 'Patel',
        email: 'dev.patel@eduverse.com',
        phone: '+91 98765 00020',
        passwordHash: defaultPassHash,
        role: 'STUDENT',
        department: 'Computer Science',
        status: 'suspended', // Demonstrates a real suspended account in the system!
        institutionId: institution._id,
        permissions: []
      }
    ];

    for (const u of defaultUsers) {
      await User.findOneAndUpdate(
        { email: u.email.toLowerCase() },
        {
          $set: {
            firstName: u.firstName,
            lastName: u.lastName,
            phone: u.phone,
            passwordHash: u.passwordHash,
            role: u.role,
            department: u.department,
            status: u.status,
            institutionId: u.institutionId,
            permissions: u.permissions,
            isDeleted: false,
            loginAttempts: 0
          }
        },
        { upsert: true, new: true }
      );
    }

    console.log(`✅ Seeded ${defaultUsers.length} enterprise users into MongoDB successfully.`);
  } catch (error) {
    console.error('Error seeding accounts:', error);
  }
};

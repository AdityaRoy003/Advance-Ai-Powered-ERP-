import bcrypt from 'bcrypt';
import User from '../modules/users/user.model.js';

export const seedDatabase = async () => {
  try {
    const hashedSuperAdminPass = await bcrypt.hash('SuperAdminSecretPass#2026', 10);

    // Upsert Super Admin User Account so credentials always work reliably
    await User.findOneAndUpdate(
      { email: 'superadmin@eduverse.com' },
      {
        firstName: 'Super',
        lastName: 'Admin',
        email: 'superadmin@eduverse.com',
        passwordHash: hashedSuperAdminPass,
        role: 'SUPER_ADMIN',
        status: 'active',
        department: 'Executive Board & Security',
        loginAttempts: 0,
        lockUntil: null,
        isDeleted: false,
        permissions: ['User Management', 'Roles Configuration', 'Finance Control', 'SIEM Logs Audit', 'System Override', 'All Access']
      },
      { upsert: true, new: true }
    );

    console.log('✅ Super Admin account verified & active (superadmin@eduverse.com).');
  } catch (error) {
    console.error('Error seeding superadmin account:', error);
  }
};

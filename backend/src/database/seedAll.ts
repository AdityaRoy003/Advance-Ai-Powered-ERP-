/**
 * Seed script: Creates the Super Admin and default institution if they don't exist.
 * Run with: npx tsx src/database/seedAll.ts
 */
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/eduverse';

// ─── Minimal inline models to avoid circular dep ────────────────────────────

const UserSchema = new mongoose.Schema({
  firstName: String, lastName: String, email: { type: String, unique: true },
  passwordHash: String, role: String, status: String, emailVerified: Boolean,
  permissions: [String], institutionId: mongoose.Schema.Types.ObjectId,
  loginAttempts: { type: Number, default: 0 }, lockUntil: Date, isDeleted: Boolean
}, { timestamps: true });

const InstitutionSchema = new mongoose.Schema({
  name: String, code: { type: String, unique: true }, type: String,
  country: String, city: String, state: String, plan: String,
  status: String, maxUsers: Number,
  settings: { type: mongoose.Schema.Types.Mixed, default: {} }
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', UserSchema);
const Institution = mongoose.models.Institution || mongoose.model('Institution', InstitutionSchema);

async function seed() {
  console.log('🔌 Connecting to MongoDB:', MONGO_URI);
  await mongoose.connect(MONGO_URI);
  console.log('✅ MongoDB connected!');

  // ─── 1. Seed Default Institution ────────────────────────────────────────
  let defaultInstitution = await Institution.findOne({ code: 'EDUVERSE-MAIN' });
  if (!defaultInstitution) {
    defaultInstitution = await Institution.create({
      name: 'EduVerse Main Campus',
      code: 'EDUVERSE-MAIN',
      type: 'university',
      country: 'India',
      city: 'New Delhi',
      state: 'Delhi',
      plan: 'enterprise',
      status: 'active',
      maxUsers: 10000,
      settings: {
        enableHostel: true, enableTransport: true, enablePlacement: true,
        enableLibrary: true, enableFinance: true, enableExams: true, enableAI: true
      }
    });
    console.log(`🏛️  Created institution: ${defaultInstitution.name} (${defaultInstitution._id})`);
  } else {
    console.log(`🏛️  Institution already exists: ${defaultInstitution.name}`);
  }

  // ─── 2. Seed Super Admin ─────────────────────────────────────────────────
  const superAdminEmail = 'superadmin@eduverse.com';
  const superAdminPassword = 'SuperAdmin@2026';

  let superAdmin = await User.findOne({ email: superAdminEmail });
  if (!superAdmin) {
    const passwordHash = await bcrypt.hash(superAdminPassword, 10);
    superAdmin = await User.create({
      firstName: 'Super',
      lastName: 'Admin',
      email: superAdminEmail,
      passwordHash,
      role: 'SUPER_ADMIN',
      status: 'active',
      emailVerified: true,
      permissions: ['*'],
      institutionId: null
    });
    console.log(`👑 Created Super Admin: ${superAdminEmail}`);
  } else {
    // Reset password in case it was changed
    const passwordHash = await bcrypt.hash(superAdminPassword, 10);
    await User.updateOne({ _id: superAdmin._id }, {
      $set: {
        passwordHash,
        status: 'active',
        loginAttempts: 0,
        lockUntil: null,
        isDeleted: false,
        emailVerified: true,
        role: 'SUPER_ADMIN'
      }
    });
    console.log(`♻️  Reset Super Admin password for: ${superAdminEmail}`);
  }

  // ─── 3. Migrate orphaned users to default institution ───────────────────
  const migrated = await User.updateMany(
    { role: { $ne: 'SUPER_ADMIN' }, $or: [{ institutionId: { $exists: false } }, { institutionId: null }] },
    { $set: { institutionId: defaultInstitution._id } }
  );
  if (migrated.modifiedCount > 0) {
    console.log(`🔄 Migrated ${migrated.modifiedCount} users to default institution`);
  }

  console.log('\n✅ Seed complete!');
  console.log('─────────────────────────────────────────');
  console.log(`Super Admin Email    : ${superAdminEmail}`);
  console.log(`Super Admin Password : ${superAdminPassword}`);
  console.log('─────────────────────────────────────────\n');

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch(err => {
  console.error('❌ Seed failed:', err.message);
  process.exit(1);
});

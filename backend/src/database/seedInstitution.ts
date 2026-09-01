import Institution from '../modules/institutions/institution.model.js';
import User from '../modules/users/user.model.js';

/**
 * Seeds a default institution on first startup.
 * Assigns all orphaned users (no institutionId) to this default institution.
 * This ensures backward compatibility with pre-multi-tenant data.
 */
export async function seedDefaultInstitution(): Promise<void> {
  try {
    // Check if any institutions already exist
    const count = await Institution.countDocuments();

    let defaultInstitution: any;

    if (count === 0) {
      console.log('🏛️  No institutions found. Creating default institution...');

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
          enableHostel:    true,
          enableTransport: true,
          enablePlacement: true,
          enableLibrary:   true,
          enableFinance:   true,
          enableExams:     true,
          enableAI:        true
        }
      });

      console.log(`✅ Default institution created: "${defaultInstitution.name}" (${defaultInstitution.code})`);
    } else {
      // Find the earliest created institution to use as the default
      defaultInstitution = await Institution.findOne().sort({ createdAt: 1 }).lean();
      console.log(`✅ Default institution found: "${defaultInstitution.name}"`);
    }

    // Migrate orphaned users (no institutionId) to the default institution
    if (defaultInstitution) {
      const migrated = await User.updateMany(
        {
          $or: [
            { institutionId: { $exists: false } },
            { institutionId: null },
            { institutionId: '' }
          ],
          // Don't assign SUPER_ADMIN to any institution (they're platform-level)
          role: { $ne: 'SUPER_ADMIN' }
        },
        { $set: { institutionId: defaultInstitution._id } }
      );

      if (migrated.modifiedCount > 0) {
        console.log(`🔄 Migrated ${migrated.modifiedCount} existing users to "${defaultInstitution.name}"`);
      }
    }
  } catch (err: any) {
    console.error('❌ Failed to seed default institution:', err.message);
  }
}

export default seedDefaultInstitution;

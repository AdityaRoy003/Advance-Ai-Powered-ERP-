import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/eduverse';

async function seedController() {
  await mongoose.connect(MONGO_URI);
  const inst = await mongoose.connection.collection('institutions').findOne({});
  const hash = await bcrypt.hash('Academic@2026', 10);
  
  await mongoose.connection.collection('users').updateOne(
    { email: 'academic@eduverse.com' },
    {
      $set: {
        firstName: 'Vikram',
        lastName: 'Sengupta',
        email: 'academic@eduverse.com',
        passwordHash: hash,
        role: 'ACADEMIC_CONTROLLER',
        department: 'Academic Operations & Examination Wing',
        designation: 'Chief Controller of Examinations',
        status: 'active',
        emailVerified: true,
        institutionId: inst ? inst._id : null,
        isDeleted: false,
        permissions: [
          'Academic Calendar Management',
          'AI Timetable Generation',
          'Examination Scheduling',
          'Hall Ticket Generation',
          'Result Publishing & Moderation',
          'Faculty Exam Duty Allocation',
          'Classroom Inventory & Allocation',
          'Faculty Workload Management',
          'Reports Generation'
        ]
      }
    },
    { upsert: true }
  );
  console.log('✅ Real Academic Controller user created in MongoDB: academic@eduverse.com / Academic@2026');
  await mongoose.disconnect();
}

seedController().catch(err => {
  console.error(err);
  process.exit(1);
});

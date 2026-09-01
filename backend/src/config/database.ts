import mongoose from 'mongoose';
import { seedDatabase } from './seed.js';
import { seedDefaultInstitution } from '../database/seedInstitution.js';

const connectDB = async (): Promise<void> => {
  if (!process.env.MONGO_URI) {
    console.warn('MONGO_URI is not set. Skipping database connection for now.');
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected : ${conn.connection.host}`);
    // Run seeders on successful connection
    await seedDatabase();
    await seedDefaultInstitution();
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error(`MongoDB connection failed: ${message}`);
  }
};

export default connectDB;

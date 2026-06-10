import mongoose from 'mongoose';
import { env } from './env';

export const connectDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(env.mongoUri);
    console.log('[DB] MongoDB connected');
  } catch (error) {
    console.error('[DB] Connection error:', error);
    process.exit(1);
  }
};

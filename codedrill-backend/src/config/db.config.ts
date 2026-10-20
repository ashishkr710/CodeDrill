import mongoose from 'mongoose';
import { env } from './env.config.js';
import { logger } from '../utils/logger.util.js';

let isConnected = false;

export async function connectDatabase(uri = env.MONGODB_URI): Promise<void> {
  if (isConnected) {
    logger.debug('Database already connected.');
    return;
  }

  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(uri);
    isConnected = true;
    logger.info(
      { uri: uri.replace(/\/\/.*@/, '//<credentials>@') },
      'Connected to MongoDB successfully'
    );
  } catch (error) {
    logger.error({ error }, 'Failed to connect to MongoDB');
    throw error;
  }
}

export async function disconnectDatabase(): Promise<void> {
  if (!isConnected) return;
  try {
    await mongoose.disconnect();
    isConnected = false;
    logger.info('Disconnected from MongoDB');
  } catch (error) {
    logger.error({ error }, 'Error disconnecting from MongoDB');
  }
}

mongoose.connection.on('disconnected', () => {
  isConnected = false;
  logger.warn('MongoDB connection lost');
});

mongoose.connection.on('error', (err) => {
  logger.error({ err }, 'MongoDB runtime error');
});

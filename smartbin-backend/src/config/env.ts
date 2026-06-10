import dotenv from 'dotenv';

dotenv.config();

export const env = {
  port: parseInt(process.env.PORT ?? '5000', 10),
  nodeEnv: process.env.NODE_ENV ?? 'development',
  mongoUri: process.env.MONGODB_URI ?? 'mongodb://localhost:27017/smartbin',
  jwtSecret: process.env.JWT_SECRET ?? 'changeme',
  // Expiry in seconds — default 7 days
  jwtExpiresIn: parseInt(process.env.JWT_EXPIRES_IN ?? '604800', 10),
  deviceApiKey: process.env.DEVICE_API_KEY ?? 'device-secret',
  corsOrigin: process.env.CORS_ORIGIN ?? '*',
};

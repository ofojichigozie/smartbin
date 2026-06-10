import { Router } from 'express';
import {
  postReading,
  fetchReadings,
  fetchReadingsByBin,
  removeReading,
} from '../controllers/reading.controller';
import { authenticate, authenticateDevice } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createReadingSchema } from '../validations/reading.validation';

const router = Router();

// Device-facing: ESP8266 posts sensor readings (API key auth)
router.post('/', authenticateDevice, validate(createReadingSchema), postReading);

// Admin-facing: retrieve and manage readings (JWT auth)
router.get('/', authenticate, fetchReadings);
router.get('/:binId', authenticate, fetchReadingsByBin);
router.delete('/:id', authenticate, removeReading);

export default router;

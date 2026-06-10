import { Router } from 'express';
import authRoutes from './auth.routes';
import readingRoutes from './reading.routes';
import binRoutes from './bin.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/readings', readingRoutes);
router.use('/bins', binRoutes);

export default router;

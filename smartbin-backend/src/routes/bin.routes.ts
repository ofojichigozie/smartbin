import { Router } from 'express';
import { fetchBins, fetchBin } from '../controllers/bin.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', authenticate, fetchBins);
router.get('/:binId', authenticate, fetchBin);

export default router;

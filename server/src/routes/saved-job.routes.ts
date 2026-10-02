import { Router } from 'express';
import { SavedJobController } from '../controllers/saved-job.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/', requireAuth, SavedJobController.saveJob);
router.get('/my', requireAuth, SavedJobController.getMySavedJobs);
router.delete('/:jobId', requireAuth, SavedJobController.unsaveJob);

export default router;
import { Router } from 'express';
import { ApplicationController } from '../controllers/application.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/', requireAuth, ApplicationController.apply);
router.get('/my', requireAuth, ApplicationController.getMyApplications);
router.get('/employer', requireAuth, ApplicationController.getEmployerApplications);
router.get('/job/:jobId', requireAuth, ApplicationController.getApplicationsForJob);
router.get('/:id', requireAuth, ApplicationController.getApplicationById);
router.patch('/:id/status', requireAuth, ApplicationController.updateStatus);

export default router;

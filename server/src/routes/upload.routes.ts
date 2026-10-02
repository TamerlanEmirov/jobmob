import { Router } from 'express';
import { UploadController } from '../controllers/upload.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { uploadPhoto, uploadResume, runMulter } from '../middleware/upload.middleware.js';

const router = Router();

router.post('/photo', requireAuth, runMulter(uploadPhoto), UploadController.uploadPhoto);
router.post('/resume', requireAuth, runMulter(uploadResume), UploadController.uploadResume);

export default router;
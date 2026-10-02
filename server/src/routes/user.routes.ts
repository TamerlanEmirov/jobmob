import { Router } from 'express';
import { UserController } from '../controllers/user.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router();

// Hər iki endpoint üçün aktiv login tələb olunur
router.get('/me', requireAuth, UserController.getMe);
router.post('/sync', requireAuth, UserController.syncUser);
router.patch('/me', requireAuth, UserController.updateProfile);
export default router;
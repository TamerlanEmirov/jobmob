import { Router } from 'express';
import { CompanyController } from '../controllers/company.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router();
router.patch('/me', requireAuth, CompanyController.updateMyCompany);

export default router;
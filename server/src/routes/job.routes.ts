import { requireAuth } from '../middleware/auth.middleware';
import { JobController } from '../controllers/job.controller';
import { Router } from 'express';

const router = Router();

// Statik və ya xüsusi marşrutlar üstə olmalıdır
router.get('/my-jobs', requireAuth, JobController.getMyJobs);

// Ümumi GET və POST marşrutları
router.get('/', JobController.getJobs);
router.post('/', requireAuth, JobController.createJob);

// Dinamik ID marşrutları (:id)
router.get('/:id', JobController.getJobById);
router.put('/:id', requireAuth, JobController.updateJob); // <-- PUT marşrutunun burda olduğundan əmin olun!
router.delete('/:id', requireAuth, JobController.deleteJob);
export default router;
import { Request, Response } from 'express';
import { getAuth } from '@clerk/express';
import { SavedJobService } from '../services/saved-job.service.js';

export class SavedJobController {
  static async saveJob(req: Request, res: Response) {
    try {
      const auth = getAuth(req);
      if (!auth.userId) return res.status(401).json({ success: false, message: 'İcazə verilmədi' });

      const { jobId } = req.body;
      if (!jobId) return res.status(400).json({ success: false, message: 'jobId məcburidir' });

      const saved = await SavedJobService.saveJob(auth.userId, jobId);
      res.status(201).json({ success: true, data: saved });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message || 'Xəta baş verdi' });
    }
  }

  static async unsaveJob(req: Request, res: Response) {
    try {
      const auth = getAuth(req);
      if (!auth.userId) return res.status(401).json({ success: false, message: 'İcazə verilmədi' });

      const { jobId } = req.params;
      if (typeof jobId !== 'string') return res.status(400).json({ success: false, message: 'Keçərsiz ID' });

      await SavedJobService.unsaveJob(auth.userId, jobId);
      res.json({ success: true, message: 'Elan saxlanılanlardan çıxarıldı' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Xəta baş verdi' });
    }
  }

 static async getMySavedJobs(req: Request, res: Response) {
  try {
    const auth = getAuth(req);

    if (!auth.userId) {
      return res.status(401).json({
        success: false,
        message: 'İcazə verilmədi',
      });
    }

    const jobs = await SavedJobService.getMySavedJobs(auth.userId);

    res.json({
      success: true,
      data: jobs,
    });
  } catch (error: any) {
    console.error('GET SAVED JOBS ERROR:', error);

    res.status(500).json({
      success: false,
      message: error.message || 'Xəta baş verdi',
    });
  }
}
}
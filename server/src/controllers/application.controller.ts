import { Request, Response } from 'express';
import { getAuth } from '@clerk/express';
import { ApplicationService } from '../services/application.service.js';

export class ApplicationController {
  static async apply(req: Request, res: Response) {
    try {
      const auth = getAuth(req);
      if (!auth.userId) {
        return res.status(401).json({ success: false, message: 'İcazə verilmədi' });
      }

      const { jobId } = req.body;
      if (!jobId || typeof jobId !== 'string') {
        return res.status(400).json({ success: false, message: 'Keçərsiz və ya əskik jobId' });
      }

      // Əsas məntiqi Service qatına ötürürük
      const application = await ApplicationService.apply(auth.userId, jobId);
      
      return res.status(201).json({ success: true, data: application });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message || 'Xəta baş verdi' });
    }
  }

  static async getMyApplications(req: Request, res: Response) {
    try {
      const auth = getAuth(req);
      if (!auth.userId) return res.status(401).json({ success: false, message: 'İcazə verilmədi' });
      
      const applications = await ApplicationService.getMyApplications(auth.userId);
      return res.json({ success: true, data: applications });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message || 'Xəta baş verdi' });
    }
  }

  static async getEmployerApplications(req: Request, res: Response) {
    try {
      const auth = getAuth(req);
      if (!auth.userId) return res.status(401).json({ success: false, message: 'İcazə verilmədi' });
      
      const applications = await ApplicationService.getEmployerApplications(auth.userId);
      return res.json({ success: true, data: applications });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message || 'Xəta baş verdi' });
    }
  }

  static async getApplicationById(req: Request, res: Response) {
    try {
      const auth = getAuth(req);
      if (!auth.userId) return res.status(401).json({ success: false, message: 'İcazə verilmədi' });
      
      const { id } = req.params;
      if (!id || typeof id !== 'string') return res.status(400).json({ success: false, message: 'Keçərsiz ID' });

      const application = await ApplicationService.getApplicationById(auth.userId, id);
      return res.json({ success: true, data: application });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message || 'Xəta baş verdi' });
    }
  }

  static async getApplicationsForJob(req: Request, res: Response) {
    try {
      const auth = getAuth(req);
      if (!auth.userId) return res.status(401).json({ success: false, message: 'İcazə verilmədi' });
      
      const { jobId } = req.params;
      if (!jobId || typeof jobId !== 'string') return res.status(400).json({ success: false, message: 'Keçərsiz ID' });

      const applications = await ApplicationService.getApplicationsForJob(auth.userId, jobId);
      return res.json({ success: true, data: applications });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message || 'Xəta baş verdi' });
    }
  }

  static async updateStatus(req: Request, res: Response) {
    try {
      const auth = getAuth(req);
      if (!auth.userId) return res.status(401).json({ success: false, message: 'İcazə verilmədi' });
      
      const { id } = req.params;
      if (!id || typeof id !== 'string') return res.status(400).json({ success: false, message: 'Keçərsiz ID' });

      const { status } = req.body;
      if (!['PENDING', 'REVIEWING', 'ACCEPTED', 'REJECTED'].includes(status)) {
        return res.status(400).json({ success: false, message: 'Yanlış status dəyəri' });
      }

      const updated = await ApplicationService.updateStatus(auth.userId, id, status);
      return res.json({ success: true, data: updated });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message || 'Xəta baş verdi' });
    }
  }
}

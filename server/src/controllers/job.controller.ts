import { Request, Response } from 'express';
import { JobService } from '../services/job.service.js';
import { getAuth } from '@clerk/express';

export class JobController {
 static async getJobs(req: Request, res: Response) {
  try {
    const { search, location, minSalary, maxSalary, employmentType, workMode } = req.query as {
      search?: string; location?: string; minSalary?: string; maxSalary?: string;
      employmentType?: string; workMode?: string;
    };
    const jobs = await JobService.getAllJobs(
      search, location,
      minSalary ? Number(minSalary) : undefined,
      maxSalary ? Number(maxSalary) : undefined,
      employmentType, workMode
    );
    res.json({ success: true, data: jobs });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Elanları gətirərkən xəta baş verdi' });
  }
}

  static async getJobById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (typeof id !== 'string') {
        return res
          .status(400)
          .json({ success: false, message: 'Keçərsiz ID parametri' });
      }

      const job = await JobService.getJobById(id);

      if (!job) {
        return res
          .status(404)
          .json({ success: false, message: 'Elan tapılmadı' });
      }

      return res.json({ success: true, data: job });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Xəta baş verdi' });
    }
  }

  static async createJob(req: Request, res: Response) {
    try {
      const auth = getAuth(req);
      if (!auth.userId) {
        return res
          .status(401)
          .json({ success: false, message: 'İcazə verilmədi' });
      }

      const {
        title,
        description,
        location,
        employmentType,
        workMode,
        experienceLevel,
        skills,
        responsibilities,
        requirements,
        minSalary,
        maxSalary,
      } = req.body;

      if (!title || !description) {
        return res
          .status(400)
          .json({ success: false, message: 'Title və description məcburidir' });
      }

      const newJob = await JobService.createJob(auth.userId, {
        title,
        description,
        location,
        employmentType: employmentType || 'FULL_TIME',
        workMode: workMode || 'ONSITE',
        experienceLevel: experienceLevel || 'ENTRY',
        skills: Array.isArray(skills) ? skills : [],
        responsibilities: Array.isArray(responsibilities) ? responsibilities : [],
        requirements: Array.isArray(requirements) ? requirements : [],
        minSalary: minSalary != null ? Number(minSalary) : undefined,
        maxSalary: maxSalary != null ? Number(maxSalary) : undefined,
      });

      return res.status(201).json({ success: true, data: newJob });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || 'Elan yaradılarkən xəta baş verdi',
      });
    }
  }

  static async getMyJobs(req: Request, res: Response) {
    try {
      const auth = getAuth(req);
      console.log('--> Clerk Auth User ID:', auth.userId);

      if (!auth.userId) {
        return res
          .status(401)
          .json({ success: false, message: 'İcazə verilmədi' });
      }

      const search = req.query.search as string | undefined;
      const minSalary = req.query.minSalary
        ? Number(req.query.minSalary)
        : undefined;
      const maxSalary = req.query.maxSalary
        ? Number(req.query.maxSalary)
        : undefined;

      const jobs = await JobService.getMyJobs(
        auth.userId,
        search,
        minSalary,
        maxSalary
      );

      return res.json({ success: true, data: jobs });
    } catch (error: any) {
      console.error('getMyJobs Xətası:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Xəta baş verdi',
      });
    }
  }

  static async updateJob(req: Request, res: Response) {
    try {
      const auth = getAuth(req);
      if (!auth.userId) {
        return res
          .status(401)
          .json({ success: false, message: 'İcazə verilmədi' });
      }

      const { id } = req.params;

      if (typeof id !== 'string') {
        return res
          .status(400)
          .json({ success: false, message: 'Keçərsiz ID parametri' });
      }

      const {
        title,
        description,
        location,
        employmentType,
        workMode,
        experienceLevel,
        skills,
        responsibilities,
        requirements,
        minSalary,
        maxSalary,
      } = req.body;

      const updatedJob = await JobService.updateJob(id, auth.userId, {
        title,
        description,
        location,
        employmentType,
        workMode,
        experienceLevel,
        skills,
        responsibilities,
        requirements,
        minSalary: minSalary !== undefined ? Number(minSalary) : undefined,
        maxSalary: maxSalary !== undefined ? Number(maxSalary) : undefined,
      });

      return res.json({ success: true, data: updatedJob });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || 'Elan redaktə edilərkən xəta baş verdi',
      });
    }
  }

  static async deleteJob(req: Request, res: Response) {
    try {
      const auth = getAuth(req);
      if (!auth.userId) {
        return res
          .status(401)
          .json({ success: false, message: 'İcazə verilmədi' });
      }

      const { id } = req.params;
      if (typeof id !== 'string') {
        return res
          .status(400)
          .json({ success: false, message: 'Keçərsiz ID parametri' });
      }

      await JobService.deleteJob(id, auth.userId);
      return res.json({ success: true, message: 'Elan silindi' });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || 'Elan silinərkən xəta baş verdi',
      });
    }
  }
}
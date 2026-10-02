import { Request, Response } from 'express';
import { UserService } from '../services/user.service.js';
import { getAuth } from '@clerk/express';

export class UserController {
  static async getMe(req: Request, res: Response) {
    try {
      const auth = getAuth(req);
      
      if (!auth.userId) {
        return res.status(401).json({ success: false, message: 'İcazə verilmədi' });
      }

      const user = await UserService.getUserByClerkId(auth.userId);

      if (!user) {
        return res.status(404).json({ success: false, message: 'İstifadəçi bazada tapılmadı' });
      }

      res.json({ success: true, data: user });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Xəta baş verdi' });
    }
  }

  static async syncUser(req: Request, res: Response) {
    try {
      const auth = getAuth(req);

      if (!auth.userId) {
        return res.status(401).json({ success: false, message: 'İcazə verilmədi' });
      }

      const {
        email,
        role,
        fullName,
        bio,
        skills,
        experienceYears,
        resumeUrl,
        companyName,
        companyDescription,
        companyCategory,
      } = req.body;

      if (!email || !role) {
        return res.status(400).json({ success: false, message: 'Email və role məcburidir' });
      }

      const user = await UserService.syncUser({
        clerkId: auth.userId,
        email,
        role,
        fullName,
        bio,
        skills,
        experienceYears,
        resumeUrl,
        companyName,
        companyDescription,
        companyCategory,
      });

      res.status(200).json({ success: true, data: user });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Sinxronizasiya xətası' });
    }
  }
  static async updateProfile(req: Request, res: Response) {
  try {
    const auth = getAuth(req);
    if (!auth.userId) return res.status(401).json({ success: false, message: 'İcazə verilmədi' });

    const { fullName, bio, skills, experienceYears, resumeUrl, photoUrl, phoneNumber, githubUrl, linkedinUrl, instagramUrl } = req.body;

    const updated = await UserService.updateProfile(auth.userId, {
      fullName, bio, skills,
      experienceYears: experienceYears != null ? Number(experienceYears) : undefined,
      resumeUrl, photoUrl, phoneNumber, githubUrl, linkedinUrl, instagramUrl,
    });
    res.json({ success: true, data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Profil yenilənərkən xəta baş verdi' });
  }
}
}
import { Request, Response } from 'express';
import { getAuth } from '@clerk/express';
import { CompanyService } from '../services/company.service.js';

export class CompanyController {
  static async updateMyCompany(req: Request, res: Response) {
    try {
      const auth = getAuth(req);
      if (!auth.userId) return res.status(401).json({ success: false, message: 'İcazə verilmədi' });

      const { name, description, category } = req.body;
      const updated = await CompanyService.updateMyCompany(auth.userId, { name, description, category });
      res.json({ success: true, data: updated });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Şirkət məlumatları yenilənərkən xəta baş verdi' });
    }
  }
}
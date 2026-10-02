import { Request, Response } from 'express';
import { getAuth } from '@clerk/express';
import { UploadService } from '../services/upload.service.js';

export class UploadController {
  static async uploadPhoto(req: Request, res: Response) {
    try {
      const auth = getAuth(req);

      console.log('AUTH:', auth.userId);
      console.log('FILE:', req.file);

      if (!auth.userId) {
        return res.status(401).json({
          success: false,
          message: 'İcazə verilmədi',
        });
      }

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'Fayl tapılmadı',
        });
      }

      // TEST:
      // upload_stream əvəzinə cloudinary.uploader.upload()
      const url = await UploadService.testUpload(
        req.file.buffer
      );

      return res.json({
        success: true,
        data: {
          url,
        },
      });
    } catch (error: any) {
      console.error('UPLOAD PHOTO ERROR:', error);

      return res.status(500).json({
        success: false,
        message:
          error?.message ||
          'Yükləmə zamanı xəta baş verdi',
      });
    }
  }

  static async uploadResume(req: Request, res: Response) {
    try {
      const auth = getAuth(req);

      console.log('AUTH:', auth.userId);
      console.log('FILE:', req.file);

      if (!auth.userId) {
        return res.status(401).json({
          success: false,
          message: 'İcazə verilmədi',
        });
      }

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'Fayl tapılmadı',
        });
      }

      // Hələlik normal upload funksiyasını saxlayırıq
      const url =
        await UploadService.uploadToCloudinary(
          req.file.buffer,
          'resumes',
          'raw'
        );

      return res.json({
        success: true,
        data: {
          url,
        },
      });
    } catch (error: any) {
      console.error('UPLOAD RESUME ERROR:', error);

      return res.status(500).json({
        success: false,
        message:
          error?.message ||
          'Yükləmə zamanı xəta baş verdi',
      });
    }
  }
}
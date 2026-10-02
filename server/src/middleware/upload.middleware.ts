import multer from 'multer';
import { Request, Response, NextFunction } from 'express';

const storage = multer.memoryStorage();

export const uploadPhoto = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) return cb(new Error('Yalnız şəkil faylları qəbul olunur'));
    cb(null, true);
  },
}).single('file');

export const uploadResume = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (_req, file, cb) => {
    const allowed = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowed.includes(file.mimetype)) return cb(new Error('Yalnız PDF və ya Word faylları qəbul olunur'));
    cb(null, true);
  },
}).single('file');

// multer-in özü xətanı "next(err)" ilə ötürür — bunu tutub bizim standart JSON formatına salırıq
export function runMulter(middleware: any) {
  return (req: Request, res: Response, next: NextFunction) => {
    middleware(req, res, (err: any) => {
      if (err) return res.status(400).json({ success: false, message: err.message || 'Fayl yükləmə xətası' });
      next();
    });
  };
}
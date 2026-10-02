import express from 'express';
import cors from 'cors';
import { clerkMiddleware } from '@clerk/express';
import jobRoutes from './routes/job.routes.js';
import userRoutes from './routes/user.routes.js';
import companyRoutes from './routes/company.routes.js';
import applicationRoutes from './routes/application.routes.js';
import savedJobRoutes from './routes/saved-job.routes.js';
import uploadRoutes from './routes/upload.routes.js'; // 👈 YENİ
import { UploadService } from './services/upload.service.js';
const app = express();

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(clerkMiddleware());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/saved-jobs', savedJobRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/users', userRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/uploads', uploadRoutes); // 👈 YENİ
UploadService.testCloudinary();

export default app;
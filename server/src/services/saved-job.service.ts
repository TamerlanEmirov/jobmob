import { prisma } from '../lib/prisma.js';

export class SavedJobService {
  static async saveJob(clerkId: string, jobId: string) {
    const user = await prisma.user.findUnique({ where: { clerkId } });
    if (!user || user.role !== 'JOB_SEEKER') {
      throw new Error('Yalnız iş axtaranlar elan saxlaya bilər');
    }

    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job) throw new Error('Elan tapılmadı');

    try {
      return await prisma.savedJob.create({ data: { userId: user.id, jobId } });
    } catch (error: any) {
      if (error.code === 'P2002') throw new Error('Bu elan artıq saxlanılıb');
      throw error;
    }
  }

  static async unsaveJob(clerkId: string, jobId: string) {
    const user = await prisma.user.findUnique({ where: { clerkId } });
    if (!user) throw new Error('İstifadəçi tapılmadı');

    await prisma.savedJob
      .delete({ where: { userId_jobId: { userId: user.id, jobId } } })
      .catch(() => {}); // artıq saxlanılmayıbsa, xəta yox — sadəcə keç
  }

  static async getMySavedJobs(clerkId: string) {
    const user = await prisma.user.findUnique({ where: { clerkId } });
    if (!user) throw new Error('İstifadəçi tapılmadı');

    const saved = await prisma.savedJob.findMany({
      where: { userId: user.id },
      include: { job: { include: { company: { select: { name: true, category: true } } } } },
      orderBy: { createdAt: 'desc' },
    });

    return saved.map((s) => s.job); // birbaşa Job[] qaytarırıq, frontend SavedJob "qabığı" görməsin
  }
}
import { prisma } from '../lib/prisma.js';
import { calculateMatchScore } from './ai.service.js';

export class ApplicationService {
  static async apply(clerkId: string, jobId: string) {
    const user = await prisma.user.findUnique({ where: { clerkId } });
    if (!user || user.role !== 'JOB_SEEKER') {
      throw new Error('Yalnız iş axtaranlar müraciət edə bilər');
    }

    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job) throw new Error('Elan tapılmadı');

    // AI servislə uyğunluq yoxlanılır və datalar destructure edilir
    const { score: matchScore, note: matchNote } = await calculateMatchScore(
      { bio: user.bio, skills: user.skills, experienceYears: user.experienceYears },
      { title: job.title, description: job.description }
    );

    try {
      return await prisma.application.create({
        data: { 
          jobId, 
          applicantId: user.id, 
          matchScore, 
          matchNote 
        }
      });
    } catch (error: any) {
      if (error.code === 'P2002') throw new Error('Bu elana artıq müraciət etmisiniz');
      throw error;
    }
  }

  static async getMyApplications(clerkId: string) {
    const user = await prisma.user.findUnique({ where: { clerkId } });
    if (!user) throw new Error('İstifadəçi tapılmadı');

    return prisma.application.findMany({
      where: { applicantId: user.id },
      include: { job: { include: { company: { select: { name: true } } } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async getEmployerApplications(clerkId: string) {
    const user = await prisma.user.findUnique({ where: { clerkId }, include: { company: true } });
    if (!user?.company) throw new Error('Şirkət tapılmadı');

    return prisma.application.findMany({
      where: { job: { companyId: user.company.id } },
      include: {
        applicant: { select: { fullName: true, email: true, skills: true, experienceYears: true } },
        job: { select: { id: true, title: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async getApplicationById(clerkId: string, applicationId: string) {
    const user = await prisma.user.findUnique({ where: { clerkId }, include: { company: true } });
    if (!user?.company) throw new Error('Şirkət tapılmadı');

    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        applicant: { select: { fullName: true, email: true, skills: true, experienceYears: true, bio: true } },
        job: { select: { id: true, title: true, companyId: true } },
      },
    });

    if (!application) throw new Error('Müraciət tapılmadı');
    if (application.job.companyId !== user.company.id) {
      throw new Error('Bu müraciətə baxmaq icazəniz yoxdur');
    }

    return application;
  }

  static async getApplicationsForJob(clerkId: string, jobId: string) {
    const user = await prisma.user.findUnique({ where: { clerkId }, include: { company: true } });
    if (!user?.company) throw new Error('Şirkət tapılmadı');

    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job) throw new Error('Elan tapılmadı');
    if (job.companyId !== user.company.id) {
      throw new Error('Bu elana baxmaq icazəniz yoxdur');
    }

    return prisma.application.findMany({
      where: { jobId },
      include: { applicant: { select: { fullName: true, email: true, skills: true, experienceYears: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async updateStatus(clerkId: string, applicationId: string, status: string) {
    const user = await prisma.user.findUnique({ where: { clerkId }, include: { company: true } });
    if (!user?.company) throw new Error('Şirkət tapılmadı');

    const application = await prisma.application.findUnique({ where: { id: applicationId }, include: { job: true } });
    if (!application) throw new Error('Müraciət tapılmadı');
    if (application.job.companyId !== user.company.id) {
      throw new Error('Bu müraciəti idarə etmək icazəniz yoxdur');
    }

    return prisma.application.update({ 
      where: { id: applicationId }, 
      data: { status: status as any } 
    });
  }
}

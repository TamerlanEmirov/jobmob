import { prisma } from '../lib/prisma.js';

interface CreateJobDTO {
  title: string;
  description: string;
  location?: string;

  employmentType:
    | 'FULL_TIME'
    | 'PART_TIME'
    | 'CONTRACT'
    | 'INTERNSHIP';

  workMode:
    | 'ONSITE'
    | 'REMOTE'
    | 'HYBRID';

  experienceLevel:
    | 'ENTRY'
    | 'JUNIOR'
    | 'MID'
    | 'SENIOR'
    | 'LEAD';

  skills: string[];
  responsibilities: string[];
  requirements: string[];

  minSalary?: number;
  maxSalary?: number;
}

export class JobService {
  static async getAllJobs(
  search?: string,
  location?: string,
  minSalary?: number,
  maxSalary?: number,
  employmentType?: string,
  workMode?: string
) {
  return prisma.job.findMany({
    where: {
      ...(search ? { title: { contains: search, mode: 'insensitive' } } : {}),
      ...(location ? { location: { contains: location, mode: 'insensitive' } } : {}),
      ...(minSalary !== undefined ? { maxSalary: { gte: minSalary } } : {}),
      ...(maxSalary !== undefined ? { minSalary: { lte: maxSalary } } : {}),
      ...(employmentType ? { employmentType: employmentType as any } : {}),
      ...(workMode ? { workMode: workMode as any } : {}),
    },
    include: { company: { select: { name: true, category: true } } },
    orderBy: { createdAt: 'desc' },
  });
}

  static async getJobById(id: string) {
    return prisma.job.findUnique({
      where: { id },

      include: {
        company: true,
      },
    });
  }

  static async createJob(
    clerkId: string,
    data: CreateJobDTO
  ) {
    const user = await prisma.user.findUnique({
      where: { clerkId },
      include: { company: true },
    });

    if (!user?.company) {
      throw new Error('Şirkət tapılmadı');
    }

    const salaryRange =
      data.minSalary != null && data.maxSalary != null
        ? `${data.minSalary}-${data.maxSalary}`
        : data.minSalary != null
          ? `${data.minSalary}+`
          : data.maxSalary != null
            ? `0-${data.maxSalary}`
            : undefined;

    return prisma.job.create({
      data: {
        title: data.title,
        description: data.description,
        location: data.location,

        employmentType: data.employmentType,
        workMode: data.workMode,
        experienceLevel: data.experienceLevel,

        skills: data.skills,
        responsibilities: data.responsibilities,
        requirements: data.requirements,

        minSalary: data.minSalary,
        maxSalary: data.maxSalary,
        salaryRange,

        companyId: user.company.id,
      },
    });
  }

  static async getMyJobs(
    clerkId: string,
    search?: string,
    minSalary?: number,
    maxSalary?: number
  ) {
    const user = await prisma.user.findUnique({
      where: { clerkId },
      include: { company: true },
    });

    if (!user || !user.company) {
      console.log(
        'Xəbərdarlıq: Bu istifadəçi üçün Şirkət (Company) tapılmadı.'
      );

      return [];
    }

    return prisma.job.findMany({
      where: {
        companyId: user.company.id,

        ...(search
          ? {
              title: {
                contains: search,
                mode: 'insensitive',
              },
            }
          : {}),

        ...(minSalary !== undefined
          ? {
              maxSalary: {
                gte: minSalary,
              },
            }
          : {}),

        ...(maxSalary !== undefined
          ? {
              minSalary: {
                lte: maxSalary,
              },
            }
          : {}),
      },

      include: {
        applications: {
          select: {
            id: true,
          },
        },
      },

      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  static async updateJob(
    jobId: string,
    clerkId: string,
    data: {
      title?: string;
      description?: string;
      location?: string;

      employmentType?:
        | 'FULL_TIME'
        | 'PART_TIME'
        | 'CONTRACT'
        | 'INTERNSHIP';

      workMode?:
        | 'ONSITE'
        | 'REMOTE'
        | 'HYBRID';

      experienceLevel?:
        | 'ENTRY'
        | 'JUNIOR'
        | 'MID'
        | 'SENIOR'
        | 'LEAD';

      skills?: string[];
      responsibilities?: string[];
      requirements?: string[];

      minSalary?: number;
      maxSalary?: number;
    }
  ) {
    const user = await prisma.user.findUnique({
      where: { clerkId },
      include: { company: true },
    });

    if (!user?.company) {
      throw new Error('Şirkət tapılmadı');
    }

    const existingJob = await prisma.job.findUnique({
      where: { id: jobId },
    });

    if (!existingJob) {
      throw new Error('Elan tapılmadı');
    }

    if (existingJob.companyId !== user.company.id) {
      throw new Error(
        'Bu elanı redaktə etmək icazəniz yoxdur'
      );
    }

    const minSalary =
      data.minSalary !== undefined
        ? data.minSalary
        : existingJob.minSalary;

    const maxSalary =
      data.maxSalary !== undefined
        ? data.maxSalary
        : existingJob.maxSalary;

    let salaryRange: string | undefined;

    if (minSalary != null && maxSalary != null) {
      salaryRange = `${minSalary}-${maxSalary}`;
    } else if (minSalary != null) {
      salaryRange = `${minSalary}+`;
    } else if (maxSalary != null) {
      salaryRange = `0-${maxSalary}`;
    }

    return prisma.job.update({
      where: { id: jobId },

      data: {
        title: data.title,
        description: data.description,
        location: data.location,

        employmentType: data.employmentType,
        workMode: data.workMode,
        experienceLevel: data.experienceLevel,

        skills: data.skills,
        responsibilities: data.responsibilities,
        requirements: data.requirements,

        minSalary: data.minSalary,
        maxSalary: data.maxSalary,
        salaryRange,
      },
    });
  }

  static async deleteJob(
    jobId: string,
    clerkId: string
  ) {
    const user = await prisma.user.findUnique({
      where: { clerkId },
      include: { company: true },
    });

    if (!user?.company) {
      throw new Error('Şirkət tapılmadı');
    }

    const existingJob = await prisma.job.findUnique({
      where: { id: jobId },
    });

    if (!existingJob) {
      throw new Error('Elan tapılmadı');
    }

    if (existingJob.companyId !== user.company.id) {
      throw new Error(
        'Bu elanı silmək icazəniz yoxdur'
      );
    }

    return prisma.job.delete({
      where: { id: jobId },
    });
  }
}
import { prisma } from '../lib/prisma.js';
import { UserRole } from '@prisma/client';

interface SyncUserDTO {
  clerkId: string;
  email: string;
  role: UserRole;
  
  // JOB_SEEKER olduqda gələ biləcək məlumatlar
  fullName?: string;
  bio?: string;
  skills?: string[];
  experienceYears?: number;
  resumeUrl?: string;

  // EMPLOYER olduqda gələ biləcək məlumatlar
  companyName?: string;
  companyDescription?: string;
  companyCategory?: string;
}

export class UserService {
  static async getUserByClerkId(clerkId: string) {
    return await prisma.user.findUnique({
      where: { clerkId },
      include: {
        company: true,
      },
    });
  }

  static async syncUser(data: SyncUserDTO) {
    const existingUser = await prisma.user.findUnique({
      where: { clerkId: data.clerkId },
      include: { company: true },
    });

    if (existingUser) {
      return existingUser;
    }

    // 1. İşəgötürən (EMPLOYER) seçilibsə -> User + Company yaradılır
    if (data.role === UserRole.EMPLOYER) {
      if (!data.companyName || !data.companyCategory) {
        throw new Error('İşəgötürən üçün şirkət adı və kateqoriyası məcburidir');
      }

      return await prisma.user.create({
        data: {
          clerkId: data.clerkId,
          email: data.email,
          role: data.role,
          company: {
            create: {
              name: data.companyName,
              description: data.companyDescription,
              category: data.companyCategory,
            },
          },
        },
        include: {
          company: true,
        },
      });
    }

    // 2. Namizəd (JOB_SEEKER) seçilibsə -> Məlumatları ilə User yaradılır
    return await prisma.user.create({
      data: {
        clerkId: data.clerkId,
        email: data.email,
        role: data.role,
        fullName: data.fullName,
        bio: data.bio,
        skills: data.skills || [],
        experienceYears: data.experienceYears,
        resumeUrl: data.resumeUrl,
      },
    });
  }
  static async updateProfile(clerkId: string, data: {
  fullName?: string; bio?: string; skills?: string[]; experienceYears?: number;
  resumeUrl?: string; photoUrl?: string; phoneNumber?: string;
  githubUrl?: string; linkedinUrl?: string; instagramUrl?: string;
}) {
  return prisma.user.update({ where: { clerkId }, data });
}
}
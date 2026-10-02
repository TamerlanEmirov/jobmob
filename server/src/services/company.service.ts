import { prisma } from '../lib/prisma.js';

export class CompanyService {
  static async updateMyCompany(clerkId: string, data: { name?: string; description?: string; category?: string }) {
    const user = await prisma.user.findUnique({ where: { clerkId }, include: { company: true } });
    if (!user?.company) throw new Error('Şirkət tapılmadı');

    return prisma.company.update({ where: { id: user.company.id }, data });
  }
}
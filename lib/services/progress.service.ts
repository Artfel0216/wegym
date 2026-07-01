import { prisma } from '@/lib/prisma';

export const progressService = {
  async create(athleteId: string, data: { date: string; weight: number; muscleMass?: number; bodyFat?: number; note?: string }) {
    return prisma.progressEntry.create({
      data: {
        athleteId,
        date: new Date(data.date),
        weight: data.weight,
        muscleMass: data.muscleMass ?? null,
        bodyFat: data.bodyFat ?? null,
        note: data.note ?? null,
      },
    });
  },

  async list(athleteId: string) {
    return prisma.progressEntry.findMany({
      where: { athleteId },
      orderBy: { date: 'desc' },
    });
  },

  async delete(id: string) {
    await prisma.progressEntry.delete({ where: { id } });
  },
};

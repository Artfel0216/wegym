import { prisma } from '@/lib/prisma';
import type { Prisma } from '@prisma/client';

export const workoutSessionService = {
  async create(data: {
    athleteId: string;
    modality: string;
    durationSec: number;
    distanceKm?: number;
    avgPaceSecPerKm?: number;
    steps?: number;
    calories?: number;
    avgHeartRate?: number;
    exercises?: Prisma.InputJsonValue;
  }) {
    return prisma.workoutSession.create({ data });
  },

  async list(athleteId: string, limit = 50, cursor?: string) {
    const takeClamped = Math.min(limit, 100);
    const sessions = await prisma.workoutSession.findMany({
      where: { athleteId },
      take: takeClamped + 1,
      orderBy: { completedAt: 'desc' },
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    });
    const hasMore = sessions.length > takeClamped;
    const sliced = hasMore ? sessions.slice(0, takeClamped) : sessions;
    const nextCursor = hasMore ? sliced[sliced.length - 1].id : null;
    return { data: sliced, nextCursor, hasMore };
  },

  async getStats(athleteId: string, period: 'week' | 'month' | 'year') {
    const now = new Date();
    let startDate: Date;
    switch (period) {
      case 'week':
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case 'month':
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case 'year':
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
    }

    const sessions = await prisma.workoutSession.findMany({
      where: { athleteId, completedAt: { gte: startDate } },
    });

    const totalVolume = sessions.reduce((acc, s) => acc + s.durationSec, 0);
    const totalCalories = sessions.reduce((acc, s) => acc + (s.calories ?? 0), 0);
    const totalDistance = sessions.reduce((acc, s) => acc + (s.distanceKm ?? 0), 0);
    const avgHeartRate = sessions.length > 0
      ? Math.round(sessions.reduce((acc, s) => acc + (s.avgHeartRate ?? 0), 0) / sessions.length)
      : 0;

    return {
      totalSessions: sessions.length,
      totalVolume,
      totalCalories,
      totalDistance,
      avgHeartRate,
      chartData: sessions.reduce<Record<string, number>>((acc, s) => {
        const key = s.completedAt.toISOString().slice(0, 10);
        acc[key] = (acc[key] ?? 0) + s.durationSec;
        return acc;
      }, {}),
    };
  },
};

import { prisma } from '@/lib/prisma';

export const gamificationService = {
  async getAchievements() {
    return prisma.achievement.findMany({ orderBy: { xpReward: 'asc' } });
  },

  async getUserAchievements(userId: string) {
    return prisma.userAchievement.findMany({
      where: { userId },
      include: { achievement: true },
      orderBy: { earnedAt: 'desc' },
    });
  },

  async checkAndAward(userId: string, event: { type: string; value: number }) {
    const achievements = await prisma.achievement.findMany();
    const earned = await prisma.userAchievement.findMany({ where: { userId }, select: { achievementId: true } });
    const earnedIds = new Set(earned.map((e) => e.achievementId));

    for (const ach of achievements) {
      if (earnedIds.has(ach.id)) continue;
      const criteria = ach.criteria as { type: string; value: number };
      if (criteria.type === event.type && event.value >= criteria.value) {
        await prisma.userAchievement.create({ data: { userId, achievementId: ach.id } });
      }
    }
  },

  async getLeaderboard(challengeId: string) {
    return prisma.challengeParticipant.findMany({
      where: { challengeId },
      orderBy: { currentValue: 'desc' },
      include: { user: { select: { id: true, displayName: true, avatarUrl: true } } },
    });
  },

  async joinChallenge(userId: string, challengeId: string) {
    return prisma.challengeParticipant.upsert({
      where: { challengeId_userId: { challengeId, userId } },
      create: { challengeId, userId },
      update: {},
    });
  },

  async updateChallengeProgress(userId: string, challengeId: string, value: number) {
    return prisma.challengeParticipant.update({
      where: { challengeId_userId: { challengeId, userId } },
      data: { currentValue: { increment: value } },
    });
  },

  async listChallenges() {
    const now = new Date();
    return prisma.challenge.findMany({
      where: { endDate: { gte: now } },
      orderBy: { startDate: 'asc' },
      include: { participants: { select: { userId: true, currentValue: true } } },
    });
  },
};

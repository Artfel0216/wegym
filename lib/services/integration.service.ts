import { prisma } from '@/lib/prisma';
import type { Prisma } from '@prisma/client';

type ProviderType = 'strava' | 'google_fit';

export const integrationService = {
  async getIntegrations(userId: string) {
    return prisma.integration.findMany({
      where: { userId },
      select: {
        id: true,
        provider: true,
        enabled: true,
        syncEnabled: true,
        lastSyncAt: true,
        createdAt: true,
        providerData: true,
      },
    });
  },

  async getIntegration(userId: string, provider: ProviderType) {
    return prisma.integration.findUnique({
      where: { userId_provider: { userId, provider } },
    });
  },

  async saveTokens(
    userId: string,
    provider: ProviderType,
    data: {
      accessToken: string;
      refreshToken?: string;
      tokenType?: string;
      expiresAt?: Date;
      scope?: string;
      providerData?: Prisma.InputJsonValue;
    },
  ) {
    return prisma.integration.upsert({
      where: { userId_provider: { userId, provider } },
      create: {
        userId,
        provider,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        tokenType: data.tokenType,
        expiresAt: data.expiresAt,
        scope: data.scope,
        providerData: (data.providerData ?? {}) as Prisma.InputJsonValue,
      },
      update: {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        tokenType: data.tokenType,
        expiresAt: data.expiresAt,
        scope: data.scope,
        providerData: (data.providerData ?? {}) as Prisma.InputJsonValue,
      },
    });
  },

  async updateLastSync(userId: string, provider: ProviderType) {
    return prisma.integration.update({
      where: { userId_provider: { userId, provider } },
      data: { lastSyncAt: new Date() },
    });
  },

  async setEnabled(userId: string, provider: ProviderType, enabled: boolean) {
    return prisma.integration.update({
      where: { userId_provider: { userId, provider } },
      data: { enabled },
    });
  },

  async disconnect(userId: string, provider: ProviderType) {
    await prisma.integration.delete({
      where: { userId_provider: { userId, provider } },
    });
  },
};

import { prisma } from '@/lib/prisma';

export const nutritionService = {
  async searchFoods(query: string, category?: string) {
    const where: Record<string, unknown> = {
      isPublic: true,
      name: { contains: query, mode: 'insensitive' },
    };
    if (category) where.category = category;
    return prisma.foodItem.findMany({ where: where as any, take: 20, orderBy: { name: 'asc' } });
  },

  async createFoodItem(data: { name: string; brand?: string; servingSize: number; servingUnit: string; calories: number; proteinG: number; carbsG: number; fatG: number; fiberG?: number; sodiumMg?: number; category: string; userId?: string }) {
    return prisma.foodItem.create({ data });
  },

  async createMealLog(userId: string, data: { date: Date; type: string; notes?: string }) {
    return prisma.mealLog.create({ data: { userId, ...data } });
  },

  async addFoodToMeal(mealId: string, foodId: string, amount: number) {
    const food = await prisma.foodItem.findUnique({ where: { id: foodId } });
    if (!food) throw new Error('Alimento não encontrado');
    const mf = await prisma.mealFood.create({ data: { mealId, foodId, amount } });
    await this.recalculateTotals(mealId);
    return mf;
  },

  async recalculateTotals(mealId: string) {
    const foods = await prisma.mealFood.findMany({ where: { mealId }, include: { food: true } });
    const totals = foods.reduce(
      (acc, mf) => ({
        calories: acc.calories + mf.food.calories * mf.amount,
        proteinG: acc.proteinG + mf.food.proteinG * mf.amount,
        carbsG: acc.carbsG + mf.food.carbsG * mf.amount,
        fatG: acc.fatG + mf.food.fatG * mf.amount,
        fiberG: acc.fiberG + (mf.food.fiberG ?? 0) * mf.amount,
      }),
      { calories: 0, proteinG: 0, carbsG: 0, fatG: 0, fiberG: 0 },
    );
    return prisma.mealTotals.upsert({
      where: { mealId },
      create: { mealId, ...totals },
      update: totals,
    });
  },

  async getMealLogs(userId: string, date: Date) {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);
    return prisma.mealLog.findMany({
      where: { userId, date: { gte: start, lte: end } },
      include: { foods: { include: { food: true } }, totals: true },
      orderBy: { date: 'asc' },
    });
  },

  async createDietPlan(userId: string, data: { title: string; description?: string; dailyCalories?: number; proteinGoal?: number; carbsGoal?: number; fatGoal?: number; endDate?: Date }) {
    return prisma.dietPlan.create({ data: { userId, ...data } });
  },

  async getDietPlans(userId: string) {
    return prisma.dietPlan.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
  },
};

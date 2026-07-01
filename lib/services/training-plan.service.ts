import { prisma } from '@/lib/prisma';
import { NotFoundError } from '@/lib/errors';

export const trainingPlanService = {
  async upsert(athleteId: string, day: string, exercises: { name: string; sets: string; reps: string; load: string }[]) {
    const existing = await prisma.trainingPlan.findFirst({
      where: { athleteId, day: day as never },
    });

    if (existing) {
      await prisma.exercise.deleteMany({ where: { planId: existing.id } });
      await prisma.trainingPlan.update({
        where: { id: existing.id },
        data: {
          exercises: {
            createMany: { data: exercises },
          },
        },
      });
      return existing.id;
    }

    const plan = await prisma.trainingPlan.create({
      data: {
        athleteId,
        day: day as never,
        exercises: {
          createMany: { data: exercises },
        },
      },
    });
    return plan.id;
  },

  async getByAthlete(athleteId: string) {
    return prisma.trainingPlan.findMany({
      where: { athleteId },
      include: { exercises: true },
      orderBy: { id: 'asc' },
    });
  },

  async getById(id: string) {
    const plan = await prisma.trainingPlan.findUnique({
      where: { id },
      include: { exercises: true },
    });
    if (!plan) throw new NotFoundError('Plano de treino não encontrado');
    return plan;
  },

  async delete(id: string) {
    await prisma.trainingPlan.delete({ where: { id } });
  },

  async addExercise(planId: string, exercise: { name: string; sets: string; reps: string; load: string }) {
    const plan = await prisma.trainingPlan.findUnique({ where: { id: planId } });
    if (!plan) throw new NotFoundError('Plano de treino não encontrado');
    return prisma.exercise.create({
      data: { ...exercise, planId },
    });
  },

  async removeExercise(exerciseId: string) {
    await prisma.exercise.delete({ where: { id: exerciseId } });
  },
};

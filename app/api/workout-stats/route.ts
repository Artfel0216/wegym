import { authenticate, handleError } from '@/lib/api-utils';
import { workoutSessionService } from '@/lib/services/workout-session.service';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  try {
    const session = await authenticate();
    const { searchParams } = new URL(request.url);
    const period = (searchParams.get('period') ?? 'week') as 'week' | 'month' | 'year';

    const athlete = await import('@/lib/prisma').then(({ prisma }) =>
      prisma.athlete.findUnique({ where: { userId: session.user.id }, select: { id: true } })
    );
    if (!athlete) {
      return Response.json({ error: 'Atleta não encontrado' }, { status: 404 });
    }

    const stats = await workoutSessionService.getStats(athlete.id, period);
    return Response.json({ data: stats });
  } catch (error) {
    return handleError(error);
  }
}

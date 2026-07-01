import { authenticate, handleError } from '@/lib/api-utils';
import { trainingPlanService } from '@/lib/services/training-plan.service';

export const runtime = 'nodejs';

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await authenticate();
    const { id } = await params;
    await trainingPlanService.delete(id);
    return Response.json({ success: true });
  } catch (error) {
    return handleError(error);
  }
}

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await authenticate();
    const { id } = await params;
    const plan = await trainingPlanService.getById(id);
    return Response.json({ data: plan });
  } catch (error) {
    return handleError(error);
  }
}

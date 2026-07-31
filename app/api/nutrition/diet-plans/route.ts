import { authenticate, handleError, json, created } from '@/lib/api-utils';
import { nutritionService } from '@/lib/services/nutrition.service';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const session = await authenticate();
    const plans = await nutritionService.getDietPlans(session.user.id);
    return json(plans);
  } catch (error) { return handleError(error); }
}

export async function POST(request: Request) {
  try {
    const session = await authenticate();
    const body = await request.json();
    const plan = await nutritionService.createDietPlan(session.user.id, body);
    return created(plan);
  } catch (error) { return handleError(error); }
}

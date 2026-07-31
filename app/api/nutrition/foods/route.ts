import { authenticate, handleError, json, created } from '@/lib/api-utils';
import { nutritionService } from '@/lib/services/nutrition.service';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q') ?? '';
    const category = searchParams.get('category') ?? undefined;
    const foods = await nutritionService.searchFoods(q, category);
    return json(foods);
  } catch (error) { return handleError(error); }
}

export async function POST(request: Request) {
  try {
    const session = await authenticate();
    const body = await request.json();
    const food = await nutritionService.createFoodItem({ ...body, userId: session.user.id });
    return created(food);
  } catch (error) { return handleError(error); }
}

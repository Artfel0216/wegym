import { authenticate, handleError, json, created } from '@/lib/api-utils';
import { nutritionService } from '@/lib/services/nutrition.service';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  try {
    const session = await authenticate();
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date') ? new Date(searchParams.get('date')!) : new Date();
    const meals = await nutritionService.getMealLogs(session.user.id, date);
    return json(meals);
  } catch (error) { return handleError(error); }
}

export async function POST(request: Request) {
  try {
    const session = await authenticate();
    const body = await request.json();
    if (body.foodId && body.mealId) {
      const mf = await nutritionService.addFoodToMeal(body.mealId, body.foodId, body.amount ?? 1);
      return json(mf);
    }
    const meal = await nutritionService.createMealLog(session.user.id, body);
    return created(meal);
  } catch (error) { return handleError(error); }
}

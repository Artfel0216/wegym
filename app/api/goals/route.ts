import { authenticate, handleError, json, created } from '@/lib/api-utils';
import { goalService } from '@/lib/services/goal.service';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  try {
    const session = await authenticate();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') ?? undefined;
    const goals = await goalService.list(session.user.id, status);
    return json(goals);
  } catch (error) { return handleError(error); }
}

export async function POST(request: Request) {
  try {
    const session = await authenticate();
    const body = await request.json();
    const goal = await goalService.create({ userId: session.user.id, ...body });
    return created(goal);
  } catch (error) { return handleError(error); }
}

export async function PATCH(request: Request) {
  try {
    const session = await authenticate();
    const { id, currentValue } = await request.json();
    const goal = await goalService.updateProgress(id, session.user.id, currentValue);
    return json(goal);
  } catch (error) { return handleError(error); }
}

export async function DELETE(request: Request) {
  try {
    const session = await authenticate();
    const { id } = await request.json();
    await goalService.remove(id, session.user.id);
    return json({ success: true });
  } catch (error) { return handleError(error); }
}

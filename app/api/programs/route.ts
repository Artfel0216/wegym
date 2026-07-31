import { authenticate, handleError, json, created } from '@/lib/api-utils';
import { programService } from '@/lib/services/program.service';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured');
    if (featured === 'true') {
      const programs = await programService.getFeatured();
      return json(programs);
    }
    const category = searchParams.get('category') ?? undefined;
    const level = searchParams.get('level') ?? undefined;
    const programs = await programService.list(category, level);
    return json(programs);
  } catch (error) { return handleError(error); }
}

export async function POST(request: Request) {
  try {
    await authenticate();
    const body = await request.json();
    const program = await programService.create(body);
    return created(program);
  } catch (error) { return handleError(error); }
}

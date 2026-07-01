import { authenticate, handleError } from '@/lib/api-utils';
import { progressService } from '@/lib/services/progress.service';

export const runtime = 'nodejs';

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await authenticate();
    const { id } = await params;
    await progressService.delete(id);
    return Response.json({ success: true });
  } catch (error) {
    return handleError(error);
  }
}

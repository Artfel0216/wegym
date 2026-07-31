import { authenticate, handleError, created } from '@/lib/api-utils';
import { socialService } from '@/lib/services/social.service';

export const runtime = 'nodejs';

export async function POST(request: Request, { params }: { params: Promise<{ postId: string }> }) {
  try {
    const session = await authenticate();
    const { postId } = await params;
    const { text } = await request.json();
    const comment = await socialService.addComment(postId, session.user.id, text);
    return created(comment);
  } catch (error) {
    return handleError(error);
  }
}

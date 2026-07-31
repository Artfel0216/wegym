import { authenticate, handleError, json, created } from '@/lib/api-utils';
import { socialService } from '@/lib/services/social.service';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  try {
    const session = await authenticate();
    const { searchParams } = new URL(request.url);
    if (searchParams.get('feed') === 'friends') {
      const posts = await socialService.getFeedForUser(session.user.id);
      return json(posts);
    }
    const page = Number(searchParams.get('page')) || 1;
    const posts = await socialService.getFeed(page);
    return json(posts);
  } catch (error) { return handleError(error); }
}

export async function POST(request: Request) {
  try {
    const session = await authenticate();
    const body = await request.json();
    const post = await socialService.createPost(session.user.id, body);
    return created(post);
  } catch (error) { return handleError(error); }
}

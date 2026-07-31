import { authenticate, handleError, json } from '@/lib/api-utils';
import { socialService } from '@/lib/services/social.service';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const session = await authenticate();
    const friends = await socialService.getFriends(session.user.id);
    return json(friends);
  } catch (error) { return handleError(error); }
}

export async function POST(request: Request) {
  try {
    const session = await authenticate();
    const { addresseeId, action, friendshipId } = await request.json();
    if (action === 'respond') {
      const result = await socialService.respondToFriend(friendshipId, 'accepted');
      return json(result);
    }
    const friendship = await socialService.sendFriendRequest(session.user.id, addresseeId);
    return json(friendship);
  } catch (error) { return handleError(error); }
}

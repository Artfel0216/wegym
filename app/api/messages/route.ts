import { authenticate, handleError, json, created } from '@/lib/api-utils';
import { engagementService } from '@/lib/services/engagement.service';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const session = await authenticate();
    const conversations = await engagementService.getConversations(session.user.id);
    const unread = await engagementService.getUnreadCount(session.user.id);
    return json({ conversations, unreadCount: unread });
  } catch (error) { return handleError(error); }
}

export async function POST(request: Request) {
  try {
    const session = await authenticate();
    const { receiverId, text } = await request.json();
    if (!receiverId || !text) return json({ error: 'Destinatário e texto são obrigatórios' }, 400);
    const msg = await engagementService.sendMessage(session.user.id, receiverId, text);
    return created(msg);
  } catch (error) { return handleError(error); }
}

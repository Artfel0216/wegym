import { authenticate, handleError } from '@/lib/api-utils';
import { subscriptionService } from '@/lib/services/subscription.service';

export const runtime = 'nodejs';

export async function POST() {
  try {
    const session = await authenticate();
    const result = await subscriptionService.cancel(session.user.id);
    return Response.json(result);
  } catch (error) {
    return handleError(error);
  }
}

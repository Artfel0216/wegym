import { userService } from '@/lib/services/user.service';
import { authenticate, handleError, json } from '@/lib/api-utils';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const session = await authenticate();
    const body = await request.json();
    const result = await userService.consent(session.user.id, body);
    return json(result);
  } catch (error) {
    return handleError(error);
  }
}

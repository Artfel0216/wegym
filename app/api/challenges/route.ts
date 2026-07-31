import { authenticate, handleError, json, created } from '@/lib/api-utils';
import { gamificationService } from '@/lib/services/gamification.service';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const session = await authenticate();
    const challenges = await gamificationService.listChallenges();
    return json(challenges);
  } catch (error) { return handleError(error); }
}

export async function POST(request: Request) {
  try {
    const session = await authenticate();
    const { challengeId } = await request.json();
    const participant = await gamificationService.joinChallenge(session.user.id, challengeId);
    return created(participant);
  } catch (error) { return handleError(error); }
}

import { handleError, json } from '@/lib/api-utils';
import { integrationService } from '@/lib/services/integration.service';
import { stravaService } from '@/lib/services/strava.service';
import { logger } from '@/lib/logger';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    if (error) {
      logger.warn({ error }, '[Strava] Auth error');
      return Response.redirect(`${process.env.NEXTAUTH_URL}/profile?integration=strava&error=${error}`);
    }

    if (!code || !state) {
      return json({ error: 'Código de autorização ou estado inválido' }, 400);
    }

    const stateData = JSON.parse(Buffer.from(state, 'base64').toString()) as {
      userId: string;
      provider: string;
    };

    const tokens = await stravaService.exchangeCode(code);

    await integrationService.saveTokens(stateData.userId, 'strava', tokens);

    logger.info({ userId: stateData.userId }, '[Strava] Connected successfully');

    return Response.redirect(`${process.env.NEXTAUTH_URL}/profile?integration=strava&success=true`);
  } catch (error) {
    logger.error({ error }, '[Strava] Callback error');
    return Response.redirect(`${process.env.NEXTAUTH_URL}/profile?integration=strava&error=callback_failed`);
  }
}

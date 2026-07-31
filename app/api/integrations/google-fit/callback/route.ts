import { handleError, json } from '@/lib/api-utils';
import { integrationService } from '@/lib/services/integration.service';
import { googleFitService } from '@/lib/services/google-fit.service';
import { logger } from '@/lib/logger';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    if (error) {
      logger.warn({ error }, '[GoogleFit] Auth error');
      return Response.redirect(`${process.env.NEXTAUTH_URL}/profile?integration=google_fit&error=${error}`);
    }

    if (!code || !state) {
      return json({ error: 'Código de autorização ou estado inválido' }, 400);
    }

    const stateData = JSON.parse(Buffer.from(state, 'base64').toString()) as {
      userId: string;
      provider: string;
    };

    const tokens = await googleFitService.exchangeCode(code);

    await integrationService.saveTokens(stateData.userId, 'google_fit', tokens);

    logger.info({ userId: stateData.userId }, '[GoogleFit] Connected successfully');

    return Response.redirect(`${process.env.NEXTAUTH_URL}/profile?integration=google_fit&success=true`);
  } catch (error) {
    logger.error({ error }, '[GoogleFit] Callback error');
    return Response.redirect(`${process.env.NEXTAUTH_URL}/profile?integration=google_fit&error=callback_failed`);
  }
}

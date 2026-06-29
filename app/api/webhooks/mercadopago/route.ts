import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const paymentId = body.data?.id ?? body.id;

    if (paymentId) {
      console.error(`[Webhook] Payment ${paymentId} - ${body.action ?? 'notification'}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('[Webhook] Erro ao processar notificação:', error);
    return NextResponse.json({ received: false }, { status: 500 });
  }
}

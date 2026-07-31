import { authenticate, handleError, json, created } from '@/lib/api-utils';
import { appointmentService } from '@/lib/services/appointment.service';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const session = await authenticate();
    const role = (session.user as { role?: string }).role ?? 'atleta';
    const appointments = await appointmentService.getAppointments(session.user.id, role as 'athlete' | 'personal');
    return json(appointments);
  } catch (error) { return handleError(error); }
}

export async function POST(request: Request) {
  try {
    const session = await authenticate();
    const body = await request.json();
    if (body.slotId) {
      const appointment = await appointmentService.book(session.user.id, body.slotId, body.type, body.notes);
      return created(appointment);
    }
    return json({ error: 'slotId é obrigatório' }, 400);
  } catch (error) { return handleError(error); }
}

export async function PATCH(request: Request) {
  try {
    const session = await authenticate();
    const { id, action } = await request.json();
    if (action === 'cancel') {
      await appointmentService.cancel(id, session.user.id);
      return json({ success: true });
    }
    if (action === 'confirm') {
      const appt = await appointmentService.confirm(id);
      return json(appt);
    }
    return json({ error: 'Ação inválida' }, 400);
  } catch (error) { return handleError(error); }
}

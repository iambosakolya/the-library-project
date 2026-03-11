// Placeholder email functions
// TODO: integrate with a real email provider (e.g. Resend, SendGrid, Nodemailer)

export async function sendRegistrationConfirmation(params: {
  userEmail: string;
  userName: string;
  eventTitle: string;
  eventType: 'club' | 'event';
  eventDate: Date;
  eventFormat?: string;
  eventLink?: string | null;
}) {
  console.log(
    `[Email] Registration confirmation → ${params.userEmail} for "${params.eventTitle}" (${params.eventType})`,
  );
}

export async function sendCancellationConfirmation(params: {
  userEmail: string;
  userName: string;
  eventTitle: string;
  eventType: 'club' | 'event';
}) {
  console.log(
    `[Email] Cancellation confirmation → ${params.userEmail} for "${params.eventTitle}" (${params.eventType})`,
  );
}

export async function sendParticipantNotification(params: {
  userEmail: string;
  userName: string;
  eventTitle: string;
  eventType: 'club' | 'event';
  changes: string[];
}) {
  console.log(
    `[Email] Participant notification → ${params.userEmail} for "${params.eventTitle}": ${params.changes.join(', ')}`,
  );
}

export async function sendOrganizerMessage(params: {
  userEmail: string;
  userName: string;
  eventTitle: string;
  eventType: 'club' | 'event';
  senderName: string;
  subject: string;
  message: string;
}) {
  console.log(
    `[Email] Organizer message → ${params.userEmail} from ${params.senderName}: "${params.subject}"`,
  );
}

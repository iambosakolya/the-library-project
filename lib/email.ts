// Email notification utilities
// This is a placeholder for actual email service integration (SendGrid, Resend, etc.)

type EmailData = {
  to: string;
  subject: string;
  message: string;
};

/**
 * Send registration confirmation email
 * Note: This is a placeholder. Integrate with your email service provider.
 */
export async function sendRegistrationConfirmation({
  userEmail,
  userName,
  eventTitle,
  eventType,
  eventDate,
  eventFormat,
  eventLink,
}: {
  userEmail: string;
  userName: string;
  eventTitle: string;
  eventType: 'club' | 'event';
  eventDate: Date;
  eventFormat: 'online' | 'offline';
  eventLink?: string | null;
}) {
  const emailData: EmailData = {
    to: userEmail,
    subject: `Registration Confirmed: ${eventTitle}`,
    message: `
      Hi ${userName},

      Your registration for ${eventType === 'club' ? 'the reading club' : 'the event'} "${eventTitle}" has been confirmed!

      Details:
      - Date: ${eventDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })}
      - Format: ${eventFormat === 'online' ? 'Online' : 'In-person'}
      ${eventFormat === 'online' && eventLink ? `- Link: ${eventLink}` : ''}

      Important:
      - You can cancel your registration up to 24 hours before the start time
      - View and manage your registrations in your account

      We look forward to seeing you there!

      Best regards,
      The Library Team
    `,
  };

  // Log email for development (replace with actual email service)
  console.log('📧 Email Notification:', emailData);

  // TODO: Integrate with actual email service
  // Example with Resend:
  // await resend.emails.send(emailData);

  return { success: true };
}

/**
 * Send cancellation confirmation email
 */
export async function sendCancellationConfirmation({
  userEmail,
  userName,
  eventTitle,
  eventType,
}: {
  userEmail: string;
  userName: string;
  eventTitle: string;
  eventType: 'club' | 'event';
}) {
  const emailData: EmailData = {
    to: userEmail,
    subject: `Registration Cancelled: ${eventTitle}`,
    message: `
      Hi ${userName},

      Your registration for ${eventType === 'club' ? 'the reading club' : 'the event'} "${eventTitle}" has been cancelled.

      If this was a mistake, you can register again from the ${eventType} page.

      Best regards,
      The Library Team
    `,
  };

  // Log email for development
  console.log('📧 Email Notification:', emailData);

  // TODO: Integrate with actual email service

  return { success: true };
}

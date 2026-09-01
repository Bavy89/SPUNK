import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const from = process.env.RESEND_FROM ?? 'Villekulla <onboarding@resend.dev>';
const adminEmail = process.env.ADMIN_EMAIL ?? 'bave.ado@gmail.com';
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export async function sendSignupNotification({
  userName,
  userEmail,
}: {
  userName: string;
  userEmail: string;
}) {
  await resend.emails.send({
    from,
    to: adminEmail,
    subject: `Ny bruker venter godkjenning: ${userName}`,
    html: `
      <div style="font-family:sans-serif;max-width:480px;color:#0D0D2B;">
        <h2 style="margin-bottom:8px;">Ny registrering</h2>
        <p style="margin:4px 0;"><strong>Navn:</strong> ${userName}</p>
        <p style="margin:4px 0;"><strong>E-post:</strong> ${userEmail}</p>
        <p style="margin-top:24px;">
          <a href="${siteUrl}/admin/brukere"
             style="background:#FF2D78;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;">
            Godkjenn bruker →
          </a>
        </p>
      </div>
    `,
  });
}

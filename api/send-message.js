/* =============================================================
   api/send-message.js — Vercel Serverless Function
   =====================================================================
   Called by contact.js when a user submits the contact form.

   Receives (JSON body):
     { name, email, subject, message }

   Action:
     Sends an email notification to AUTHOR_EMAIL via Resend API.
   ============================================================= */

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, subject, message } = req.body ?? {};

  // Basic validation
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const RESEND_API_KEY    = process.env.RESEND_API_KEY;
  const AUTHOR_EMAIL      = process.env.AUTHOR_EMAIL;
  const FROM_EMAIL        = process.env.FROM_EMAIL;
  const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL;

  let resendSuccess = false;
  let googleSuccess = false;
  let lastError = null;

  // 1. Forward to Google Apps Script (Google Sheet + Gmail) if configured
  if (GOOGLE_SCRIPT_URL) {
    try {
      const gRes = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ name, email, subject, message }),
        redirect: 'follow'
      });
      if (gRes.ok || gRes.type === 'opaque') {
        googleSuccess = true;
      }
    } catch (gErr) {
      console.error('Google Script error:', gErr);
      lastError = gErr.message;
    }
  }

  // 2. Send via Resend API if credentials exist
  if (RESEND_API_KEY && AUTHOR_EMAIL && FROM_EMAIL) {
    const toEmails = AUTHOR_EMAIL.split(',').map(e => e.trim());

    const emailPayload = {
      from: `LOGOS HUB <${FROM_EMAIL}>`,
      to:   toEmails,
      reply_to: `${name} <${email}>`,
      subject: `📬 New Contact Message: ${subject}`,
      html: `
        <div style="font-family: sans-serif; max-width: 540px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 8px;">
          <h2 style="color: #1a1a2e; margin-top: 0;">New Contact Form Message</h2>

          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr style="border-bottom: 1px solid #e5e7eb;">
              <td style="padding: 10px 0; color: #6b7280; font-size: 14px; width: 30%;">From</td>
              <td style="padding: 10px 0; color: #111827; font-weight: 600;">${escapeHtml(name)}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e5e7eb;">
              <td style="padding: 10px 0; color: #6b7280; font-size: 14px;">Email</td>
              <td style="padding: 10px 0; color: #111827; font-weight: 600;">
                <a href="mailto:${escapeHtml(email)}" style="color: #e07b39;">${escapeHtml(email)}</a>
              </td>
            </tr>
            <tr style="border-bottom: 1px solid #e5e7eb;">
              <td style="padding: 10px 0; color: #6b7280; font-size: 14px;">Subject</td>
              <td style="padding: 10px 0; color: #111827; font-weight: 600;">${escapeHtml(subject)}</td>
            </tr>
          </table>

          <div style="background: #fdf4ea; border-left: 4px solid #e07b39; border-radius: 4px; padding: 16px; margin-top: 16px;">
            <p style="margin: 0 0 8px 0; color: #6b4f2e; font-size: 12px; font-weight: 700; text-transform: uppercase;">Message Content:</p>
            <p style="margin: 0; color: #1e1408; font-size: 15px; line-height: 1.6; white-space: pre-wrap;">${escapeHtml(message)}</p>
          </div>

          <p style="color: #9ca3af; font-size: 12px; margin-top: 24px; margin-bottom: 0;">
            LOGOS HUB · Website contact form
          </p>
        </div>
      `
    };

    try {
      const response = await fetch('https://api.resend.com/emails', {
        method:  'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type':  'application/json'
        },
        body: JSON.stringify(emailPayload)
      });

      if (response.ok) {
        resendSuccess = true;
      } else {
        const err = await response.json().catch(() => ({}));
        console.error('Resend error:', err);
        lastError = err?.message || 'Resend error';
      }
    } catch (err) {
      console.error('Resend fetch error:', err);
      lastError = err.message;
    }
  }

  if (resendSuccess || googleSuccess) {
    return res.status(200).json({ success: true });
  }

  return res.status(502).json({ error: lastError || 'Failed to send message. Please check configuration.' });
}

function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

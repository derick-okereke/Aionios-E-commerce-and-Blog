/* =============================================================
   api/notify-purchase.js — Vercel Serverless Function
   =====================================================================
   Called by book-detail.js when buyer clicks "I've Made the Transfer".

   Receives (JSON body):
     { buyerEmail, bookTitle, bookPrice }

   Action:
     Sends an email to the AUTHOR_EMAIL address notifying them of
     a pending transfer, so they can verify and send the download link.

   Setup:
     1. Create a free account at resend.com
     2. Copy your API key and add it as RESEND_API_KEY in Vercel env vars
     3. Set AUTHOR_EMAIL in Vercel env vars (the author's receiving email)
     4. Deploy to Vercel — this file becomes the /api/notify-purchase route
   ============================================================= */

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { buyerEmail, bookTitle, bookPrice } = req.body ?? {};

  // Basic validation
  if (!buyerEmail || !bookTitle || !bookPrice) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const AUTHOR_EMAIL   = process.env.AUTHOR_EMAIL;   // e.g. dpriestoku@gmail.com
  const FROM_EMAIL     = process.env.FROM_EMAIL;     // e.g. noreply@logoshub.com (verified domain)

  if (!RESEND_API_KEY || !AUTHOR_EMAIL || !FROM_EMAIL) {
    console.error('Missing environment variables');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  // Build the notification email to the author
  const emailPayload = {
    from: `LOGOS HUB <${FROM_EMAIL}>`,
    to:   [AUTHOR_EMAIL],
    subject: `📚 New Book Purchase — ${bookTitle}`,
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 8px;">
        <h2 style="color: #1a1a2e; margin-top: 0;">New Purchase Notification</h2>
        <p style="color: #374151;">A buyer has made a bank transfer and is waiting for their download link.</p>

        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 10px 0; color: #6b7280; font-size: 14px; width: 40%;">Book</td>
            <td style="padding: 10px 0; color: #111827; font-weight: 600;">${bookTitle}</td>
          </tr>
          <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 10px 0; color: #6b7280; font-size: 14px;">Amount Expected</td>
            <td style="padding: 10px 0; color: #111827; font-weight: 600;">${bookPrice}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; color: #6b7280; font-size: 14px;">Buyer's Email</td>
            <td style="padding: 10px 0; color: #111827; font-weight: 600;">
              <a href="mailto:${buyerEmail}" style="color: #6c63ff;">${buyerEmail}</a>
            </td>
          </tr>
        </table>

        <div style="background: #f3f4f6; border-radius: 6px; padding: 16px; margin-top: 16px;">
          <p style="margin: 0; color: #374151; font-size: 14px;">
            <strong>Next steps:</strong><br>
            1. Check your Fidelity Bank app to confirm the transfer of <strong>${bookPrice}</strong> has been received.<br>
            2. Once confirmed, reply to this email or send the download link directly to <strong>${buyerEmail}</strong>.
          </p>
        </div>

        <p style="color: #9ca3af; font-size: 12px; margin-top: 24px; margin-bottom: 0;">
          LOGOS HUB · Automated purchase notification
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

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      console.error('Resend error:', err);
      return res.status(502).json({ error: 'Failed to send notification email' });
    }

    return res.status(200).json({ success: true });

  } catch (err) {
    console.error('Unexpected error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

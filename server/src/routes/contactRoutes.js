import { Router } from 'express';

const router = Router();

const RECIPIENT_EMAIL = process.env.CONTACT_TO_EMAIL || 'joaopedroandrad3@gmail.com';
const FROM_EMAIL = process.env.CONTACT_FROM_EMAIL || 'Portfólio João Pedro <onboarding@resend.dev>';

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// POST /api/contact -> valida e envia e-mail REAL diretamente para joaopedroandrad3@gmail.com via Resend
router.post('/', async (req, res) => {
  try {
    const name = String(req.body?.name || '').trim();
    const email = String(req.body?.email || '').trim();
    const subject = String(req.body?.subject || '').trim();
    const message = String(req.body?.message || '').trim();

    if (name.length < 2) {
      return res.status(400).json({ ok: false, error: 'name_invalid' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ ok: false, error: 'email_invalid' });
    }
    if (message.length < 8) {
      return res.status(400).json({ ok: false, error: 'message_short' });
    }

    const emailSubject = subject
      ? `[Portfólio] ${subject} — ${name}`
      : `[Portfólio] Novo contato de ${name}`;

    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      const mailtoBody = `Nome: ${name}\nE-mail: ${email}\n\n${message}`;
      const fallbackMailto = `mailto:${RECIPIENT_EMAIL}?subject=${encodeURIComponent(
        emailSubject
      )}&body=${encodeURIComponent(mailtoBody)}`;

      return res.status(503).json({
        ok: false,
        error: 'email_service_unconfigured',
        fallbackMailto,
      });
    }

    const htmlBody = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background:#07070c; color:#f6f6fa; padding:32px; border-radius:12px;">
        <div style="max-width:560px; margin:0 auto; background:#0e0c18; border:1px solid rgba(168,85,247,0.35); border-radius:12px; padding:28px;">
          <p style="margin:0 0 8px; font-size:11px; letter-spacing:2px; text-transform:uppercase; color:#c084fc;">
            NOVO CONTATO VIA PORTFÓLIO
          </p>
          <h2 style="margin:0 0 20px; font-size:20px; color:#ffffff;">
            ${escapeHtml(subject || 'Mensagem recebida')}
          </h2>
          <table style="width:100%; border-collapse:collapse; margin-bottom:20px; font-size:14px;">
            <tr>
              <td style="padding:6px 0; color:#a19eb8; width:90px;">Nome:</td>
              <td style="padding:6px 0; color:#ffffff; font-weight:600;">${escapeHtml(name)}</td>
            </tr>
            <tr>
              <td style="padding:6px 0; color:#a19eb8;">E-mail:</td>
              <td style="padding:6px 0;"><a href="mailto:${escapeHtml(email)}" style="color:#c084fc;">${escapeHtml(email)}</a></td>
            </tr>
          </table>
          <div style="background:#07060d; border:1px solid rgba(255,255,255,0.1); border-radius:8px; padding:16px; color:#e5e4f0; font-size:14px; line-height:1.6; white-space:pre-wrap;">${escapeHtml(message)}</div>
          <p style="margin:20px 0 0; font-size:12px; color:#85829c;">
            Responda diretamente a este e-mail para falar com ${escapeHtml(name)} (${escapeHtml(email)}).
          </p>
        </div>
      </div>
    `;

    const textBody = [
      `Novo contato recebido pelo seu portfólio (joaopedroandrade.vercel.app)`,
      ``,
      `Nome: ${name}`,
      `E-mail: ${email}`,
      `Assunto: ${subject || 'Contato via Portfólio'}`,
      ``,
      `Mensagem:`,
      message,
    ].join('\n');

    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [RECIPIENT_EMAIL],
        reply_to: email,
        subject: emailSubject,
        html: htmlBody,
        text: textBody,
      }),
    });

    const resendJson = await resendResponse.json().catch(() => ({}));

    if (!resendResponse.ok) {
      console.error('[ContactAPI] Resend error:', resendResponse.status, resendJson);
      return res.status(502).json({
        ok: false,
        error: 'email_delivery_failed',
      });
    }

    return res.status(201).json({
      ok: true,
      emailId: resendJson.id || null,
      deliveredTo: RECIPIENT_EMAIL,
      receivedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[ContactAPI] Unexpected error:', error);
    return res.status(500).json({ ok: false, error: 'server_error' });
  }
});

export default router;

import { Router } from 'express';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const router = Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const messagesFile = path.resolve(__dirname, '../../data/messages.json');

// POST /api/contact -> recebe mensagens do formulário e persiste localmente em JSON
router.post('/', async (req, res) => {
  try {
    const name = String(req.body?.name || '').trim();
    const email = String(req.body?.email || '').trim();
    const subject = String(req.body?.subject || '').trim();
    const message = String(req.body?.message || '').trim();

    if (name.length < 2) {
      return res.status(400).json({ error: 'name_invalid' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'email_invalid' });
    }
    if (message.length < 8) {
      return res.status(400).json({ error: 'message_short' });
    }

    const entry = {
      id: `SIG-${Date.now().toString(36).toUpperCase()}`,
      name,
      email,
      subject: subject || 'Contato via Portfólio',
      message,
      receivedAt: new Date().toISOString(),
    };

    await fs.mkdir(path.dirname(messagesFile), { recursive: true });
    let existing = [];
    try {
      const raw = await fs.readFile(messagesFile, 'utf-8');
      existing = JSON.parse(raw);
      if (!Array.isArray(existing)) existing = [];
    } catch {
      existing = [];
    }

    existing.unshift(entry);
    await fs.writeFile(messagesFile, JSON.stringify(existing, null, 2), 'utf-8');

    console.log(`[ContactAPI] Nova transmissão ${entry.id} recebida de ${entry.name} <${entry.email}>`);

    return res.status(201).json({
      ok: true,
      signalId: entry.id,
      receivedAt: entry.receivedAt,
    });
  } catch (error) {
    return res.status(500).json({ error: 'server_error', details: error.message });
  }
});

export default router;

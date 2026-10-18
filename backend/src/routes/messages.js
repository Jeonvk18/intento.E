import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import Message from '../models/Message.js';
import { requiereAdmin } from '../middleware/auth.js';

const router = Router();

// 5 mensajes cada 10 minutos por IP (anti-spam)
const limitarContacto = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Has enviado muchos mensajes. Intenta más tarde.' }
});

// Público: formulario de contacto
router.post('/', limitarContacto, async (req, res) => {
  const { nombre, correo, mensaje } = req.body || {};

  if (![nombre, correo, mensaje].every((v) => typeof v === 'string' && v.trim())) {
    return res.status(400).json({ error: 'Completa nombre, correo y mensaje' });
  }

  if (!/^\S+@\S+\.\S+$/.test(correo)) {
    return res.status(400).json({ error: 'El correo no es válido' });
  }

  try {
    await Message.create({ nombre, correo, mensaje });
    res.status(201).json({ ok: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Admin
router.get('/', requiereAdmin, async (_req, res) => {
  res.json(await Message.find().sort({ createdAt: -1 }).limit(500));
});

router.patch('/:id', requiereAdmin, async (req, res) => {
  const mensaje = await Message.findByIdAndUpdate(
    req.params.id,
    { leido: Boolean(req.body?.leido) },
    { new: true }
  );
  if (!mensaje) return res.status(404).json({ error: 'Mensaje no encontrado' });
  res.json(mensaje);
});

router.delete('/:id', requiereAdmin, async (req, res) => {
  const mensaje = await Message.findByIdAndDelete(req.params.id);
  if (!mensaje) return res.status(404).json({ error: 'Mensaje no encontrado' });
  res.json({ ok: true });
});

export default router;

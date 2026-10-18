import { Router } from 'express';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import Admin from '../models/Admin.js';

const router = Router();

// Máximo 10 intentos de login cada 15 minutos por IP (frena fuerza bruta)
const limitarLogin = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiados intentos. Intenta de nuevo en unos minutos.' }
});

router.post('/login', limitarLogin, async (req, res) => {
  const { correo, clave } = req.body || {};

  if (typeof correo !== 'string' || typeof clave !== 'string') {
    return res.status(400).json({ error: 'Correo y clave son obligatorios' });
  }

  const admin = await Admin.findOne({ correo: correo.toLowerCase().trim() });

  // Mismo mensaje si falla el correo o la clave, para no dar pistas
  if (!admin || !(await admin.verificarClave(clave))) {
    return res.status(401).json({ error: 'Credenciales incorrectas' });
  }

  const token = jwt.sign({ id: admin._id, correo: admin.correo }, process.env.JWT_SECRET, {
    expiresIn: '8h'
  });

  res.json({ token, correo: admin.correo });
});

export default router;

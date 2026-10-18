import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { requiereAdmin } from '../middleware/auth.js';

const router = Router();

const limitarPedidos = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiadas solicitudes. Intenta más tarde.' }
});

// Público: registrar un pedido.
// El servidor vuelve a calcular precios y total desde la base de datos,
// así nadie puede mandar un precio falso desde el navegador.
router.post('/', limitarPedidos, async (req, res) => {
  const { productos, metodoEnvio } = req.body || {};

  if (!Array.isArray(productos) || productos.length === 0 || productos.length > 20) {
    return res.status(400).json({ error: 'El pedido no tiene productos válidos' });
  }

  const nombres = productos.map((p) => p?.nombre);
  const catalogo = await Product.find({ nombre: { $in: nombres }, activo: true });
  const precios = new Map(catalogo.map((p) => [p.nombre, p.precio]));

  const items = [];
  for (const p of productos) {
    const cantidad = Number(p?.cantidad);
    if (!precios.has(p?.nombre) || !Number.isInteger(cantidad) || cantidad < 1 || cantidad > 99) {
      return res.status(400).json({ error: `Producto inválido: ${p?.nombre}` });
    }
    items.push({ nombre: p.nombre, precio: precios.get(p.nombre), cantidad });
  }

  const total = items.reduce((suma, i) => suma + i.precio * i.cantidad, 0);

  try {
    const pedido = await Order.create({ productos: items, total, metodoEnvio });
    res.status(201).json({ id: pedido._id, total: pedido.total });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Admin
router.get('/', requiereAdmin, async (_req, res) => {
  res.json(await Order.find().sort({ createdAt: -1 }).limit(500));
});

router.patch('/:id', requiereAdmin, async (req, res) => {
  const { estado } = req.body || {};
  try {
    const pedido = await Order.findByIdAndUpdate(
      req.params.id,
      { estado },
      { new: true, runValidators: true }
    );
    if (!pedido) return res.status(404).json({ error: 'Pedido no encontrado' });
    res.json(pedido);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', requiereAdmin, async (req, res) => {
  const pedido = await Order.findByIdAndDelete(req.params.id);
  if (!pedido) return res.status(404).json({ error: 'Pedido no encontrado' });
  res.json({ ok: true });
});

export default router;

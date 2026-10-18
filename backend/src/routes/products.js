import { Router } from 'express';
import Product from '../models/Product.js';
import { requiereAdmin } from '../middleware/auth.js';

const router = Router();

// Público: catálogo activo
router.get('/', async (_req, res) => {
  const productos = await Product.find({ activo: true }).sort({ temporada: 1, createdAt: 1 });
  res.json(productos);
});

// Admin: todos los productos (incluye inactivos)
router.get('/todos', requiereAdmin, async (_req, res) => {
  res.json(await Product.find().sort({ createdAt: 1 }));
});

router.post('/', requiereAdmin, async (req, res) => {
  try {
    const producto = await Product.create(req.body);
    res.status(201).json(producto);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/:id', requiereAdmin, async (req, res) => {
  try {
    const producto = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(producto);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', requiereAdmin, async (req, res) => {
  const producto = await Product.findByIdAndDelete(req.params.id);
  if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });
  res.json({ ok: true });
});

export default router;

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { conectarDB } from './config/db.js';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';
import messageRoutes from './routes/messages.js';

const app = express();

const origenesPermitidos = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origen, callback) {
      // Permite herramientas sin origen (curl/Postman) y los orígenes configurados
      if (!origen || origenesPermitidos.includes(origen)) return callback(null, true);
      callback(new Error('Origen no permitido por CORS'));
    }
  })
);
app.use(express.json({ limit: '50kb' }));

app.get('/api/salud', (_req, res) => {
  res.json({ ok: true, db: mongoose.connection.readyState === 1 });
});

app.use('/api/auth', authRoutes);
app.use('/api/productos', productRoutes);
app.use('/api/pedidos', orderRoutes);
app.use('/api/mensajes', messageRoutes);

app.use((_req, res) => res.status(404).json({ error: 'Ruta no encontrada' }));

// Manejo central de errores (incluye errores de funciones async en Express 4)
app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Express 4 no captura promesas rechazadas en rutas async: lo hacemos global
process.on('unhandledRejection', (motivo) => console.error('Promesa rechazada:', motivo));

const PUERTO = process.env.PORT || 4000;

conectarDB()
  .then(() => app.listen(PUERTO, () => console.log(`API lista en el puerto ${PUERTO} 🚀`)))
  .catch((error) => {
    console.error('No se pudo iniciar el servidor:', error.message);
    process.exit(1);
  });

export default app;

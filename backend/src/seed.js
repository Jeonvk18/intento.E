import 'dotenv/config';
import mongoose from 'mongoose';
import { conectarDB } from './config/db.js';
import Product from './models/Product.js';
import Admin from './models/Admin.js';

const productosIniciales = [
  {
    nombre: 'Encurtido de Pepino',
    precio: 3.5,
    imagen: 'img2.webp',
    alt: 'Pepino',
    descripcion: 'Crujiente, fresco y con el equilibrio perfecto entre acidez y sabor.',
    presentacion: '110 g'
  },
  {
    nombre: 'Encurtido de Rábano',
    precio: 3.5,
    imagen: 'img1.webp',
    alt: 'Rábano',
    descripcion: 'Una opción diferente, deliciosa y perfecta para cualquier comida.',
    presentacion: '110 g'
  },
  {
    nombre: 'Encurtido de Mango',
    precio: 4.0,
    imagen: 'img7.webp',
    alt: 'Encurtido de Mango de Encurtidos Classic\'s',
    descripcion:
      'Preparado de manera artesanal para ofrecerte una combinación especial de sabor y frescura.',
    presentacion: '120 g',
    temporada: true
  }
];

async function sembrar() {
  await conectarDB();

  // upsert: se puede ejecutar varias veces sin duplicar
  for (const producto of productosIniciales) {
    await Product.updateOne({ nombre: producto.nombre }, { $set: producto }, { upsert: true });
  }
  console.log(`Productos sembrados: ${productosIniciales.length}`);

  const correo = process.env.ADMIN_EMAIL;
  const clave = process.env.ADMIN_PASSWORD;

  if (!correo || !clave) {
    console.log('ADMIN_EMAIL / ADMIN_PASSWORD no definidos: no se creó administrador.');
  } else {
    const passwordHash = await Admin.hashClave(clave);
    await Admin.updateOne({ correo: correo.toLowerCase() }, { $set: { passwordHash } }, { upsert: true });
    console.log(`Administrador listo: ${correo}`);
  }

  await mongoose.disconnect();
}

sembrar().catch((error) => {
  console.error(error);
  process.exit(1);
});

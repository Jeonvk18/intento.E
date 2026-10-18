import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true, trim: true, unique: true },
    precio: { type: Number, required: true, min: 0 },
    imagen: { type: String, required: true },
    alt: { type: String, default: '' },
    descripcion: { type: String, default: '' },
    presentacion: { type: String, default: '' },
    temporada: { type: Boolean, default: false },
    activo: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model('Product', productSchema);

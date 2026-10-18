import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    precio: { type: Number, required: true, min: 0 },
    cantidad: { type: Number, required: true, min: 1 }
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    productos: { type: [itemSchema], validate: (v) => v.length > 0 },
    total: { type: Number, required: true, min: 0 },
    metodoEnvio: { type: String, enum: ['whatsapp', 'instagram'], required: true },
    estado: { type: String, enum: ['nuevo', 'atendido', 'cancelado'], default: 'nuevo' }
  },
  { timestamps: true }
);

export default mongoose.model('Order', orderSchema);

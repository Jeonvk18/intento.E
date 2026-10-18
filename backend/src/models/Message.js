import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true, trim: true, maxlength: 80 },
    correo: { type: String, required: true, trim: true, lowercase: true, maxlength: 120 },
    mensaje: { type: String, required: true, trim: true, maxlength: 1000 },
    leido: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.model('Message', messageSchema);

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const adminSchema = new mongoose.Schema(
  {
    correo: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true }
  },
  { timestamps: true }
);

adminSchema.methods.verificarClave = function (clave) {
  return bcrypt.compare(clave, this.passwordHash);
};

adminSchema.statics.hashClave = function (clave) {
  return bcrypt.hash(clave, 10);
};

export default mongoose.model('Admin', adminSchema);

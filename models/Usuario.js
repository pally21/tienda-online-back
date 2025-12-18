const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');

const usuarioSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es requerido'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'El email es requerido'],
    unique: true,
    lowercase: true,
    match: [/.+@.+\..+/, 'Email inválido']
  },
  password: {
    type: String,
    required: [true, 'La contraseña es requerida'],
    minlength: 6,
    select: false // No incluir en consultas por defecto
  },
  role: {
    type: String,
    enum: ['USER', 'ADMIN'],
    default: 'USER'
  },
  estado: {
    type: String,
    enum: ['activo', 'suspendido', 'inactivo'],
    default: 'activo'
  },
  fechaRegistro: {
    type: Date,
    default: Date.now
  },
  ultimaCompra: Date,
  apellido: String,
  direccion: String
}, { timestamps: true });

// Hash password antes de guardar
usuarioSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    this.password = await bcryptjs.hash(this.password, 10);
    next();
  } catch (err) {
    next(err);
  }
});

// Método para comparar contraseñas
usuarioSchema.methods.compararPassword = async function(passwordIngresada) {
  return await bcryptjs.compare(passwordIngresada, this.password);
};

module.exports = mongoose.model('Usuario', usuarioSchema);

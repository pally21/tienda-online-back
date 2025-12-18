const mongoose = require('mongoose');

const pedidoSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  items: [
    {
      producto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Producto'
      },
      nombre: String,
      precio: Number,
      cantidad: Number
    }
  ],
  total: {
    type: Number,
    required: [true, 'El total es requerido'],
    min: 0
  },
  estado: {
    type: String,
    enum: ['Pendiente', 'Procesando', 'Enviado', 'Entregado', 'Cancelado'],
    default: 'Pendiente'
  },
  cliente: {
    nombre: String,
    email: String,
    telefono: String,
    direccion: String,
    comuna: String,
    region: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('Pedido', pedidoSchema);

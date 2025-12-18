const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
require('dotenv').config();

const usuarioSchema = new mongoose.Schema({
  nombre: String,
  email: String,
  password: String,
  role: String,
  estado: String,
  fechaRegistro: Date
});

mongoose.connect(process.env.MONGODB_URI, {
  connectTimeoutMS: 60000,
  socketTimeoutMS: 60000
}).then(async () => {
  const Usuario = mongoose.model('Usuario', usuarioSchema);
  
  const passwordHash = await bcryptjs.hash('admin123', 10);
  
  await Usuario.create({
    nombre: 'Admin',
    email: 'admin@tienda.com',
    password: passwordHash,
    role: 'ADMIN',
    estado: 'activo',
    fechaRegistro: new Date()
  });
  
  console.log('✅ Admin creado: admin@tienda.com / admin123');
  process.exit(0);
}).catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});

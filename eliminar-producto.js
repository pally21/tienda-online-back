const mongoose = require('mongoose');
require('dotenv').config();

const Producto = require('./models/Producto');

mongoose.connect(process.env.MONGODB_URI, {
  connectTimeoutMS: 180000,
  socketTimeoutMS: 180000
}).then(async () => {
  try {
    // Listar todos los productos
    const productos = await Producto.find({}, 'nombre precio stock');
    
    console.log('\n📦 PRODUCTOS EN LA BASE DE DATOS:\n');
    productos.forEach((p, i) => {
      console.log(`${i + 1}. ${p.nombre} - $${p.precio} (Stock: ${p.stock})`);
      console.log(`   ID: ${p._id}\n`);
    });
    
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}).catch(err => {
  console.error('❌ Error conexión:', err.message);
  process.exit(1);
});

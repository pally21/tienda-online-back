const mongoose = require('mongoose');
require('dotenv').config();

const Producto = require('./models/Producto');

mongoose.connect(process.env.MONGODB_URI, {
  connectTimeoutMS: 120000,
  socketTimeoutMS: 120000
}).then(async () => {
  try {
    const productos = [
      {
        nombre: "Polera Deportiva",
        descripcion: "Polera deportiva cómoda y transpirable para ejercicio",
        precio: 29990,
        categoria: "Ropa",
        stock: 25,
        imagen: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
        activo: true
      },
      {
        nombre: "Lentes de Sol",
        descripcion: "Lentes de sol con protección UV 100% y diseño moderno",
        precio: 69990,
        categoria: "Accesorios",
        stock: 30,
        imagen: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop",
        activo: true
      }
    ];

    const resultado = await Producto.insertMany(productos);
    
    console.log('✅ Productos agregados correctamente');
    console.log('📦 Polera Deportiva - $29.990');
    console.log('📦 Lentes de Sol - $69.990');
    
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}).catch(err => {
  console.error('❌ Error conexión:', err.message);
  process.exit(1);
});

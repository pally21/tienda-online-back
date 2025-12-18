require('dotenv').config();
const mongoose = require('mongoose');
const Producto = require('./models/Producto');

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Conectado a MongoDB Atlas');
    insertarProductos();
  })
  .catch(err => {
    console.error('❌ Error conectando a MongoDB:', err.message);
    process.exit(1);
  });

// Los 5 productos que tienes en tu página CON URLS DE IMÁGENES
const productos = [
  {
    nombre: "Camisa Casual",
    descripcion: "Camisa casual cómoda de algodón puro. Perfecta para el día a día",
    precio: 49990,
    categoria: "Ropa",
    stock: 25,
    imagen: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
    activo: true
  },
  {
    nombre: "Zapatos Deportivos",
    descripcion: "Zapatos deportivos de alta calidad para correr y entrenamientos",
    precio: 89990,
    categoria: "Calzado",
    stock: 20,
    imagen: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
    activo: true
  },
  {
    nombre: "Mochila Ejecutiva",
    descripcion: "Mochila ejecutiva para laptop y documentos con múltiples compartimentos",
    precio: 79990,
    categoria: "Accesorios",
    stock: 15,
    imagen: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop",
    activo: true
  },
  {
    nombre: "Reloj Inteligente",
    descripcion: "Reloj inteligente con monitor de salud, GPS y resistencia al agua",
    precio: 199990,
    categoria: "Tecnología",
    stock: 12,
    imagen: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
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

async function insertarProductos() {
  try {
    // Eliminar todos los productos anteriores
    await Producto.deleteMany({});
    console.log('🗑️  Productos anteriores eliminados\n');

    // Insertar los 5 productos reales de tu página CON IMÁGENES
    const productosCreados = await Producto.insertMany(productos);
    console.log(`✅ ${productosCreados.length} productos creados exitosamente\n`);
    
    console.log('📋 PRODUCTOS DE TU PÁGINA EN MONGODB CON IMÁGENES:\n');
    
    productosCreados.forEach((prod, idx) => {
      console.log(`${idx + 1}. ${prod.nombre}`);
      console.log(`   💵 Precio: $${prod.precio.toLocaleString('es-CL')}`);
      console.log(`   📦 Stock: ${prod.stock}`);
      console.log(`   🖼️  Imagen: ${prod.imagen}`);
      console.log(`   📅 Creado: ${prod.createdAt}`);
      console.log();
    });

    console.log('═════════════════════════════════════════════════════════════════');
    console.log('✨ Los productos ahora tienen URLs de imágenes de Unsplash');
    console.log('═════════════════════════════════════════════════════════════════\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error insertando productos:', error.message);
    process.exit(1);
  }
}

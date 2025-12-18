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

// Los 5 productos que tienes en tu página
const productos = [
  {
    nombre: "Camisa Casual",
    descripcion: "Camisa casual cómoda de algodón puro",
    precio: 49990,
    categoria: "Ropa",
    stock: 25,
    imagen: "camisa-casual.jpg",
    activo: true
  },
  {
    nombre: "Zapatos Deportivos",
    descripcion: "Zapatos deportivos de alta calidad para correr",
    precio: 89990,
    categoria: "Calzado",
    stock: 20,
    imagen: "zapatos-deportivos.jpg",
    activo: true
  },
  {
    nombre: "Mochila Ejecutiva",
    descripcion: "Mochila ejecutiva para laptop y documentos",
    precio: 79990,
    categoria: "Accesorios",
    stock: 15,
    imagen: "mochila-ejecutiva.jpg",
    activo: true
  },
  {
    nombre: "Reloj Inteligente",
    descripcion: "Reloj inteligente con monitor de salud y GPS",
    precio: 199990,
    categoria: "Tecnología",
    stock: 12,
    imagen: "reloj-inteligente.jpg",
    activo: true
  },
  {
    nombre: "Lentes de Sol",
    descripcion: "Lentes de sol con protección UV 100%",
    precio: 69990,
    categoria: "Accesorios",
    stock: 30,
    imagen: "lentes-de-sol.jpg",
    activo: true
  }
];

async function insertarProductos() {
  try {
    // Eliminar todos los productos anteriores
    await Producto.deleteMany({});
    console.log('🗑️  Productos anteriores eliminados\n');

    // Insertar los 5 productos reales de tu página
    const productosCreados = await Producto.insertMany(productos);
    console.log(`✅ ${productosCreados.length} productos creados exitosamente\n`);
    
    console.log('📋 PRODUCTOS DE TU PÁGINA EN MONGODB:\n');
    
    productosCreados.forEach((prod, idx) => {
      console.log(`${idx + 1}. ${prod.nombre}`);
      console.log(`   💵 Precio: $${prod.precio.toLocaleString('es-CL')}`);
      console.log(`   📦 Stock: ${prod.stock}`);
      console.log(`   🏷️  Categoría: ${prod.categoria}`);
      console.log(`   🆔 ID: ${prod._id}\n`);
    });

    console.log('═'.repeat(80));
    console.log(`\n✅ Total de productos: ${productosCreados.length}`);
    console.log('✅ Base de datos actualizada\n');
    
    // Cerrar conexión
    await mongoose.connection.close();
    console.log('🔌 Conexión cerrada');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al insertar productos:', error.message);
    process.exit(1);
  }
}

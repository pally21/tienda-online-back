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

// Datos de los 6 productos
const productos = [
  {
    nombre: 'Café Premium Arábica',
    descripcion: 'Café de grano entero, 100% arábica, tostado medio. Perfecto para espresso y filtrado.',
    precio: 12990,
    categoria: 'Café',
    stock: 50,
    imagen: 'cafe-arabica.jpg',
    activo: true
  },
  {
    nombre: 'Té Verde Matcha',
    descripcion: 'Té verde en polvo de Japón. Alto en antioxidantes. Perfecto para smoothies y bebidas calientes.',
    precio: 8990,
    categoria: 'Té',
    stock: 30,
    imagen: 'te-matcha.jpg',
    activo: true
  },
  {
    nombre: 'Chocolate 70% Cacao',
    descripcion: 'Chocolate oscuro belga con 70% cacao puro. Sin azúcares añadidos.',
    precio: 6990,
    categoria: 'Chocolates',
    stock: 45,
    imagen: 'chocolate-70.jpg',
    activo: true
  },
  {
    nombre: 'Miel Pura Orgánica',
    descripcion: 'Miel 100% natural y orgánica. Directamente de apicultores locales.',
    precio: 9990,
    categoria: 'Alimentos',
    stock: 25,
    imagen: 'miel-organica.jpg',
    activo: true
  },
  {
    nombre: 'Almendras Tostadas',
    descripcion: 'Almendras sin sal, tostadas naturalmente. Ricas en proteína y grasas saludables.',
    precio: 7990,
    categoria: 'Frutos Secos',
    stock: 40,
    imagen: 'almendras-tostadas.jpg',
    activo: true
  },
  {
    nombre: 'Aceite de Oliva Extra Virgen',
    descripcion: 'Aceite de oliva extra virgen chileno. Prensado en frío, 500ml.',
    precio: 11990,
    categoria: 'Aceites',
    stock: 35,
    imagen: 'aceite-oliva.jpg',
    activo: true
  }
];

async function insertarProductos() {
  try {
    // Primero, eliminamos los productos anteriores
    await Producto.deleteMany({});
    console.log('🗑️  Productos anteriores eliminados');

    // Insertamos los nuevos productos
    const productosCreados = await Producto.insertMany(productos);
    console.log(`✅ ${productosCreados.length} productos creados exitosamente`);
    
    console.log('\n📋 PRODUCTOS CREADOS:\n');
    productosCreados.forEach((prod, idx) => {
      console.log(`${idx + 1}. ${prod.nombre}`);
      console.log(`   Precio: $${prod.precio.toLocaleString('es-CL')}`);
      console.log(`   Stock: ${prod.stock}`);
      console.log(`   ID: ${prod._id}\n`);
    });

    // Cerrar conexión
    await mongoose.connection.close();
    console.log('🔌 Conexión cerrada');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al insertar productos:', error.message);
    process.exit(1);
  }
}

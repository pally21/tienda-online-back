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

// Solo los 8 productos reales de tu página
const productos = [
  {
    nombre: "Laptop Pro 15",
    descripcion: "Laptop profesional de alto rendimiento. Procesador Intel i7, 16GB RAM, SSD 512GB",
    precio: 899990,
    categoria: "Electrónica",
    stock: 15,
    imagen: "laptop-pro-15.jpg",
    activo: true
  },
  {
    nombre: "Mouse Inalámbrico",
    descripcion: "Mouse ergonómico con conexión Bluetooth. Batería de 18 meses",
    precio: 29990,
    categoria: "Accesorios",
    stock: 50,
    imagen: "mouse-inalambrico.jpg",
    activo: true
  },
  {
    nombre: "Teclado Mecánico RGB",
    descripcion: "Teclado gaming con iluminación personalizable. Switches Mechanical",
    precio: 79990,
    categoria: "Accesorios",
    stock: 30,
    imagen: "teclado-mecanico.jpg",
    activo: true
  },
  {
    nombre: "Monitor 27 4K",
    descripcion: "Monitor Ultra HD para profesionales. Resolución 4K, 60Hz, HDR",
    precio: 399990,
    categoria: "Electrónica",
    stock: 10,
    imagen: "monitor-27-4k.jpg",
    activo: true
  },
  {
    nombre: "Auriculares Bluetooth",
    descripcion: "Auriculares con cancelación de ruido activa. Batería 30 horas",
    precio: 129990,
    categoria: "Audio",
    stock: 25,
    imagen: "auriculares-bluetooth.jpg",
    activo: true
  },
  {
    nombre: "Webcam Full HD",
    descripcion: "Cámara web con micrófono integrado. Resolución 1080p a 30fps",
    precio: 59990,
    categoria: "Accesorios",
    stock: 35,
    imagen: "webcam-full-hd.jpg",
    activo: true
  },
  {
    nombre: "SSD 1TB NVMe",
    descripcion: "Disco sólido de alta velocidad. Velocidad lectura 3500MB/s",
    precio: 89990,
    categoria: "Almacenamiento",
    stock: 40,
    imagen: "ssd-1tb.jpg",
    activo: true
  },
  {
    nombre: "Hub USB-C 7 en 1",
    descripcion: "Adaptador multipuerto para laptop. Incluye HDMI, USB 3.0, SD card",
    precio: 39990,
    categoria: "Accesorios",
    stock: 45,
    imagen: "hub-usb-c.jpg",
    activo: true
  }
];

async function insertarProductos() {
  try {
    // Eliminar todos los productos anteriores
    await Producto.deleteMany({});
    console.log('🗑️  Productos anteriores eliminados\n');

    // Insertar solo los 8 productos reales
    const productosCreados = await Producto.insertMany(productos);
    console.log(`✅ ${productosCreados.length} productos creados exitosamente\n`);
    
    console.log('📋 PRODUCTOS FINALES:\n');
    
    productosCreados.forEach((prod, idx) => {
      console.log(`${idx + 1}. ${prod.nombre}`);
      console.log(`   💵 Precio: $${prod.precio.toLocaleString('es-CL')}`);
      console.log(`   📦 Stock: ${prod.stock}`);
      console.log(`   🏷️  Categoría: ${prod.categoria}`);
      console.log(`   🆔 ID: ${prod._id}\n`);
    });

    console.log('═'.repeat(80));
    console.log(`\n✅ Total de productos finales: ${productosCreados.length}`);
    console.log('✅ Base de datos limpia y lista\n');
    
    // Cerrar conexión
    await mongoose.connection.close();
    console.log('🔌 Conexión cerrada');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al insertar productos:', error.message);
    process.exit(1);
  }
}

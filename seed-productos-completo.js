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

// Productos actualizados de tu página + adicionales
const productos = [
  // PRODUCTOS ORIGINALES DE TU PÁGINA
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
  },

  // PRODUCTOS ADICIONALES
  {
    nombre: "Ratón Gamer Inalámbrico",
    descripcion: "Ratón gaming profesional con sensor de 16000 DPI. RGB personalizable",
    precio: 49990,
    categoria: "Gaming",
    stock: 28,
    imagen: "raton-gamer.jpg",
    activo: true
  },
  {
    nombre: "Mousepad Gaming Grande",
    descripcion: "Mousepad RGB de 80x30cm. Superficie de tela de alta precisión",
    precio: 19990,
    categoria: "Gaming",
    stock: 60,
    imagen: "mousepad-gaming.jpg",
    activo: true
  },
  {
    nombre: "Cable HDMI 2.1 4K",
    descripcion: "Cable HDMI de 3 metros. Soporta 4K a 120Hz y 8K a 60Hz",
    precio: 14990,
    categoria: "Cables",
    stock: 80,
    imagen: "cable-hdmi.jpg",
    activo: true
  },
  {
    nombre: "Cargador USB-C Rápido 65W",
    descripcion: "Cargador rápido GaN. Compatible con laptops y smartphones",
    precio: 34990,
    categoria: "Accesorios",
    stock: 55,
    imagen: "cargador-usb-c.jpg",
    activo: true
  },
  {
    nombre: "Almohada Ergonómica para PC",
    descripcion: "Almohada para descanso cervical. Memoria de espuma viscoelástica",
    precio: 24990,
    categoria: "Accesorios",
    stock: 40,
    imagen: "almohada-ergonomica.jpg",
    activo: true
  },
  {
    nombre: "Base Refrigerante para Laptop",
    descripcion: "Base con 5 ventiladores. Reduce temperatura hasta 15°C",
    precio: 44990,
    categoria: "Accesorios",
    stock: 22,
    imagen: "base-refrigerante.jpg",
    activo: true
  },
  {
    nombre: "Mochila Tech Premium",
    descripcion: "Mochila para laptop de 15 pulgadas. Con puerto USB integrado",
    precio: 59990,
    categoria: "Accesorios",
    stock: 18,
    imagen: "mochila-tech.jpg",
    activo: true
  },
  {
    nombre: "Estera Antifatiga de Pie",
    descripcion: "Estera ergonómica para escritorio. 60x90cm con cojinete suave",
    precio: 29990,
    categoria: "Bienestar",
    stock: 33,
    imagen: "estera-antifatiga.jpg",
    activo: true
  },
  {
    nombre: "Dock Thunderbolt 3",
    descripcion: "Estación de acoplamiento Thunderbolt 3. Soporta dual 4K",
    precio: 249990,
    categoria: "Accesorios",
    stock: 8,
    imagen: "dock-thunderbolt.jpg",
    activo: true
  },
  {
    nombre: "Pantalla Portátil 15.6 USB-C",
    descripcion: "Monitor portátil Full HD. Alimentación por USB-C, peso solo 1.5kg",
    precio: 189990,
    categoria: "Electrónica",
    stock: 12,
    imagen: "pantalla-portatil.jpg",
    activo: true
  }
];

async function insertarProductos() {
  try {
    // Eliminar los productos anteriores
    await Producto.deleteMany({});
    console.log('🗑️  Productos anteriores eliminados\n');

    // Insertar los nuevos productos
    const productosCreados = await Producto.insertMany(productos);
    console.log(`✅ ${productosCreados.length} productos creados exitosamente\n`);
    
    console.log('📋 PRODUCTOS CREADOS:\n');
    
    // Agrupar por categoría
    const porCategoria = {};
    productosCreados.forEach(prod => {
      if (!porCategoria[prod.categoria]) {
        porCategoria[prod.categoria] = [];
      }
      porCategoria[prod.categoria].push(prod);
    });

    Object.keys(porCategoria).sort().forEach(categoria => {
      console.log(`\n🏷️  ${categoria}`);
      console.log('─'.repeat(80));
      porCategoria[categoria].forEach((prod, idx) => {
        console.log(`${idx + 1}. ${prod.nombre}`);
        console.log(`   💵 Precio: $${prod.precio.toLocaleString('es-CL')}`);
        console.log(`   📦 Stock: ${prod.stock}`);
        console.log(`   🆔 ID: ${prod._id}`);
      });
    });

    console.log('\n' + '═'.repeat(80));
    console.log(`\n✅ Total de productos creados: ${productosCreados.length}`);
    console.log(`✅ Total de categorías: ${Object.keys(porCategoria).length}`);
    
    // Cerrar conexión
    await mongoose.connection.close();
    console.log('\n🔌 Conexión cerrada');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al insertar productos:', error.message);
    process.exit(1);
  }
}

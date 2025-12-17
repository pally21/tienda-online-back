const mysql = require('mysql2/promise');
require('dotenv').config();

const crearBD = async () => {
  try {
    // Conectar sin especificar BD
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT
    });

    console.log('📦 Creando base de datos...');

    // Crear BD
    await connection.query(
      `CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`
    );

    // Usar BD
    await connection.query(`USE ${process.env.DB_NAME}`);

    // Crear tabla usuarios
    await connection.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('ADMIN', 'USER') DEFAULT 'USER',
        fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Tabla usuarios creada');

    // Crear tabla productos
    await connection.query(`
      CREATE TABLE IF NOT EXISTS productos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(255) NOT NULL,
        descripcion TEXT,
        precio DECIMAL(10, 2) NOT NULL,
        stock INT DEFAULT 0,
        categoria VARCHAR(100),
        imagen VARCHAR(255),
        fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Tabla productos creada');

    // Crear tabla pedidos
    await connection.query(`
      CREATE TABLE IF NOT EXISTS pedidos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        usuario_id INT NOT NULL,
        total DECIMAL(10, 2) NOT NULL,
        estado ENUM('PENDIENTE', 'CONFIRMADO', 'ENVIADO', 'ENTREGADO', 'CANCELADO') DEFAULT 'PENDIENTE',
        fecha_pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
      )
    `);
    console.log('✅ Tabla pedidos creada');

    // Crear tabla detalle_pedidos
    await connection.query(`
      CREATE TABLE IF NOT EXISTS detalle_pedidos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        pedido_id INT NOT NULL,
        producto_id INT NOT NULL,
        cantidad INT NOT NULL,
        precio_unitario DECIMAL(10, 2) NOT NULL,
        FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE,
        FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE
      )
    `);
    console.log('✅ Tabla detalle_pedidos creada');

    // Insertar usuario admin por defecto
    await connection.query(`
      INSERT IGNORE INTO usuarios (nombre, email, password, role)
      VALUES ('Administrador', 'admin@tienda.com', '$2a$10$u9Zh3z0Oo3nGTZHz.lQ0C.Km1LBkQQz3rG0Zh5K1h5bVQjDCLmBii', 'ADMIN')
    `);
    console.log('✅ Usuario admin creado (email: admin@tienda.com, password: admin123)');

    // Insertar productos de ejemplo
    await connection.query(`
      INSERT IGNORE INTO productos (nombre, descripcion, precio, stock, categoria, imagen)
      VALUES 
        ('Laptop Pro 15', 'Laptop profesional de alto rendimiento', 899990, 5, 'Electrónica', 'https://via.placeholder.com/300x300/2d3e50/ffffff?text=Laptop'),
        ('Mouse Inalámbrico', 'Mouse ergonómico con conexión Bluetooth', 29990, 15, 'Accesorios', 'https://via.placeholder.com/300x300/ffb347/ffffff?text=Mouse'),
        ('Teclado Mecánico RGB', 'Teclado gaming con iluminación personalizable', 79990, 10, 'Accesorios', 'https://via.placeholder.com/300x300/2d3e50/ffffff?text=Teclado'),
        ('Monitor 27 4K', 'Monitor Ultra HD para profesionales', 399990, 3, 'Electrónica', 'https://via.placeholder.com/300x300/ffb347/ffffff?text=Monitor'),
        ('Auriculares Bluetooth', 'Auriculares con cancelación de ruido', 129990, 8, 'Audio', 'https://via.placeholder.com/300x300/2d3e50/ffffff?text=Auriculares'),
        ('Webcam Full HD', 'Cámara web con micrófono integrado', 59990, 12, 'Accesorios', 'https://via.placeholder.com/300x300/ffb347/ffffff?text=Webcam')
    `);
    console.log('✅ Productos de ejemplo insertados');

    await connection.end();
    console.log('\n✨ Base de datos creada exitosamente');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

crearBD();

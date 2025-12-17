const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = 'secreto_tienda_online_2025';

// Datos de ejemplo en memoria (SOLO PARA DEMOSTRACIÓN)
const usuarios = [
  {
    id: 1,
    nombre: 'Admin Tienda',
    email: 'admin@tienda.com',
    password: '$2a$10$...',
    role: 'ADMIN'
  }
];

let pedidos = []; // Array de pedidos

const productos = [
  {
    id: 1,
    nombre: 'Camisa Casual',
    descripcion: 'Camisa de algodón para uso casual',
    precio: 49990,
    stock: 25,
    categoria: 'Ropa',
    imagen: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop'
  },
  {
    id: 2,
    nombre: 'Zapatos Deportivos',
    descripcion: 'Zapatos cómodos para deportes y uso diario',
    precio: 89990,
    stock: 20,
    categoria: 'Calzado',
    imagen: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop'
  },
  {
    id: 3,
    nombre: 'Mochila Ejecutiva',
    descripcion: 'Mochila elegante para trabajo y estudio',
    precio: 79990,
    stock: 15,
    categoria: 'Accesorios',
    imagen: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop'
  },
  {
    id: 4,
    nombre: 'Reloj Inteligente',
    descripcion: 'Reloj smartwatch con monitor de salud',
    precio: 199990,
    stock: 12,
    categoria: 'Tecnología',
    imagen: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop'
  },
  {
    id: 5,
    nombre: 'Lentes de Sol',
    descripcion: 'Lentes UV protección premium',
    precio: 69990,
    stock: 30,
    categoria: 'Accesorios',
    imagen: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&h=500&fit=crop'
  },
  {
    id: 6,
    nombre: 'Cinturón Premium',
    descripcion: 'Cinturón de cuero genuino',
    precio: 59990,
    stock: 18,
    categoria: 'Accesorios',
    imagen: 'https://images.unsplash.com/photo-1624621997894-4f2138ce796c?w=500&h=500&fit=crop'
  }
];

// Middleware de autenticación
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'No token' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.usuario = decoded;
    next();
  } catch {
    res.status(403).json({ error: 'Token inválido' });
  }
};

const authorize = (rolesPermitidos) => {
  return (req, res, next) => {
    if (!rolesPermitidos.includes(req.usuario.role)) {
      return res.status(403).json({ error: 'No autorizado' });
    }
    next();
  };
};

// RUTAS DE AUTENTICACIÓN
app.post('/api/auth/register', (req, res) => {
  console.log('📝 POST /api/auth/register', req.body);
  
  const { nombre, email, password, apellido, direccion } = req.body;

  if (!nombre || !email || !password) {
    console.log('❌ Faltan datos requeridos');
    return res.status(400).json({ error: 'Faltan datos: nombre, email, password' });
  }

  if (usuarios.some(u => u.email === email)) {
    console.log('❌ Email ya existe:', email);
    return res.status(400).json({ error: 'El email ya está registrado' });
  }

  const nuevoUsuario = {
    id: usuarios.length + 1,
    nombre,
    apellido: apellido || '',
    email,
    password: bcryptjs.hashSync(password, 10),
    direccion: direccion || '',
    role: 'USER'
  };

  usuarios.push(nuevoUsuario);
  console.log('✅ Usuario registrado:', nuevoUsuario.email);

  const token = jwt.sign(
    { id: nuevoUsuario.id, email: nuevoUsuario.email, role: nuevoUsuario.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.json({
    success: true,
    token,
    usuario: { id: nuevoUsuario.id, nombre: nuevoUsuario.nombre, email: nuevoUsuario.email, role: nuevoUsuario.role }
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  // Para demostración: aceptar admin@tienda.com / admin123
  if (email === 'admin@tienda.com' && password === 'admin123') {
    const token = jwt.sign(
      { id: 1, email: 'admin@tienda.com', role: 'ADMIN' },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      success: true,
      token,
      usuario: { id: 1, nombre: 'Admin Tienda', email: 'admin@tienda.com', role: 'ADMIN' }
    });
  }

  // También permitir otros usuarios registrados
  const usuario = usuarios.find(u => u.email === email);
  if (!usuario) {
    return res.status(401).json({ error: 'Email no encontrado' });
  }

  if (!bcryptjs.compareSync(password, usuario.password)) {
    return res.status(401).json({ error: 'Contraseña incorrecta' });
  }

  const token = jwt.sign(
    { id: usuario.id, email: usuario.email, role: usuario.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.json({
    success: true,
    token,
    usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email, role: usuario.role }
  });
});

app.get('/api/auth/me', authenticateToken, (req, res) => {
  const usuario = usuarios.find(u => u.id === req.usuario.id);
  res.json({
    id: usuario.id,
    nombre: usuario.nombre,
    email: usuario.email,
    role: usuario.role
  });
});

// RUTAS DE PRODUCTOS
app.get('/api/productos', (req, res) => {
  res.json({ success: true, data: productos });
});

app.get('/api/productos/:id', (req, res) => {
  const producto = productos.find(p => p.id === parseInt(req.params.id));
  if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });
  res.json({ success: true, data: producto });
});

app.post('/api/productos', authenticateToken, authorize(['ADMIN']), (req, res) => {
  const { nombre, descripcion, precio, stock, categoria, imagen } = req.body;

  if (!nombre || !precio || !stock) {
    return res.status(400).json({ error: 'Datos incompletos' });
  }

  const nuevoProducto = {
    id: Math.max(...productos.map(p => p.id)) + 1,
    nombre,
    descripcion: descripcion || '',
    precio: parseFloat(precio),
    stock: parseInt(stock),
    categoria: categoria || 'General',
    imagen: imagen || 'default.jpg'
  };

  productos.push(nuevoProducto);
  res.json({ success: true, data: nuevoProducto });
});

app.put('/api/productos/:id', authenticateToken, authorize(['ADMIN']), (req, res) => {
  const producto = productos.find(p => p.id === parseInt(req.params.id));
  if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });

  const { nombre, descripcion, precio, stock, categoria, imagen } = req.body;
  if (nombre) producto.nombre = nombre;
  if (descripcion) producto.descripcion = descripcion;
  if (precio) producto.precio = parseFloat(precio);
  if (stock !== undefined) producto.stock = parseInt(stock);
  if (categoria) producto.categoria = categoria;
  if (imagen) producto.imagen = imagen;

  res.json({ success: true, data: producto });
});

app.delete('/api/productos/:id', authenticateToken, authorize(['ADMIN']), (req, res) => {
  console.log('DELETE /api/productos/:id', {
    id: req.params.id,
    usuario: req.usuario?.email || 'anónimo',
    role: req.usuario?.role || 'ninguno'
  });
  
  try {
    const index = productos.findIndex(p => p.id === parseInt(req.params.id));
    
    console.log('Índice encontrado:', index);
    console.log('Total de productos antes:', productos.length);
    
    if (index === -1) {
      console.log('Producto no encontrado');
      return res.status(404).json({ 
        success: false, 
        error: 'Producto no encontrado',
        id: req.params.id
      });
    }

    const eliminado = productos.splice(index, 1);
    console.log('Producto eliminado:', eliminado[0].nombre);
    console.log('Total de productos después:', productos.length);
    
    return res.json({ 
      success: true, 
      message: 'Producto eliminado correctamente', 
      data: eliminado[0] 
    });
  } catch (error) {
    console.error('Error en DELETE:', error);
    return res.status(500).json({
      success: false,
      error: 'Error al eliminar producto',
      details: error.message
    });
  }
});

// ENDPOINT DE PRUEBA SIN AUTENTICACIÓN
app.delete('/api/productos-test/:id', (req, res) => {
  console.log('DELETE /api/productos-test/:id (sin auth)');
  const index = productos.findIndex(p => p.id === parseInt(req.params.id));
  
  if (index === -1) {
    return res.status(404).json({ success: false, error: 'No encontrado' });
  }

  const eliminado = productos.splice(index, 1);
  res.json({ success: true, message: 'Eliminado', data: eliminado[0] });
});

// RUTAS DE PEDIDOS
app.post('/api/pedidos', authenticateToken, (req, res) => {
  console.log('📦 POST /api/pedidos', { usuario: req.usuario.email });
  
  const { productos, total, datosEnvio, metodoPago } = req.body;
  
  if (!productos || !Array.isArray(productos) || productos.length === 0) {
    return res.status(400).json({ error: 'Productos vacíos' });
  }

  if (!datosEnvio || !datosEnvio.nombre) {
    return res.status(400).json({ error: 'Datos de envío incompletos' });
  }

  const nuevoPedido = {
    id: Math.max(0, ...pedidos.map(p => p.id)) + 1,
    usuarioId: req.usuario.id,
    email: req.usuario.email,
    fecha: new Date().toISOString(),
    productos: productos.map(p => ({
      id: p.id,
      nombre: p.nombre,
      precio: p.precio,
      cantidad: p.cantidad,
      imagen: p.imagen
    })),
    total,
    datosEnvio,
    metodoPago,
    estado: 'Pendiente',
    numeroSeguimiento: 'TRK' + Math.random().toString(36).substr(2, 9).toUpperCase()
  };

  pedidos.push(nuevoPedido);
  console.log('✅ Pedido creado:', nuevoPedido.id);

  res.json({ success: true, data: nuevoPedido });
});

// Obtener todos los pedidos del usuario autenticado
app.get('/api/pedidos', authenticateToken, (req, res) => {
  console.log('📦 GET /api/pedidos', { usuario: req.usuario.email });
  
  const pedidosDelUsuario = pedidos.filter(p => p.usuarioId === req.usuario.id);
  res.json({ success: true, data: pedidosDelUsuario });
});

// Obtener todos los pedidos (solo admin)
app.get('/api/pedidos/admin/todas', authenticateToken, authorize(['ADMIN']), (req, res) => {
  console.log('📦 GET /api/pedidos/admin/todas');
  
  // Agregar información del usuario a cada pedido
  const pedidosConUsuario = pedidos.map(pedido => ({
    ...pedido,
    usuarioEmail: pedido.email
  }));

  res.json({ success: true, data: pedidosConUsuario });
});

// Obtener un pedido específico
app.get('/api/pedidos/:id', authenticateToken, (req, res) => {
  const pedido = pedidos.find(p => p.id === parseInt(req.params.id));
  
  if (!pedido) {
    return res.status(404).json({ error: 'Pedido no encontrado' });
  }

  // Verificar que el usuario sea propietario o admin
  if (req.usuario.role !== 'ADMIN' && pedido.usuarioId !== req.usuario.id) {
    return res.status(403).json({ error: 'No autorizado' });
  }

  res.json({ success: true, data: pedido });
});

// Actualizar estado de un pedido (solo admin)
app.put('/api/pedidos/:id/estado', authenticateToken, authorize(['ADMIN']), (req, res) => {
  const { estado } = req.body;
  const pedido = pedidos.find(p => p.id === parseInt(req.params.id));
  
  if (!pedido) {
    return res.status(404).json({ error: 'Pedido no encontrado' });
  }

  const estadosValidos = ['Pendiente', 'Procesando', 'Enviado', 'Entregado', 'Cancelado'];
  if (!estadosValidos.includes(estado)) {
    return res.status(400).json({ error: 'Estado inválido' });
  }

  pedido.estado = estado;
  console.log(`✅ Pedido ${pedido.id} actualizado a: ${estado}`);

  res.json({ success: true, data: pedido });
});

// Swagger Info
app.get('/api-docs', (req, res) => {
  res.json({
    message: 'Servidor de demostración sin conexión a MySQL',
    endpoints: [
      'POST /api/auth/register',
      'POST /api/auth/login',
      'GET /api/auth/me (requiere token)',
      'GET /api/productos',
      'GET /api/productos/:id',
      'POST /api/productos (ADMIN)',
      'PUT /api/productos/:id (ADMIN)',
      'DELETE /api/productos/:id (ADMIN)',
      'POST /api/pedidos (requiere token)',
      'GET /api/pedidos (requiere token - mis pedidos)',
      'GET /api/pedidos/admin/todas (requiere token ADMIN)',
      'GET /api/pedidos/:id (requiere token)',
      'PUT /api/pedidos/:id/estado (requiere token ADMIN)'
    ],
    demo_credentials: {
      email: 'admin@tienda.com',
      password: 'admin123'
    }
  });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`\n🚀 SERVIDOR DE DEMOSTRACIÓN ejecutándose en http://localhost:${PORT}`);
  console.log(`📝 Swagger: http://localhost:${PORT}/api-docs`);
  console.log(`\n⚠️  NOTA: Este es un servidor de DEMOSTRACIÓN sin conexión a MySQL.`);
  console.log(`\nCredenciales de prueba:`);
  console.log(`  Email: admin@tienda.com`);
  console.log(`  Contraseña: admin123\n`);
});

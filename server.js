const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
require('dotenv').config();

// Rutas
const authRoutes = require('./src/routes/authRoutes');
const productRoutes = require('./src/routes/productRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const pedidoRoutes = require('./src/routes/pedidoRoutes');

const app = express();

// ===== CONEXIÓN A MONGODB =====
mongoose.connect(process.env.MONGODB_URI, {
  connectTimeoutMS: 60000,
  socketTimeoutMS: 60000,
  serverSelectionTimeoutMS: 60000,
  retryWrites: true
})
  .then(() => {
    console.log('✅ Conectado a MongoDB Atlas');
  })
  .catch(err => {
    console.error('❌ Error conectando a MongoDB:', err.message);
    process.exit(1);
  });

// Middleware
app.use(cors());
app.use(express.json());

// Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Tienda Online API',
      version: '1.0.0',
      description: 'API REST para Tienda Online con autenticación JWT'
    },
    servers: [
      {
        url: 'http://localhost:3002',
        description: 'Servidor local'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: ['./src/routes/*.js']
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rutas API
app.use('/api/auth', authRoutes);
app.use('/api/productos', productRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/pedidos', pedidoRoutes);

// Ruta de prueba
app.get('/api', (req, res) => {
  res.json({ message: 'API Tienda Online funcionando ✅' });
});

// Manejo de errores 404
app.use((req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
  console.log(`📚 Documentación Swagger: http://localhost:${PORT}/api-docs`);
});

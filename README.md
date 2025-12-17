# 🛍️ Tienda Online - Backend (Node.js + Express)

Backend REST API para la aplicación de Tienda Online con autenticación JWT, roles de usuario y gestión de productos.

## 📋 Requisitos

- Node.js v16 o superior
- MySQL v5.7 o superior
- npm o yarn

## 🚀 Instalación y Configuración

### 1. Instalar dependencias

```bash
cd backend
npm install
```

### 2. Configurar variables de entorno

Crear archivo `.env` en la carpeta `backend` con el siguiente contenido:

```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=tienda_online

JWT_SECRET=secreto_tienda_online_2025
JWT_EXPIRE=7d

PORT=3001
NODE_ENV=development
```

### 3. Crear la base de datos

```bash
node crear-bd.js
```

**Nota:** Asegúrate de que MySQL está ejecutándose. Si tienes contraseña en MySQL, actualiza el `.env`.

### 4. Iniciar el servidor

**Modo producción:**
```bash
npm start
```

**Modo desarrollo (con auto-recarga):**
```bash
npm run dev
```

El servidor estará disponible en `http://localhost:3001`

## 📚 Documentación API (Swagger)

Acceder a la documentación interactiva en:
```
http://localhost:3001/api-docs
```

## 🔐 Autenticación

### Credenciales por defecto

- **Admin:**
  - Email: `admin@tienda.com`
  - Contraseña: `admin123`
  - Rol: `ADMIN`

### Flujo de autenticación

1. **Registrar usuario:** `POST /api/auth/register`
   ```json
   {
     "nombre": "Juan Pérez",
     "email": "juan@ejemplo.com",
     "password": "mi_contraseña"
   }
   ```

2. **Login:** `POST /api/auth/login`
   ```json
   {
     "email": "juan@ejemplo.com",
     "password": "mi_contraseña"
   }
   ```

3. **Respuesta:** Recibirás un token JWT
   ```json
   {
     "token": "eyJhbGciOiJIUzI1NiIs...",
     "usuario": {
       "id": 1,
       "nombre": "Juan Pérez",
       "email": "juan@ejemplo.com",
       "role": "USER"
     }
   }
   ```

4. **Usar token:** En todas las peticiones protegidas, envía el token en el header:
   ```
   Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
   ```

## 📡 Endpoints API

### Autenticación

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---|
| POST | `/api/auth/register` | Registrar nuevo usuario | ❌ No |
| POST | `/api/auth/login` | Iniciar sesión | ❌ No |
| GET | `/api/auth/me` | Obtener usuario actual | ✅ JWT |

### Productos

| Método | Endpoint | Descripción | Autenticación | Rol |
|--------|----------|-------------|---|---|
| GET | `/api/productos` | Listar todos los productos | ❌ No | - |
| GET | `/api/productos/:id` | Obtener producto por ID | ❌ No | - |
| POST | `/api/productos` | Crear nuevo producto | ✅ JWT | ADMIN |
| PUT | `/api/productos/:id` | Actualizar producto | ✅ JWT | ADMIN |
| DELETE | `/api/productos/:id` | Eliminar producto | ✅ JWT | ADMIN |

## 🗄️ Estructura de Base de Datos

### Tabla: usuarios
```sql
- id (INT, PK, Auto-increment)
- nombre (VARCHAR)
- email (VARCHAR, UNIQUE)
- password (VARCHAR, hasheada)
- role (ENUM: 'ADMIN', 'USER')
- fecha_creacion (TIMESTAMP)
```

### Tabla: productos
```sql
- id (INT, PK, Auto-increment)
- nombre (VARCHAR)
- descripcion (TEXT)
- precio (DECIMAL)
- stock (INT)
- categoria (VARCHAR)
- imagen (VARCHAR)
- fecha_creacion (TIMESTAMP)
```

### Tabla: pedidos
```sql
- id (INT, PK, Auto-increment)
- usuario_id (INT, FK)
- total (DECIMAL)
- estado (ENUM: 'PENDIENTE', 'CONFIRMADO', 'ENVIADO', 'ENTREGADO', 'CANCELADO')
- fecha_pedido (TIMESTAMP)
```

### Tabla: detalle_pedidos
```sql
- id (INT, PK, Auto-increment)
- pedido_id (INT, FK)
- producto_id (INT, FK)
- cantidad (INT)
- precio_unitario (DECIMAL)
```

## 🔒 Seguridad

- **Contraseñas:** Se hashean con bcryptjs (sal: 10)
- **Tokens JWT:** 
  - Secret: definido en `.env`
  - Expiración: 7 días (configurable)
  - Se validan en cada petición protegida

- **CORS:** Habilitado para el frontend
- **Validaciones:** Se validan todos los datos de entrada

## 🛠️ Estructura del Proyecto

```
backend/
├── server.js              # Punto de entrada
├── crear-bd.js            # Script para crear BD
├── package.json
├── .env                   # Variables de entorno
└── src/
    ├── config/
    │   └── database.js    # Configuración MySQL
    ├── routes/
    │   ├── authRoutes.js
    │   └── productRoutes.js
    ├── controllers/
    │   ├── authController.js
    │   └── productController.js
    ├── middleware/
    │   └── auth.js        # Middlewares JWT
    └── utils/
        ├── jwt.js         # Funciones JWT
        └── password.js    # Hash de contraseñas
```

## 🐛 Troubleshooting

**Error: "connect ECONNREFUSED"**
- MySQL no está ejecutándose. Inicia el servidor MySQL.

**Error: "Database not found"**
- Ejecuta: `node crear-bd.js`

**Error: "Invalid token"**
- El token expiró o está mal formado. Realiza un nuevo login.

## 📝 Notas para la presentación

- El backend está diseñado para ser simple y rápido de implementar
- Usa autenticación JWT estándar
- Implementa roles de usuario (ADMIN, USER)
- Los endpoints están documentados en Swagger
- Es fácil de expandir con nuevas entidades (pedidos, carrito, etc.)

## 📄 Licencia

ISC

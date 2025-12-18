# 🔌 GUÍA PASO A PASO: CONECTAR BACKEND CON MONGODB

## ✅ QUÉ HEMOS HECHO HASTA AHORA:

1. ✅ Instalado `mongoose` y `dotenv`
2. ✅ Creado modelos Mongoose (Usuario, Producto, Pedido)
3. ✅ Actualizado controladores para usar MongoDB
4. ✅ Actualizado server.js con conexión a MongoDB

## 📝 PRÓXIMOS PASOS:

### PASO 1: Obtén tu MongoDB URI

1. Ve a https://cloud.mongodb.com
2. Inicia sesión
3. Haz clic en "Cluster0" (o el nombre de tu cluster)
4. Haz clic en el botón "CONNECT"
5. Selecciona "Drivers"
6. Copia la cadena de conexión que dice:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

### PASO 2: Actualiza tu archivo .env

Abre el archivo `.env` en la carpeta `backend` y reemplaza:

```env
MONGODB_URI=mongodb+srv://admin_tienda:tu_contraseña_aqui@cluster0.xxxxx.mongodb.net/tienda_online?retryWrites=true&w=majority
JWT_SECRET=secreto_tienda_online_2025
JWT_EXPIRE=7d
PORT=3001
NODE_ENV=development
```

**IMPORTANTE:** 
- Reemplaza `tu_contraseña_aqui` con tu contraseña de MongoDB
- Reemplaza `cluster0.xxxxx.mongodb.net` con tu URL real
- Asegúrate de agregar `/tienda_online` al final (nombre de la BD)

### PASO 3: Verifica la conexión

Ejecuta este comando:

```bash
cd backend
npm start
```

Deberías ver en la consola:
```
✅ Conectado a MongoDB Atlas
🚀 Servidor ejecutándose en http://localhost:3001
```

### PASO 4: Prueba un endpoint

En otra terminal, crea un usuario:

```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

Deberías recibir un token JWT.

## 🐛 SOLUCIÓN DE PROBLEMAS

**Error: "MONGODB_URI no configurado"**
→ Verifica que tu `.env` contiene `MONGODB_URI`

**Error: "Credenciales inválidas"**
→ Verifica tu contraseña de MongoDB Atlas

**Error: "No se puede conectar"**
→ Verifica que:
  1. Está en la IP allowlist de MongoDB Atlas
  2. La URL de cluster es correcta
  3. El usuario y contraseña son correctos

**Error: "Command failed with exit code 1"**
→ Ejecuta `npm install` nuevamente en la carpeta backend

## ✨ ¿QUÉ CAMBIOS HICIMOS?

### Archivos Actualizados:

1. **server.js** 
   - Agregada conexión a MongoDB con mongoose
   - Nuevas rutas para admin y pedidos

2. **authController.js**
   - Cambio de MySQL a MongoDB
   - Usa modelo Usuario

3. **productController.js**
   - Cambio de MySQL a MongoDB
   - Usa modelo Producto

4. **adminController.js** (NUEVO)
   - Manejo de usuarios y pedidos para admins

5. **adminRoutes.js** (NUEVO)
   - Rutas para gestión de usuarios y pedidos

6. **pedidoController.js** (NUEVO)
   - Lógica para crear y obtener pedidos

7. **pedidoRoutes.js** (NUEVO)
   - Rutas para pedidos

8. **.env** (ACTUALIZADO)
   - Cambio de MySQL a MongoDB

## 🎯 RESUMEN DE CONEXIÓN

Cuando iniciamos el servidor:
1. Se carga la variable `MONGODB_URI` del archivo `.env`
2. Mongoose se conecta a MongoDB Atlas
3. Si la conexión es exitosa, vemos ✅
4. Si hay error, mostramos el mensaje y salimos

El backend está listo. Solo necesitas:
1. Obtener tu MongoDB URI real
2. Actualizar el `.env`
3. Ejecutar `npm start`

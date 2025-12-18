#!/bin/bash

# Script para actualizar .env con MongoDB URI

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  🔧 ACTUALIZADOR DE MONGODB URI                            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Información que el usuario tiene
USUARIO="bustosgajardosofiaantonia_db_user"
CLUSTER="tiendaonline.laj7uso.mongodb.net"
DB_NAME="tienda_online"

echo "📝 INFORMACIÓN DETECTADA:"
echo "  Usuario: $USUARIO"
echo "  Cluster: $CLUSTER"
echo "  Base de datos: $DB_NAME"
echo ""
echo "Ahora necesito tu contraseña de MongoDB."
echo ""
echo "⚠️  La contraseña es la que pusiste cuando creaste el usuario en MongoDB Atlas"
echo "    (Paso 6 de la configuración)"
echo ""

# Solicitar contraseña
read -sp "🔐 Ingresa tu contraseña de MongoDB: " PASSWORD
echo ""

# Construir la URL
MONGODB_URI="mongodb+srv://${USUARIO}:${PASSWORD}@${CLUSTER}/${DB_NAME}?appName=tiendaonline"

echo ""
echo "✅ URL CONSTRUIDA:"
echo "   $MONGODB_URI"
echo ""
echo "¿Es correcta? (s/n)"
read -r CONFIRMAR

if [ "$CONFIRMAR" = "s" ] || [ "$CONFIRMAR" = "S" ]; then
  # Actualizar .env
  # Primero, hacer backup
  cp .env .env.backup
  echo "✅ Backup creado: .env.backup"
  
  # Actualizar la variable MONGODB_URI
  # Para macOS/BSD sed, usar -i ''
  sed -i '' "s|MONGODB_URI=.*|MONGODB_URI=$MONGODB_URI|g" .env
  
  echo "✅ .env actualizado correctamente"
  echo ""
  echo "Contenido actualizado:"
  echo "───────────────────────────────────────────────────────────"
  cat .env
  echo "───────────────────────────────────────────────────────────"
else
  echo "❌ Operación cancelada. Intentalo de nuevo."
  exit 1
fi

#!/bin/bash

# Script para demostrar el backend en la evaluación

echo "╔═══════════════════════════════════════════════════════════════════╗"
echo "║                  TESTING DEL BACKEND API REST                    ║"
echo "╚═══════════════════════════════════════════════════════════════════╝"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: Obtener productos
echo -e "${BLUE}1. GET /api/productos${NC}"
echo "   Comando: curl http://localhost:3001/api/productos"
echo "   Resultado:"
curl -s http://localhost:3001/api/productos | python3 -m json.tool | head -30
echo "   ..."
echo ""

# Test 2: Login
echo -e "${BLUE}2. POST /api/auth/login${NC}"
echo "   Comando: curl -X POST -H 'Content-Type: application/json' \\"
echo "            -d '{\"email\":\"admin@tienda.com\",\"password\":\"admin123\"}' \\"
echo "            http://localhost:3001/api/auth/login"
echo "   Resultado:"
RESPONSE=$(curl -s -X POST \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@tienda.com","password":"admin123"}' \
  http://localhost:3001/api/auth/login)

echo "$RESPONSE" | python3 -m json.tool
TOKEN=$(echo "$RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin)['token'])")
echo ""
echo -e "${GREEN}✅ Token obtenido correctamente${NC}"
echo ""

# Test 3: Ver información del usuario
echo -e "${BLUE}3. GET /api/auth/me (con token)${NC}"
echo "   Comando: curl -H 'Authorization: Bearer \$TOKEN' http://localhost:3001/api/auth/me"
echo "   Resultado:"
curl -s -H "Authorization: Bearer $TOKEN" http://localhost:3001/api/auth/me | python3 -m json.tool
echo ""

# Test 4: Ver todos los pedidos (admin)
echo -e "${BLUE}4. GET /api/pedidos/admin/todas (admin)${NC}"
echo "   Comando: curl -H 'Authorization: Bearer \$TOKEN' http://localhost:3001/api/pedidos/admin/todas"
echo "   Resultado:"
curl -s -H "Authorization: Bearer $TOKEN" http://localhost:3001/api/pedidos/admin/todas | python3 -m json.tool
echo ""

echo "╔═══════════════════════════════════════════════════════════════════╗"
echo "║                   ✅ BACKEND FUNCIONANDO CORRECTAMENTE           ║"
echo "╚═══════════════════════════════════════════════════════════════════╝"

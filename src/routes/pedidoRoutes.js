const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/pedidoController');
const { authenticateToken, authorize } = require('../middleware/auth');

/**
 * @swagger
 * /api/pedidos:
 *   post:
 *     summary: Crear un nuevo pedido
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               items:
 *                 type: array
 *               total:
 *                 type: number
 *               cliente:
 *                 type: object
 */
router.post('/', authenticateToken, pedidoController.crearPedido);

/**
 * @swagger
 * /api/pedidos:
 *   get:
 *     summary: Obtener pedidos del usuario
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 */
router.get('/', authenticateToken, pedidoController.obtenerPedidosUsuario);

/**
 * @swagger
 * /api/pedidos/{id}:
 *   get:
 *     summary: Obtener pedido por ID
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 */
router.get('/:id', authenticateToken, pedidoController.obtenerPedidoById);

module.exports = router;

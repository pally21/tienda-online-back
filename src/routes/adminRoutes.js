const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateToken, authorize } = require('../middleware/auth');

// ===== RUTAS DE USUARIOS (ADMIN) =====

/**
 * @swagger
 * /api/admin/usuarios:
 *   get:
 *     summary: Obtener todos los usuarios (Solo ADMIN)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios
 */
router.get('/usuarios', authenticateToken, authorize(['ADMIN']), adminController.getUsuarios);

/**
 * @swagger
 * /api/admin/usuarios/{id}:
 *   get:
 *     summary: Obtener usuario por ID (Solo ADMIN)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 */
router.get('/usuarios/:id', authenticateToken, authorize(['ADMIN']), adminController.getUsuarioById);

/**
 * @swagger
 * /api/admin/usuarios/{id}/estado:
 *   put:
 *     summary: Cambiar estado del usuario (Solo ADMIN)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 */
router.put('/usuarios/:id/estado', authenticateToken, authorize(['ADMIN']), adminController.cambiarEstadoUsuario);

/**
 * @swagger
 * /api/admin/usuarios/{id}:
 *   delete:
 *     summary: Eliminar usuario (Solo ADMIN)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 */
router.delete('/usuarios/:id', authenticateToken, authorize(['ADMIN']), adminController.eliminarUsuario);

/**
 * @swagger
 * /api/admin/estadisticas/usuarios:
 *   get:
 *     summary: Obtener estadísticas de usuarios (Solo ADMIN)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 */
router.get('/estadisticas/usuarios', authenticateToken, authorize(['ADMIN']), adminController.estadisticasUsuarios);

// ===== RUTAS DE PEDIDOS (ADMIN) =====

/**
 * @swagger
 * /api/admin/pedidos:
 *   get:
 *     summary: Obtener todos los pedidos (Solo ADMIN)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 */
router.get('/pedidos', authenticateToken, authorize(['ADMIN']), adminController.getPedidos);

/**
 * @swagger
 * /api/admin/pedidos/{id}:
 *   get:
 *     summary: Obtener pedido por ID (Solo ADMIN)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 */
router.get('/pedidos/:id', authenticateToken, authorize(['ADMIN']), adminController.getPedidoById);

/**
 * @swagger
 * /api/admin/pedidos/{id}/estado:
 *   put:
 *     summary: Actualizar estado del pedido (Solo ADMIN)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 */
router.put('/pedidos/:id/estado', authenticateToken, authorize(['ADMIN']), adminController.actualizarEstadoPedido);

module.exports = router;

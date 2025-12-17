const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authenticateToken, authorize } = require('../middleware/auth');

/**
 * @swagger
 * /api/productos:
 *   get:
 *     summary: Obtener todos los productos
 *     tags: [Productos]
 *     responses:
 *       200:
 *         description: Lista de productos
 */
router.get('/', productController.getProductos);

/**
 * @swagger
 * /api/productos/{id}:
 *   get:
 *     summary: Obtener producto por ID
 *     tags: [Productos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Producto encontrado
 */
router.get('/:id', productController.getProductoById);

/**
 * @swagger
 * /api/productos:
 *   post:
 *     summary: Crear un nuevo producto (Solo ADMIN)
 *     tags: [Productos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               precio:
 *                 type: number
 *               descripcion:
 *                 type: string
 *               imagen:
 *                 type: string
 *               stock:
 *                 type: integer
 *               categoria:
 *                 type: string
 *     responses:
 *       201:
 *         description: Producto creado
 */
router.post('/', authenticateToken, authorize(['ADMIN']), productController.createProducto);

/**
 * @swagger
 * /api/productos/{id}:
 *   put:
 *     summary: Actualizar producto (Solo ADMIN)
 *     tags: [Productos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               precio:
 *                 type: number
 *               descripcion:
 *                 type: string
 *               imagen:
 *                 type: string
 *               stock:
 *                 type: integer
 *               categoria:
 *                 type: string
 *     responses:
 *       200:
 *         description: Producto actualizado
 */
router.put('/:id', authenticateToken, authorize(['ADMIN']), productController.updateProducto);

/**
 * @swagger
 * /api/productos/{id}:
 *   delete:
 *     summary: Eliminar producto (Solo ADMIN)
 *     tags: [Productos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Producto eliminado
 */
router.delete('/:id', authenticateToken, authorize(['ADMIN']), productController.deleteProducto);

module.exports = router;

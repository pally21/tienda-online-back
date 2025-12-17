const pool = require('../config/database');

// OBTENER TODOS LOS PRODUCTOS
exports.getProductos = async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [productos] = await connection.query(
      'SELECT * FROM productos ORDER BY id'
    );
    connection.release();
    res.json(productos);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Error al obtener productos' });
  }
};

// OBTENER PRODUCTO POR ID
exports.getProductoById = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await pool.getConnection();
    const [productos] = await connection.query(
      'SELECT * FROM productos WHERE id = ?',
      [id]
    );
    connection.release();

    if (productos.length === 0) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    res.json(productos[0]);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Error al obtener producto' });
  }
};

// CREAR PRODUCTO (Solo ADMIN)
exports.createProducto = async (req, res) => {
  try {
    const { nombre, precio, descripcion, imagen, stock, categoria } = req.body;

    if (!nombre || !precio || !stock) {
      return res.status(400).json({ message: 'Campos requeridos: nombre, precio, stock' });
    }

    const connection = await pool.getConnection();
    const [result] = await connection.query(
      'INSERT INTO productos (nombre, precio, descripcion, imagen, stock, categoria, fecha_creacion) VALUES (?, ?, ?, ?, ?, ?, NOW())',
      [nombre, precio, descripcion, imagen, stock, categoria]
    );
    connection.release();

    const nuevoProducto = {
      id: result.insertId,
      nombre,
      precio,
      descripcion,
      imagen,
      stock,
      categoria
    };

    res.status(201).json({
      message: 'Producto creado exitosamente',
      producto: nuevoProducto
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Error al crear producto' });
  }
};

// ACTUALIZAR PRODUCTO (Solo ADMIN)
exports.updateProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, precio, descripcion, imagen, stock, categoria } = req.body;

    const connection = await pool.getConnection();

    // Verificar que el producto existe
    const [existingProducto] = await connection.query(
      'SELECT * FROM productos WHERE id = ?',
      [id]
    );

    if (existingProducto.length === 0) {
      connection.release();
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    await connection.query(
      'UPDATE productos SET nombre = ?, precio = ?, descripcion = ?, imagen = ?, stock = ?, categoria = ? WHERE id = ?',
      [nombre || existingProducto[0].nombre, precio || existingProducto[0].precio, descripcion || existingProducto[0].descripcion, imagen || existingProducto[0].imagen, stock || existingProducto[0].stock, categoria || existingProducto[0].categoria, id]
    );

    connection.release();

    res.json({
      message: 'Producto actualizado exitosamente',
      producto: {
        id,
        nombre: nombre || existingProducto[0].nombre,
        precio: precio || existingProducto[0].precio,
        descripcion: descripcion || existingProducto[0].descripcion,
        imagen: imagen || existingProducto[0].imagen,
        stock: stock || existingProducto[0].stock,
        categoria: categoria || existingProducto[0].categoria
      }
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Error al actualizar producto' });
  }
};

// ELIMINAR PRODUCTO (Solo ADMIN)
exports.deleteProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await pool.getConnection();

    const [existingProducto] = await connection.query(
      'SELECT * FROM productos WHERE id = ?',
      [id]
    );

    if (existingProducto.length === 0) {
      connection.release();
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    await connection.query('DELETE FROM productos WHERE id = ?', [id]);
    connection.release();

    res.json({ message: 'Producto eliminado exitosamente' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Error al eliminar producto' });
  }
};

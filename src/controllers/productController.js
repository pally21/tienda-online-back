const Producto = require('../../models/Producto');

// OBTENER TODOS LOS PRODUCTOS
exports.getProductos = async (req, res) => {
  try {
    const productos = await Producto.find({ activo: true });
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
    const producto = await Producto.findById(id);

    if (!producto) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    res.json(producto);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Error al obtener producto' });
  }
};

// CREAR PRODUCTO (Solo ADMIN)
exports.createProducto = async (req, res) => {
  try {
    const { nombre, precio, descripcion, imagen, stock, categoria } = req.body;

    if (!nombre || !precio || stock === undefined) {
      return res.status(400).json({ message: 'Campos requeridos: nombre, precio, stock' });
    }

    const nuevoProducto = new Producto({
      nombre,
      precio,
      descripcion,
      imagen,
      stock,
      categoria,
      activo: true
    });

    await nuevoProducto.save();

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

    const productoActualizado = await Producto.findByIdAndUpdate(
      id,
      {
        ...(nombre && { nombre }),
        ...(precio && { precio }),
        ...(descripcion && { descripcion }),
        ...(imagen && { imagen }),
        ...(stock !== undefined && { stock }),
        ...(categoria && { categoria })
      },
      { new: true, runValidators: true }
    );

    if (!productoActualizado) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    res.json({
      message: 'Producto actualizado exitosamente',
      producto: productoActualizado
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

    // Validar que el ID sea válido
    if (!id || id.length !== 24) {
      return res.status(400).json({ message: 'ID de producto inválido' });
    }

    let intento = 0;
    let producto = null;
    const maxIntentos = 3;

    // Reintentar hasta 3 veces si falla
    while (intento < maxIntentos && !producto) {
      try {
        intento++;
        console.log(`🔄 Intento ${intento} de eliminar producto ${id}`);
        
        producto = await Producto.findByIdAndDelete(id).maxTimeMS(300000);
        
        if (producto) {
          console.log(`✅ Producto eliminado en intento ${intento}`);
          break;
        }
      } catch (err) {
        console.error(`❌ Error en intento ${intento}:`, err.message);
        if (intento < maxIntentos) {
          // Esperar 2 segundos antes de reintentar
          await new Promise(resolve => setTimeout(resolve, 2000));
        } else {
          throw err;
        }
      }
    }

    if (!producto) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    res.json({ 
      message: 'Producto eliminado exitosamente',
      producto: producto
    });
  } catch (error) {
    console.error('Error al eliminar:', error);
    
    // Manejo específico de timeout
    if (error.message.includes('timed out') || error.message.includes('timeout')) {
      return res.status(504).json({ 
        message: 'Tiempo de espera agotado. MongoDB está lento. Intenta nuevamente.',
        error: error.message
      });
    }
    
    res.status(500).json({ 
      message: 'Error al eliminar producto',
      error: error.message
    });
  }
};

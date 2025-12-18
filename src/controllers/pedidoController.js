const Pedido = require('../../models/Pedido');
const Usuario = require('../../models/Usuario');

// CREAR PEDIDO
exports.crearPedido = async (req, res) => {
  try {
    const { items, total, cliente } = req.body;

    const nuevoPedido = new Pedido({
      usuario: req.usuario.id,
      items,
      total,
      cliente,
      estado: 'Pendiente'
    });

    await nuevoPedido.save();

    // Actualizar última compra del usuario
    await Usuario.findByIdAndUpdate(req.usuario.id, {
      ultimaCompra: new Date()
    });

    console.log(`✅ Pedido creado para usuario: ${req.usuario.id}`);

    res.json({
      success: true,
      message: 'Pedido creado exitosamente',
      data: nuevoPedido
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Error al crear pedido' });
  }
};

// OBTENER PEDIDOS DEL USUARIO
exports.obtenerPedidosUsuario = async (req, res) => {
  try {
    const pedidos = await Pedido.find({ usuario: req.usuario.id })
      .populate('usuario', 'nombre email')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: pedidos });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Error al obtener pedidos' });
  }
};

// OBTENER PEDIDO POR ID
exports.obtenerPedidoById = async (req, res) => {
  try {
    const pedido = await Pedido.findById(req.params.id)
      .populate('usuario', 'nombre email')
      .populate('items.producto');

    if (!pedido) {
      return res.status(404).json({ message: 'Pedido no encontrado' });
    }

    // Verificar que sea propietario o admin
    if (req.usuario.role !== 'ADMIN' && pedido.usuario._id.toString() !== req.usuario.id) {
      return res.status(403).json({ message: 'No autorizado' });
    }

    res.json({ success: true, data: pedido });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Error al obtener pedido' });
  }
};

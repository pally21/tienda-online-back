const Usuario = require('../../models/Usuario');
const Pedido = require('../../models/Pedido');

// ===== USUARIOS =====

// Obtener todos los usuarios (solo admin)
exports.getUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find().select('-password');
    res.json({
      success: true,
      message: `Total de usuarios: ${usuarios.length}`,
      data: usuarios
    });
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener usuarios' });
  }
};

// Obtener usuario por ID (solo admin)
exports.getUsuarioById = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id).select('-password');
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json({ success: true, data: usuario });
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener usuario' });
  }
};

// Cambiar estado de usuario (solo admin)
exports.cambiarEstadoUsuario = async (req, res) => {
  try {
    const { estado } = req.body;
    const usuarioId = req.params.id;

    if (!['activo', 'suspendido', 'inactivo'].includes(estado)) {
      return res.status(400).json({ message: 'Estado inválido' });
    }

    const usuario = await Usuario.findByIdAndUpdate(
      usuarioId,
      { estado },
      { new: true }
    ).select('-password');

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    console.log(`✅ Estado de ${usuario.email} cambiado a: ${estado}`);
    res.json({
      success: true,
      message: `Usuario ${usuario.email} actualizado a estado: ${estado}`,
      data: usuario
    });
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar usuario' });
  }
};

// Eliminar usuario (solo admin)
exports.eliminarUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findByIdAndDelete(req.params.id);

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    console.log(`✅ Usuario eliminado: ${usuario.email}`);
    res.json({
      success: true,
      message: `Usuario ${usuario.email} eliminado correctamente`
    });
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar usuario' });
  }
};

// Estadísticas de usuarios (solo admin)
exports.estadisticasUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find();

    const estadisticas = {
      totalUsuarios: usuarios.length,
      usuariosActivos: usuarios.filter(u => u.estado === 'activo').length,
      usuariosSuspendidos: usuarios.filter(u => u.estado === 'suspendido').length,
      usuariosInactivos: usuarios.filter(u => u.estado === 'inactivo').length,
      admins: usuarios.filter(u => u.role === 'ADMIN').length,
      usuariosRegulares: usuarios.filter(u => u.role === 'USER').length,
      usuariosConCompras: usuarios.filter(u => u.ultimaCompra !== null && u.ultimaCompra !== undefined).length
    };

    res.json({ success: true, data: estadisticas });
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener estadísticas' });
  }
};

// ===== PEDIDOS =====

// Obtener todos los pedidos (solo admin)
exports.getPedidos = async (req, res) => {
  try {
    const pedidos = await Pedido.find()
      .populate('usuario', 'nombre email')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: pedidos });
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener pedidos' });
  }
};

// Obtener pedido por ID (solo admin)
exports.getPedidoById = async (req, res) => {
  try {
    const pedido = await Pedido.findById(req.params.id)
      .populate('usuario', 'nombre email')
      .populate('items.producto');

    if (!pedido) {
      return res.status(404).json({ message: 'Pedido no encontrado' });
    }

    res.json({ success: true, data: pedido });
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener pedido' });
  }
};

// Actualizar estado de pedido (solo admin)
exports.actualizarEstadoPedido = async (req, res) => {
  try {
    const { estado } = req.body;
    const estadosValidos = ['Pendiente', 'Procesando', 'Enviado', 'Entregado', 'Cancelado'];

    if (!estadosValidos.includes(estado)) {
      return res.status(400).json({ message: 'Estado inválido' });
    }

    const pedido = await Pedido.findByIdAndUpdate(
      req.params.id,
      { estado },
      { new: true }
    ).populate('usuario', 'nombre email');

    if (!pedido) {
      return res.status(404).json({ message: 'Pedido no encontrado' });
    }

    console.log(`✅ Pedido actualizado a: ${estado}`);
    res.json({
      success: true,
      message: `Pedido actualizado a: ${estado}`,
      data: pedido
    });
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar pedido' });
  }
};

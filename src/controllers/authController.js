const Usuario = require('../../models/Usuario');
const { generateToken } = require('../utils/jwt');

// REGISTRO
exports.register = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }

    // Verificar si el usuario ya existe
    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
      return res.status(409).json({ message: 'El email ya está registrado' });
    }

    // Crear nuevo usuario (password se hashea automáticamente en el modelo)
    const nuevoUsuario = new Usuario({
      nombre,
      email,
      password
    });

    await nuevoUsuario.save();

    const usuario = { id: nuevoUsuario._id, nombre: nuevoUsuario.nombre, email: nuevoUsuario.email, role: nuevoUsuario.role };
    const token = generateToken(usuario);

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      token,
      usuario
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ message: 'Error al registrar usuario' });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email y contraseña requeridos' });
    }

    // Buscar usuario (incluir password para comparación)
    const usuario = await Usuario.findOne({ email }).select('+password');

    if (!usuario) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Comparar contraseña
    const passwordValida = await usuario.compararPassword(password);

    if (!passwordValida) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const token = generateToken({
      id: usuario._id,
      nombre: usuario.nombre,
      email: usuario.email,
      role: usuario.role
    });

    res.json({
      message: 'Login exitoso',
      token,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        role: usuario.role
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error al iniciar sesión' });
  }
};

// OBTENER USUARIO ACTUAL
exports.getCurrentUser = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.usuario.id).select('-password');

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json(usuario);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Error al obtener usuario' });
  }
};

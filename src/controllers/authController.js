const pool = require('../config/database');
const { hashPassword, verifyPassword } = require('../utils/password');
const { generateToken } = require('../utils/jwt');

// REGISTRO
exports.register = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }

    const connection = await pool.getConnection();

    // Verificar si el usuario ya existe
    const [existingUser] = await connection.query(
      'SELECT id FROM usuarios WHERE email = ?',
      [email]
    );

    if (existingUser.length > 0) {
      connection.release();
      return res.status(409).json({ message: 'El email ya está registrado' });
    }

    // Hash de contraseña
    const hashedPassword = await hashPassword(password);

    // Insertar usuario
    const [result] = await connection.query(
      'INSERT INTO usuarios (nombre, email, password, role, fecha_creacion) VALUES (?, ?, ?, ?, NOW())',
      [nombre, email, hashedPassword, 'USER']
    );

    connection.release();

    const usuario = { id: result.insertId, nombre, email, role: 'USER' };
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

    const connection = await pool.getConnection();

    const [usuarios] = await connection.query(
      'SELECT * FROM usuarios WHERE email = ?',
      [email]
    );

    connection.release();

    if (usuarios.length === 0) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const usuario = usuarios[0];
    const passwordValida = await verifyPassword(password, usuario.password);

    if (!passwordValida) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const token = generateToken(usuario);

    res.json({
      message: 'Login exitoso',
      token,
      usuario: {
        id: usuario.id,
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
    const connection = await pool.getConnection();
    const [usuarios] = await connection.query(
      'SELECT id, nombre, email, role FROM usuarios WHERE id = ?',
      [req.usuario.id]
    );
    connection.release();

    if (usuarios.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json(usuarios[0]);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Error al obtener usuario' });
  }
};

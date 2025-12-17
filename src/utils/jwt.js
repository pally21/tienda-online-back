const jwt = require('jsonwebtoken');
require('dotenv').config();

// Generar token JWT
const generateToken = (usuario) => {
  return jwt.sign(
    { id: usuario.id, email: usuario.email, role: usuario.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

// Verificar token JWT
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

module.exports = { generateToken, verifyToken };

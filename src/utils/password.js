const bcrypt = require('bcryptjs');

// Hash de contraseña
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

// Verificar contraseña
const verifyPassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

module.exports = { hashPassword, verifyPassword };

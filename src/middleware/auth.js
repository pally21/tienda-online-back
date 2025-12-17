const { verifyToken } = require('../utils/jwt');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(403).json({ message: 'Token inválido o expirado' });
  }

  req.usuario = decoded;
  next();
};

const authorize = (rolesPermitidos) => {
  return (req, res, next) => {
    if (!req.usuario) {
      return res.status(401).json({ message: 'No autenticado' });
    }

    if (!rolesPermitidos.includes(req.usuario.role)) {
      return res.status(403).json({ message: 'No tienes permisos para esta acción' });
    }

    next();
  };
};

module.exports = { authenticateToken, authorize };

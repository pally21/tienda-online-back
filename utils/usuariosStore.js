const fs = require('fs');
const path = require('path');

const USUARIOS_FILE = path.join(__dirname, '../data/usuarios.json');

// Leer usuarios del archivo JSON
const leerUsuarios = () => {
  try {
    if (fs.existsSync(USUARIOS_FILE)) {
      const data = fs.readFileSync(USUARIOS_FILE, 'utf8');
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    console.error('Error leyendo usuarios:', error);
    return [];
  }
};

// Guardar usuarios en archivo JSON
const guardarUsuarios = (usuarios) => {
  try {
    const dir = path.dirname(USUARIOS_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(USUARIOS_FILE, JSON.stringify(usuarios, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error guardando usuarios:', error);
    return false;
  }
};

// Obtener usuario por email
const obtenerPorEmail = (email) => {
  const usuarios = leerUsuarios();
  return usuarios.find(u => u.email === email);
};

// Obtener usuario por ID
const obtenerPorId = (id) => {
  const usuarios = leerUsuarios();
  return usuarios.find(u => u.id === id);
};

// Agregar nuevo usuario
const agregarUsuario = (usuarioNuevo) => {
  const usuarios = leerUsuarios();
  
  // Verificar que no exista email duplicado
  if (usuarios.some(u => u.email === usuarioNuevo.email)) {
    return null;
  }
  
  // Generar nuevo ID
  const nuevoId = usuarios.length > 0 ? Math.max(...usuarios.map(u => u.id)) + 1 : 1;
  
  const usuario = {
    id: nuevoId,
    ...usuarioNuevo,
    estado: 'activo',
    fechaRegistro: new Date().toISOString(),
    ultimaCompra: null
  };
  
  usuarios.push(usuario);
  guardarUsuarios(usuarios);
  
  return usuario;
};

// Actualizar usuario
const actualizarUsuario = (id, datosActualizados) => {
  const usuarios = leerUsuarios();
  const index = usuarios.findIndex(u => u.id === id);
  
  if (index === -1) return null;
  
  usuarios[index] = {
    ...usuarios[index],
    ...datosActualizados,
    id: usuarios[index].id, // No permitir cambiar ID
    email: usuarios[index].email, // No permitir cambiar email
    password: usuarios[index].password // No permitir cambiar password directamente
  };
  
  guardarUsuarios(usuarios);
  return usuarios[index];
};

// Eliminar usuario
const eliminarUsuario = (id) => {
  const usuarios = leerUsuarios();
  const index = usuarios.findIndex(u => u.id === id);
  
  if (index === -1) return false;
  
  usuarios.splice(index, 1);
  guardarUsuarios(usuarios);
  return true;
};

// Obtener todos los usuarios (sin passwords)
const obtenerTodos = () => {
  const usuarios = leerUsuarios();
  // No devolver passwords en la respuesta
  return usuarios.map(({ password, ...rest }) => rest);
};

// Actualizar última compra
const actualizarUltimaCompra = (email) => {
  const usuarios = leerUsuarios();
  const index = usuarios.findIndex(u => u.email === email);
  
  if (index !== -1) {
    usuarios[index].ultimaCompra = new Date().toISOString();
    guardarUsuarios(usuarios);
  }
};

module.exports = {
  leerUsuarios,
  guardarUsuarios,
  obtenerPorEmail,
  obtenerPorId,
  agregarUsuario,
  actualizarUsuario,
  eliminarUsuario,
  obtenerTodos,
  actualizarUltimaCompra
};

const mongoose = require('mongoose');
require('dotenv').config();

const Producto = require('./models/Producto');

// IDs a eliminar (puedes modificar esto)
const idsAEliminar = process.argv.slice(2);

if (idsAEliminar.length === 0) {
  console.log('❌ Uso: node eliminar-por-id.js <id1> <id2> ...');
  console.log('Ejemplo: node eliminar-por-id.js 69435fceb195a1f8a950b120');
  process.exit(1);
}

mongoose.connect(process.env.MONGODB_URI, {
  connectTimeoutMS: 180000,
  socketTimeoutMS: 180000
}).then(async () => {
  try {
    let eliminados = 0;
    
    for (const id of idsAEliminar) {
      const resultado = await Producto.findByIdAndDelete(id);
      if (resultado) {
        console.log(`✅ Eliminado: ${resultado.nombre}`);
        eliminados++;
      } else {
        console.log(`⚠️  No encontrado: ${id}`);
      }
    }
    
    console.log(`\n📊 Total eliminados: ${eliminados}`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}).catch(err => {
  console.error('❌ Error conexión:', err.message);
  process.exit(1);
});

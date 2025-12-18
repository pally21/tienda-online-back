require('dotenv').config();

console.log('\n╔════════════════════════════════════════════════════════╗');
console.log('║  🔍 DIAGNÓSTICO DE CONEXIÓN A MONGODB                  ║');
console.log('╚════════════════════════════════════════════════════════╝\n');

console.log('📋 Variables de entorno:');
console.log(`   MONGODB_URI: ${process.env.MONGODB_URI ? '✅ Configurada' : '❌ NO configurada'}`);

if (process.env.MONGODB_URI) {
  const uri = process.env.MONGODB_URI;
  console.log('\n🔗 Detalles de la conexión:');
  
  // Extraer componentes
  const match = uri.match(/mongodb\+srv:\/\/([^:]+):([^@]+)@([^/]+)\/([^?]+)/);
  
  if (match) {
    console.log(`   Usuario: ${match[1]}`);
    console.log(`   Contraseña: ${'*'.repeat(match[2].length)} (${match[2].length} caracteres)`);
    console.log(`   Cluster: ${match[3]}`);
    console.log(`   BD: ${match[4]}`);
  }
  
  console.log('\n⚠️  VERIFICAR:');
  console.log('   1. ¿La contraseña es exactamente igual a MongoDB Atlas?');
  console.log('   2. ¿Está tu IP en la lista blanca de MongoDB?');
  console.log('   3. ¿El usuario existe en MongoDB Atlas?');
  console.log('\n💡 PRÓXIMOS PASOS:');
  console.log('   1. Ve a https://cloud.mongodb.com');
  console.log('   2. Verifica "Database Access" - busca el usuario');
  console.log('   3. Si necesitas cambiar contraseña:');
  console.log('      - Haz clic en los 3 puntos (...) del usuario');
  console.log('      - Selecciona "Edit Password"');
  console.log('      - Genera una nueva contraseña (sin caracteres especiales si es posible)');
  console.log('      - Copia la nueva contraseña aquí\n');
}

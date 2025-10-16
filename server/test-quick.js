const mongoose = require('mongoose');

console.log('🧪 Prueba rápida de MongoDB Atlas\n');

const MONGODB_URI = "mongodb+srv://nexxusgammer_db_user:YwR6ix7ePtGFBRGt@atlas-sql-67a2d944f643a65cc4821fff-vzn0l.a.query.mongodb.net/sample_mflix?retryWrites=true&w=majority";

async function quickTest() {
  try {
    console.log('1. Conectando...');
    await mongoose.connect(MONGODB_URI, { 
      serverSelectionTimeoutMS: 15000 
    });
    
    console.log('2. ✅ ¡Conectado!');
    console.log('   Base de datos:', mongoose.connection.db.databaseName);
    
    // Probar una operación simple
    const Product = mongoose.model('Product', new mongoose.Schema({}));
    const count = await Product.countDocuments();
    console.log(`3. 📊 Productos en la base de datos: ${count}`);
    
    await mongoose.connection.close();
    console.log('\n🎉 ¡Todo funciona! Puedes usar node server.js');
    
  } catch (error) {
    console.log('❌ Error:', error.message);
    console.log('\n🔧 Aunque tengas 0.0.0.0/0, verifica:');
    console.log('   - El cluster está activo en Atlas');
    console.log('   - El usuario y contraseña son correctos');
    console.log('   - Esperaste 2-3 minutos después de agregar la IP');
  }
}

quickTest();
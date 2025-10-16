const mongoose = require('mongoose');

console.log('🔍 Diagnóstico completo de MongoDB Atlas\n');

const testURIs = [
  {
    name: "SRV Original",
    uri: "mongodb+srv://nexxusgammer_db_user:YwR6ix7ePtGFBRGt@atlas-sql-67a2d944f643a65cc4821fff-vzn0l.a.query.mongodb.net/sample_mflix?retryWrites=true&w=majority"
  },
  {
    name: "Directa con SSL", 
    uri: "mongodb://nexxusgammer_db_user:YwR6ix7ePtGFBRGt@atlas-sql-67a2d944f643a65cc4821fff-vzn0l.a.query.mongodb.net:27017/sample_mflix?retryWrites=true&w=majority&ssl=true"
  },
  {
    name: "Directa sin SSL",
    uri: "mongodb://nexxusgammer_db_user:YwR6ix7ePtGFBRGt@atlas-sql-67a2d944f643a65cc4821fff-vzn0l.a.query.mongodb.net:27017/sample_mflix?retryWrites=true&w=majority"
  }
];

async function testConnection(uriConfig) {
  console.log(`\n🧪 Probando: ${uriConfig.name}`);
  console.log(`   URI: ${uriConfig.uri.replace(/:[^:]*@/, ':****@')}`);
  
  try {
    await mongoose.connect(uriConfig.uri, {
      serverSelectionTimeoutMS: 10000
    });
    
    console.log(`   ✅ CONEXIÓN EXITOSA`);
    console.log(`   📊 BD: ${mongoose.connection.db.databaseName}`);
    
    await mongoose.connection.close();
    return true;
    
  } catch (error) {
    console.log(`   ❌ ERROR: ${error.message}`);
    return false;
  }
}

async function runDiagnosis() {
  console.log('📋 Ejecutando diagnóstico completo...\n');
  
  let anySuccess = false;
  
  for (const uriConfig of testURIs) {
    const success = await testConnection(uriConfig);
    if (success) anySuccess = true;
    
    // Pequeña pausa entre tests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('\n📊 RESULTADO DEL DIAGNÓSTICO:');
  if (anySuccess) {
    console.log('✅ Al menos una conexión funciona');
    console.log('🚀 Puedes usar el servidor principal');
  } else {
    console.log('❌ Ninguna conexión funciona');
    console.log('\n🔧 VERIFICA EN MONGODB ATLAS:');
    console.log('   1. ⚡ Cluster ACTIVO (no pausado)');
    console.log('   2. 👤 Usuario existe en Database Access');
    console.log('   3. 🌐 0.0.0.0/0 en Network Access');
    console.log('   4. ⏳ Espera 5-10 minutos después de cambios');
  }
}

runDiagnosis();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const MONGODB_URI = "mongodb+srv://nexxusgammer_db_user:YwR6ix7ePtGFBRGt@atlas-sql-67a2d944f643a65cc4821fff-vzn0l.a.query.mongodb.net/sample_mflix?retryWrites=true&w=majority";

console.log('📡 Conectando a MongoDB Atlas para importación...');

// Esquema temporal para importación
const productSchema = new mongoose.Schema({
  ProductoId: String,
  nombre: String,
  descripcion: String,
  precio: Number,
  precio_original: Number,
  stock: Number,
  categoria: String,
  imagen: String,
  en_oferta: Boolean
});

const Product = mongoose.model('Product', productSchema, 'productos');

async function importData() {
  try {
    // Conexión simple sin opciones deprecated
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conectado a MongoDB Atlas');

    // Buscar archivo JSON en varias ubicaciones
    const posiblesPaths = [
      path.join(__dirname, 'server.json'),
      path.join(__dirname, '../server.json'),
      path.join(process.cwd(), 'server.json'),
      path.join(__dirname, 'imports', 'server.json')
    ];

    let productosPath = null;
    for (const p of posiblesPaths) {
      if (fs.existsSync(p)) {
        productosPath = p;
        break;
      }
    }

    if (!productosPath) {
      console.error('❌ No se encontró productos.json');
      console.log('📁 Buscando en:');
      posiblesPaths.forEach(p => console.log('   -', p));
      process.exit(1);
    }

    console.log('📁 Archivo encontrado:', productosPath);
    const productosData = JSON.parse(fs.readFileSync(productosPath, 'utf8'));
    
    console.log(`📊 Importando ${productosData.length} productos...`);
    
    // Limpiar colección existente
    await Product.deleteMany({});
    console.log('🧹 Colección de productos limpiada');
    
    // Insertar nuevos datos
    await Product.insertMany(productosData);
    console.log(`✅ ${productosData.length} productos importados correctamente`);
    
    // Verificar
    const count = await Product.countDocuments();
    console.log(`📊 Total de productos en la base de datos: ${count}`);
    
    await mongoose.connection.close();
    console.log('🎉 Importación completada!');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error en la importación:', error);
    
    // Intentar conexión directa si hay error de DNS
    if (error.message.includes('ENODATA') || error.message.includes('querySrv')) {
      console.log('🔄 Intentando conexión directa...');
      try {
        const directURI = MONGODB_URI.replace('mongodb+srv://', 'mongodb://');
        await mongoose.connect(directURI);
        console.log('✅ Conectado via método directo');
        // Continuar con la importación...
      } catch (directError) {
        console.error('❌ Error en conexión directa:', directError.message);
      }
    }
    
    process.exit(1);
  }
}

// Solo ejecutar si se llama directamente
if (require.main === module) {
  importData();
}

module.exports = importData;
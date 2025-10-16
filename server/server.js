console.log("🚀 Iniciando NexusGammer Backend (Modo Híbrido)...");

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const http = require("http");

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 4019;

console.log("🔧 Configurando servidor...");

// Crear directorio uploads
const uploadsPath = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
  console.log("📁 Carpeta uploads creada");
}

// ---------- Middlewares ----------
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Servir archivos estáticos
app.use(express.static("public"));
app.use("/uploads", express.static(uploadsPath));

// ---------- Datos en memoria (como respaldo) ----------
let productos = [];

// Intentar cargar datos del server.json
try {
  const jsonPath = path.join(__dirname, 'server.json');
  if (fs.existsSync(jsonPath)) {
    const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    
    if (Array.isArray(jsonData)) {
      productos = jsonData;
    } else if (jsonData.productos) {
      productos = jsonData.productos;
    } else if (jsonData.data) {
      productos = jsonData.data;
    }
    
    console.log(`📊 ${productos.length} productos cargados desde server.json`);
  } else {
    console.log("📝 Usando datos de ejemplo en memoria");
    productos = [
      {
        ProductoId: "PROD001",
        nombre: "Producto Ejemplo 1",
        descripcion: "Descripción del producto 1",
        precio: 99.99,
        precio_original: 129.99,
        stock: 10,
        categoria: "Electrónicos",
        imagen: "/uploads/ejemplo1.jpg",
        en_oferta: true
      },
      {
        ProductoId: "PROD002",
        nombre: "Producto Ejemplo 2", 
        descripcion: "Descripción del producto 2",
        precio: 49.99,
        precio_original: 49.99,
        stock: 25,
        categoria: "Hogar",
        imagen: "/uploads/ejemplo2.jpg",
        en_oferta: false
      }
    ];
  }
} catch (error) {
  console.error("❌ Error cargando datos locales:", error.message);
}

// ---------- Intentar conectar a MongoDB (en segundo plano) ----------
let mongoConnected = false;
let ProductModel = null;

const connectMongoDB = async () => {
  const MONGODB_URI = "mongodb://nexxusgammer_db_user:YwR6ix7ePtGFBRGt@atlas-sql-67a2d944f643a65cc4821fff-vzn0l.a.query.mongodb.net:27017/sample_mflix?retryWrites=true&w=majority&ssl=true";
  
  try {
    console.log("🔄 Intentando conectar a MongoDB en segundo plano...");
    
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 30000
    });
    
    mongoConnected = true;
    console.log("✅ MongoDB conectado exitosamente!");
    
    // Configurar modelo de MongoDB
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
    
    ProductModel = mongoose.model("Product", productSchema, 'productos');
    
    // Sincronizar datos locales con MongoDB si es necesario
    try {
      const count = await ProductModel.countDocuments();
      console.log(`📊 MongoDB tiene ${count} productos`);
    } catch (e) {
      console.log("📝 MongoDB lista para usar");
    }
    
  } catch (error) {
    console.log("⚠️  MongoDB no disponible:", error.message);
    console.log("💡 Usando datos locales. La app funciona normalmente.");
  }
};

// Iniciar conexión en segundo plano
connectMongoDB();

// ---------- Routes Inteligentes (usan MongoDB si está disponible, si no datos locales) ----------

// Health check mejorado
app.get("/", (req, res) => {
  res.json({ 
    status: "healthy",
    message: "🚀 NexusGammer Backend funcionando",
    database: mongoConnected ? "mongodb" : "local",
    products_count: productos.length,
    timestamp: new Date().toISOString()
  });
});

// Obtener todos los productos
app.get('/api/products', async (req, res) => {
  try {
    if (mongoConnected && ProductModel) {
      // Usar MongoDB si está disponible
      const products = await ProductModel.find().sort({ fecha_creacion: -1 });
      console.log(`📦 MongoDB: Enviando ${products.length} productos`);
      res.json(products);
    } else {
      // Usar datos locales
      console.log(`📦 Local: Enviando ${productos.length} productos`);
      res.json(productos);
    }
  } catch (error) {
    console.error('❌ Error al obtener productos:', error);
    // Fallback a datos locales
    res.json(productos);
  }
});

// Obtener producto por ID
app.get('/api/products/:id', async (req, res) => {
  try {
    if (mongoConnected && ProductModel) {
      const product = await ProductModel.findOne({ ProductoId: req.params.id });
      if (!product) return res.status(404).json({ message: 'Producto no encontrado' });
      res.json(product);
    } else {
      const product = productos.find(p => p.ProductoId === req.params.id);
      if (!product) return res.status(404).json({ message: 'Producto no encontrado' });
      res.json(product);
    }
  } catch (error) {
    console.error('❌ Error al obtener producto:', error);
    res.status(500).json({ message: 'Error al obtener el producto' });
  }
});

// Obtener ofertas
app.get('/api/productos/ofertas', async (req, res) => {
  try {
    if (mongoConnected && ProductModel) {
      const ofertas = await ProductModel.find({ en_oferta: true });
      console.log(`🎯 MongoDB: ${ofertas.length} ofertas`);
      res.json(ofertas);
    } else {
      const ofertas = productos.filter(p => p.en_oferta);
      console.log(`🎯 Local: ${ofertas.length} ofertas`);
      res.json(ofertas);
    }
  } catch (error) {
    console.error('❌ Error obteniendo ofertas:', error);
    const ofertas = productos.filter(p => p.en_oferta);
    res.json(ofertas);
  }
});

// Endpoint para verificar estado de MongoDB
app.get('/api/mongo-status', (req, res) => {
  res.json({
    mongodb: mongoConnected ? "connected" : "disconnected",
    local_data: productos.length + " productos",
    timestamp: new Date().toISOString()
  });
});

// ---------- Multer para uploads ----------
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsPath),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `img-${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
});

// Upload de imágenes
app.post('/api/upload', upload.single('imagen'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se subió ningún archivo' });
    }
    
    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({ 
      message: 'Imagen subida correctamente', 
      url: imageUrl,
      filename: req.file.filename
    });
  } catch (error) {
    console.error('❌ Error subiendo imagen:', error);
    res.status(500).json({ error: 'Error al subir la imagen' });
  }
});

// ---------- Socket.IO ----------
const { Server } = require("socket.io");
const io = new Server(server, { 
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log("✅ Socket conectado:", socket.id);
  
  socket.on("disconnect", () => {
    console.log("❌ Socket desconectado:", socket.id);
  });
});

// ---------- Start Server ----------
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
  console.log(`🌍 Health check: http://localhost:${PORT}/`);
  console.log(`📊 Estado MongoDB: ${mongoConnected ? '✅ Conectado' : '❌ Usando datos locales'}`);
  console.log(`📦 Productos cargados: ${productos.length}`);
  console.log(`💡 MongoDB se conectará automáticamente cuando esté disponible`);
});

// Verificar MongoDB periódicamente
setInterval(() => {
  if (!mongoConnected && mongoose.connection.readyState === 0) {
    console.log('🔄 Reintentando conexión a MongoDB...');
    connectMongoDB();
  }
}, 30000); // Intentar cada 30 segundos
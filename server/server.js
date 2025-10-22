 console.log("🚀 Iniciando server.js ...");
const express = require("express");
const db = require("./src/config/db.js");
const bcrypt = require("bcrypt");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const http = require("http");
const { Server } = require("socket.io");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");

const app = express();
const server = http.createServer(app);
app.set("trust proxy", 1);

// ---------- CONFIG ----------
const IS_PRODUCTION = process.env.NODE_ENV === "production";
const FRONTEND_URL = IS_PRODUCTION
  ? "https://cheanime.gamer.gd"
  : ["http://localhost:3000", "http://localhost:5173", "http://localhost:5174"];

const SECRET_KEY = process.env.JWT_SECRET;

console.log("🔐 JWT Secret cargado");

// ---------- UPLOADS ----------
const uploadsPath = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsPath)) fs.mkdirSync(uploadsPath, { recursive: true });
console.log("📁 Carpeta uploads lista:", uploadsPath);

// ---------- MIDDLEWARES ----------
app.use(helmet());
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
    exposedHeaders: ["Cross-Origin-Resource-Policy"],
  })
);
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// ---------- FRONTEND ----------
const frontendPath = path.join(__dirname, "dist");
if (fs.existsSync(frontendPath)) {
  app.use(express.static(frontendPath));
  app.get("*", (req, res) => res.sendFile(path.join(frontendPath, "index.html")));
  console.log("🎯 Frontend servido desde:", frontendPath);
}

// ---------- SERVIR IMÁGENES ----------
app.use(
  "/uploads",
  (req, res, next) => {
    res.set("Cross-Origin-Resource-Policy", "cross-origin");
    next();
  },
  express.static(uploadsPath)
);

// ---------- DB QUERY ----------
const dbQuery = async (sql, params = []) => {
  try {
    const [rows] = await db.execute(sql, params);
    return rows;
  } catch (error) {
    console.error("❌ Error SQL:", error);
    throw error;
  }
};

// ---------- RATE LIMIT ----------
app.use(rateLimit({ windowMs: 60_000, max: 100 }));
const loginLimiter = rateLimit({ windowMs: 15 * 60_000, max: 10 });

// ---------- MULTER ----------
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsPath),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ["image/webp", "image/png", "image/jpeg"];
    if (!allowed.includes(file.mimetype)) return cb(new Error("Solo JPEG, PNG o WEBP"));
    cb(null, true);
  },
});

// ---------- JWT ----------
const generarToken = (id, rol) => jwt.sign({ id, rol }, SECRET_KEY, { expiresIn: "7d" });

const verificarToken = async (req, res, next) => {
  const header = req.headers["authorization"];
  if (!header) return res.status(403).json({ error: "Token requerido" });
  const [bearer, token] = header.split(" ");
  if (bearer !== "Bearer" || !token) return res.status(403).json({ error: "Formato de token inválido" });
  try {
    req.user = jwt.verify(token, SECRET_KEY);
    next();
  } catch {
    return res.status(403).json({ error: "Token inválido o expirado" });
  }
};

// ---------- SOCKET.IO ----------
const io = new Server(server, { cors: { origin: FRONTEND_URL, credentials: true } });
io.on("connection", (socket) => {
  console.log("✅ Socket conectado:", socket.id);
  socket.on("disconnect", () => console.log("❌ Socket desconectado:", socket.id));
});

// =====================================================
//  ENDPOINTS
// =====================================================

// Productos
app.get("/api/productos", async (req, res) => {
  try {
    const rows = await dbQuery("SELECT * FROM productos ORDER BY ProductoId DESC");
    if (!rows.length) return res.status(404).json({ message: "No hay productos disponibles" });
    res.json(rows);
  } catch (error) {
    console.error("❌ Error al obtener productos:", error);
    res.status(500).json({ message: "Error al obtener productos" });
  }
});

app.get("/api/productos/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const rows = await dbQuery("SELECT * FROM productos WHERE ProductoId = ?", [id]);
    if (!rows.length) return res.status(404).json({ message: "Producto no encontrado" });
    res.json(rows[0]);
  } catch (error) {
    console.error("❌ Error al obtener producto:", error);
    res.status(500).json({ message: "Error al obtener el producto" });
  }
});

// Actualizar producto
app.put("/api/productos/:id", verificarToken, upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, precio, stock } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    // Si hay imagen, eliminamos la anterior
    const productoActual = await dbQuery("SELECT imagen FROM productos WHERE ProductoId = ?", [id]);
    if (!productoActual.length) return res.status(404).json({ message: "Producto no encontrado" });

    if (image && productoActual[0].imagen) {
      const oldImagePath = path.join(uploadsPath, path.basename(productoActual[0].imagen));
      if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
    }

    const result = await dbQuery(
      "UPDATE productos SET nombre = ?, precio = ?, stock = ?, imagen = ? WHERE ProductoId = ?",
      [nombre, precio, stock, image, id]
    );
    res.json({ success: true });
  } catch (error) {
    console.error("❌ Error actualizando producto:", error);
    res.status(500).json({ success: false });
  }
});

// Eliminar producto
app.delete("/api/productos/:id", verificarToken, async (req, res) => {
  try {
    const { id } = req.params;
    const producto = await dbQuery("SELECT imagen FROM productos WHERE ProductoId = ?", [id]);
    if (!producto.length) return res.status(404).json({ message: "Producto no encontrado" });

    // Eliminar imagen si existe
    if (producto[0].imagen) {
      const imagePath = path.join(uploadsPath, path.basename(producto[0].imagen));
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }

    await dbQuery("DELETE FROM productos WHERE ProductoId = ?", [id]);
    res.json({ success: true });
  } catch (error) {
    console.error("❌ Error eliminando producto:", error);
    res.status(500).json({ success: false });
  }
});

app.post("/api/productos", upload.single("image"), async (req, res) => {
  try {
    const { nombre, precio, stock } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;
    const result = await dbQuery(
      "INSERT INTO productos (nombre, precio, stock, imagen) VALUES (?, ?, ?, ?)",
      [nombre, precio, stock, image]
    );
    res.json({ success: true, productId: result.insertId });
  } catch (error) {
    console.error("❌ Error creando producto:", error);
    res.status(500).json({ success: false });
  }
});

// Usuarios
app.post("/api/login", loginLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;
    
     if (!email || !password) {
      return res.status(400).json({ message: "Email y contraseña son requeridos" });
    }
    
     const rows = await dbQuery("SELECT * FROM usuarios WHERE UsersEmail = ?", [email]);
    
    if (!rows.length) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    
    const user = rows[0];
    
     if (!user.HashPw || typeof user.HashPw !== 'string') {
      return res.status(500).json({ message: "Error en el almacenamiento de contraseña" });
    }
    
     const match = await bcrypt.compare(password, user.HashPw);
    if (!match) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }
    
     const token = generarToken(user.Id, user.Rol);
    
     res.json({ 
      success: true, 
      token, 
      rol: user.Rol,
      redirect: user.Rol === 'admin' ? '/staff/dashboard' : '/dashboard'
    });
    
  } catch (error) {
    console.error("❌ Error login:", error);
    res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
});

app.post("/api/register", async (req, res) => {
  try {
    const { NickName, UsersEmail, HashPw } = req.body;
    
    // Validación de dominio permitido
    const allowedDomains = [
      'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com',
      'aol.com', 'protonmail.com', 'mail.com', 'zoho.com', 'yandex.com',
      'live.com', 'msn.com', 'gmx.com', 'tutanota.com', 'hushmail.com'
    ];
    
    const emailDomain = UsersEmail.split('@')[1]?.toLowerCase();
    
    if (!emailDomain || !allowedDomains.includes(emailDomain)) {
      return res.status(400).json({ 
        success: false, 
        message: "Dominio de correo no permitido. Use un servicio de correo común." 
      });
    }

    const hashed = await bcrypt.hash(HashPw, 10);
    
    const result = await dbQuery(
      "INSERT INTO usuarios (NickName, UsersEmail, HashPw, Rol, Estado, created_at) VALUES (?, ?, ?, 'user', 1, NOW())",
      [NickName, UsersEmail, hashed]
    );
    
    res.json({ success: true, userId: result.insertId });
  } catch (error) {
    console.error("❌ Error registrando usuario:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get("/api/check-register", async (req, res) => {
  try {
    const { nickname, email } = req.query;

     if (!nickname && !email) {
      return res.status(400).json({ 
        success: false, 
        message: "Proporciona nickname o email para verificar" 
      });
    }

     let query = "SELECT NickName, UsersEmail FROM usuarios WHERE ";
    const params = [];
    
    if (nickname) {
      query += "NickName = ?";
      params.push(nickname);
    }
    
    if (email) {
      if (nickname) query += " OR ";  
      query += "UsersEmail = ?";
      params.push(email);
    }

    const results = await dbQuery(query, params);
    
     const nicknameExists = results.some(user => user.NickName === nickname);
    const emailExists = results.some(user => user.UsersEmail === email);

    res.json({
      success: true,
      data: {
        nicknameExists,
        emailExists,
        message: nicknameExists || emailExists 
          ? "Algunos datos ya están en uso" 
          : "Datos disponibles"
      }
    });

  } catch (error) {
    console.error("❌ Error en check register:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error al verificar disponibilidad" 
    });
  }
});

// ---------- RUTAS BLOQUEADAS ----------
const bloquearRuta = (req, res) => {
  res.status(403).send(`
    <html>
      <head><title>Acceso Denegado</title></head>
      <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
        <h1>🚫 No se puede acceder a este sitio</h1>
        <p>El acceso a esta página ha sido restringido.</p>
      </body>
    </html>
  `);
};
const RUTAS_BLOQUEADAS = ["/api/offerts", "/api/posts", "/admin", "/config"];
RUTAS_BLOQUEADAS.forEach(ruta => app.use(ruta, bloquearRuta));

// ---------- INICIAR SERVIDOR ----------
const PORT = process.env.PORT || 4019;
server.listen(PORT, "0.0.0.0", () => {
   console.log(`🌐 URLs permitidas para CORS: ${FRONTEND_URL}`);
  console.log(`🔌 Servidor backend: http://localhost:${PORT}`);
  console.log(`📁 Carpeta de uploads: ${uploadsPath}`);
  console.log(`🗄️ Base de datos: ${process.env.DB_NAME}`);
  console.log(`✅ Todo cargado correctamente.`);
});

require("dotenv").config();
const express = require("express");
const mysql = require("mysql2/promise");
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

const SECRET_KEY = process.env.JWT_SECRET || "tu_clave_secreta_super_segura_12345";
const IS_PRODUCTION = process.env.NODE_ENV === "production";
const FRONTEND_URL = IS_PRODUCTION
  ? "https://cheanime.gamer.gd"
  : ["http://localhost:3000", "http://localhost:5173", "http://localhost:5174"];

// Carpeta de uploads
const uploadsPath = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsPath)) fs.mkdirSync(uploadsPath, { recursive: true });

// Middlewares
app.use(helmet());
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true,
  exposedHeaders: ["Cross-Origin-Resource-Policy"],
}));
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// Servir frontend si existe
const frontendPath = path.join(__dirname, "dist");
if (fs.existsSync(frontendPath)) {
  app.use(express.static(frontendPath));
  app.get("*", (req, res) => res.sendFile(path.join(frontendPath, "index.html")));
}

// Servir uploads
app.use("/uploads", (req, res, next) => {
  res.set("Cross-Origin-Resource-Policy", "cross-origin");
  next();
}, express.static(uploadsPath));

// Base de datos
const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "",
  database: process.env.DB_NAME || "gammernexus",
  waitForConnections: true,
  connectionLimit: 10,
});

const dbQuery = async (sql, params = []) => {
  try {
    const [rows] = await db.execute(sql, params);
    return rows;
  } catch (error) {
    console.error("Error en consulta SQL:", error);
    throw error;
  }
};

db.getConnection()
  .then(() => console.log("✅ Conectado a la base de datos (pool)"))
  .catch(err => {
    console.error("❌ Error al conectar a MySQL:", err);
    process.exit(1);
  });

// JWT
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

// Rate limit
app.use(rateLimit({ windowMs: 60_000, max: 100 }));
const loginLimiter = rateLimit({ windowMs: 15 * 60_000, max: 10 });

// Multer uploads
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

// Socket.IO
const io = new Server(server, { cors: { origin: FRONTEND_URL, credentials: true } });
io.on("connection", (socket) => {
  console.log("✅ Socket conectado:", socket.id);
  socket.on("disconnect", () => console.log("❌ Socket desconectado:", socket.id));
});

// ==================== ENDPOINTS ====================

// Productos
app.get("/api/products", async (req, res) => {
  try {
    const rows = await dbQuery("SELECT * FROM productos ORDER BY ProductoId DESC");
    if (!rows.length) return res.status(404).json({ message: "No hay productos disponibles" });
    res.json(rows);
  } catch (error) {
    console.error("❌ Error al obtener productos:", error);
    res.status(500).json({ message: "Error al obtener productos" });
  }
});

app.get("/api/products/:id", async (req, res) => {
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

app.post("/api/products", upload.single("image"), async (req, res) => {
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
    const rows = await dbQuery("SELECT * FROM usuarios WHERE EmailUsuarios = ?", [email]);
    if (!rows.length) return res.status(404).json({ message: "Usuario no encontrado" });
    const user = rows[0];
    const match = await bcrypt.compare(password, user.PasswordUsuarios);
    if (!match) return res.status(401).json({ message: "Contraseña incorrecta" });
    const token = generarToken(user.Id, user.RolUsuarios);
    res.json({ success: true, token });
  } catch (error) {
    console.error("❌ Error login:", error);
    res.status(500).json({ success: false });
  }
});

app.post("/api/register", async (req, res) => {
  try {
    const { nick, email, password } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const result = await dbQuery(
      "INSERT INTO usuarios (NickUsuarios, EmailUsuarios, PasswordUsuarios, RolUsuarios) VALUES (?, ?, ?, 'user')",
      [nick, email, hashed]
    );
    res.json({ success: true, userId: result.insertId });
  } catch (error) {
    console.error("❌ Error registrando usuario:", error);
    res.status(500).json({ success: false });
  }
});

// ==================== RUTAS BLOQUEADAS ====================
const bloquearRuta = (req, res) => {
  res.status(403).send(`
    <html>
      <head><title>Acceso Denegado</title></head>
      <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
        <h1>🚫 No se puede acceder a este sitio</h1>
        <p>El acceso a esta página ha sido restringido.</p>
      </body>
    </html>
  `); // <-- The closing backtick (`) was missing here.
};
const RUTAS_BLOQUEADAS = ["/api/offerts", "/api/posts", "/admin", "/config"];
RUTAS_BLOQUEADAS.forEach(ruta => app.use(ruta, bloquearRuta));

// ==================== INICIAR SERVIDOR ====================
const PORT = process.env.PORT || 4019;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Servidor ejecutándose en modo: ${IS_PRODUCTION ? "PRODUCCIÓN" : "DESARROLLO"}`);
  console.log(`🌐 URLs permitidas para CORS: ${FRONTEND_URL}`);
  console.log(`🔌 Servidor backend: http://localhost:${PORT}`);
  console.log(`📁 Carpeta de uploads: ${uploadsPath}`);
  console.log(`🔐 JWT Secret configurado: ✅`);
  console.log(`🗄️ Base de datos: ${process.env.DB_NAME || "gammernexus"}`);
  console.log(`📊 Tabla productos: productos`);
});

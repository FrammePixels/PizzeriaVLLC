console.log("🚀 Iniciando server.js ...");

require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
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

// ---------- ENV & SECRET ----------
const SECRET_KEY = process.env.JWT_SECRET || "clave_local_super_segura";
console.log("🔐 JWT Secret cargado");

const uploadsPath = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsPath)) fs.mkdirSync(uploadsPath, { recursive: true });
console.log("📁 Carpeta uploads lista:", uploadsPath);

// ---------- Seguridad ----------
app.use(helmet());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    exposedHeaders: ["Cross-Origin-Resource-Policy"],
  })
);
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// ---------- Servir frontend (si existe) ----------
const frontendPath = path.join(__dirname, "dist");
if (fs.existsSync(frontendPath)) {
  app.use(express.static(frontendPath));
  app.get("*", (req, res) =>
    res.sendFile(path.join(frontendPath, "index.html"))
  );
  console.log("🎯 Frontend servido desde:", frontendPath);
}

// ---------- Servir imágenes ----------
app.use(
  "/uploads",
  (req, res, next) => {
    res.set("Cross-Origin-Resource-Policy", "cross-origin");
    next();
  },
  express.static(uploadsPath)
);

// ---------- MySQL ----------
let db;
try {
  db = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "",
    database: process.env.DB_NAME || "nexusgammer",
    waitForConnections: true,
    connectionLimit: 10,
    acquireTimeout: 60000,
    connectTimeout: 60000,
    reconnect: true,
  });

  db.getConnection((err, connection) => {
    if (err) console.error("⚠️ Error al conectar a MySQL:", err.message);
    else {
      console.log("✅ Conectado a la base de datos local (MySQL)");
      connection.release();
    }
  });

  db.on("error", (err) => {
    console.error("🔄 Error en pool de MySQL:", err.message);
  });
} catch (err) {
  console.error("❌ Error crítico MySQL:", err.message);
}

// Función para queries con promesas
const dbQuery = (...args) =>
  new Promise((resolve, reject) =>
    db.query(...args, (err, results) => (err ? reject(err) : resolve(results)))
  );

// ---------- Rate Limit ----------
app.use(rateLimit({ windowMs: 60_000, max: 100 }));
const loginLimiter = rateLimit({ windowMs: 15 * 60_000, max: 10 });

// ---------- Multer ----------
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
// Endpoint para traer todos los productos
app.get('/api/productos', async (req, res) => {
  try {
    const [rows] = await db.promise().query('SELECT * FROM productos');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener los productos' });
  }
});

app.get('/api/productos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.promise().query('SELECT * FROM productos WHERE ProductoId = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Producto no encontrado' });
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener el producto' });
  }
});



// ---------- Socket.IO ----------
let io;
try {
  io = new Server(server, { cors: { origin: "*" } });
  io.on("connection", (socket) => {
    console.log("✅ Socket conectado:", socket.id);
    socket.on("disconnect", () => console.log("❌ Socket desconectado:", socket.id));
  });
} catch (err) {
  console.error("❌ Error Socket.IO:", err.message);
}
// ---- OFERTAS EN TIEMPO REAL ----
 app.get('/api/productos/ofertas', async (req, res) => {
  try {
    const [rows] = await connection.execute(
      "SELECT * FROM en_oferta WHERE en_ofertas = '1'"
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching offers:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ---------- Endpoint prueba ----------
app.get("/", (req, res) => res.send("Servidor funcionando en localhost ✅"));

// ---------- Error global ----------
app.use((err, req, res, next) => {
  console.error("ERROR GLOBAL:", err.message);
  if (err instanceof multer.MulterError) return res.status(400).json({ error: err.message });
  res.status(500).json({ error: "Error interno del servidor" });
});


// ---------- START SERVER ----------
const PORT = process.env.PORT || 4019;
server.listen(PORT, "localhost", () => {
  console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
});

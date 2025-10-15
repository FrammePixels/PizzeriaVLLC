
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

app.set('trust proxy', 1); // 1 = primer proxy, puedes usar true para confiar en todos


// ---------- ENV & SECRET ----------
  if (!SECRET_KEY) process.exit(1);

// ---------- Crear carpeta uploads ----------
const uploadsPath = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsPath)) fs.mkdirSync(uploadsPath, { recursive: true });

// ---------- Seguridad ----------
app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => callback(null, true), // Permitir cualquier origen en Koyeb
    credentials: true,
    exposedHeaders: ["Cross-Origin-Resource-Policy"],
  })
);
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// =============================
// 🎯 SERVIR FRONTEND (REACT)
// =============================
const frontendPath = path.join(__dirname, 'dist');
if (fs.existsSync(frontendPath)) {
  app.use(express.static(frontendPath));
  app.get('*', (req, res) => res.sendFile(path.join(frontendPath, 'index.html')));
}

// ---------- Servir imágenes públicas ----------
app.use(
  "/uploads",
  (req, res, next) => {
    res.set("Cross-Origin-Resource-Policy", "cross-origin");
    next();
  },
  express.static(uploadsPath)
);// ---------- MySQL ----------
const db = mysql.createPool({
  host: process.env.DB_HOST || "sql104.infinityfree.com",
  user: process.env.DB_USER || "if0_40151644",
  password: process.env.DB_PASS || "4jHOy2ajqSXt05",
  database: process.env.DB_NAME || "if0_40151644_animeflvclone",
  waitForConnections: true,
  connectionLimit: 10,
  acquireTimeout: 60000, // Añade timeout
  connectTimeout: 60000, // Añade timeout
  reconnect: true        // Permitir reconexión
});

const dbQuery = (...args) =>
  new Promise((resolve, reject) =>
    db.query(...args, (err, results) => (err ? reject(err) : resolve(results)))
  );

// VERIFICACIÓN DE CONEXIÓN (SIN process.exit)
db.getConnection((err, connection) => {
  if (err) {
    console.error("⚠️  Error inicial al conectar a MySQL:", err.message);
    console.log("🔄 La aplicación continuará e intentará reconectar...");
  } else {
    console.log("✅ Conectado a la base de datos (pool)");
    connection.release();
  }
});

// Manejo de errores del pool
db.on('error', (err) => {
  console.error('🔄 Error en el pool de MySQL:', err.message);
  console.log('🔄 Reintentando conexión...');
});
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

// ---------- Socket.IO ----------
const io = new Server(server, { cors: { origin: "*", credentials: true } });
io.on("connection", (socket) => {
  console.log("✅ Socket conectado:", socket.id);
  socket.on("disconnect", () => console.log("❌ Socket desconectado:", socket.id));
});
// =============================
// 🎯 ENDPOINTS AUTENTICACIÓN
// =============================

// LOGIN
app.post("/api/login", loginLimiter, async (req, res) => {
  try {
    const { nickname, password } = req.body;
    if (!nickname || !password) return res.status(400).json({ error: "Nick y contraseña son obligatorios" });

    const search = nickname.trim().toLowerCase();
    const results = await dbQuery(
      `SELECT Id, NickUsuarios, EmailUsuarios, HashPwUsuarios, RolUsuarios 
       FROM usuarios WHERE LOWER(NickUsuarios)=? OR LOWER(EmailUsuarios)=?`,
      [search, search]
    );
    if (!results.length) return res.status(401).json({ error: "Usuario o contraseña incorrectos" });

    const user = results[0];
    const valid = await bcrypt.compare(password, user.HashPwUsuarios);
    if (!valid) return res.status(401).json({ error: "Usuario o contraseña incorrectos" });

    const token = generarToken(user.Id, user.RolUsuarios);
    res.json({ token, rol: user.RolUsuarios, user: { id: user.Id, nick: user.NickUsuarios, email: user.EmailUsuarios } });
  } catch (err) {
    console.error("[LOGIN] Error interno:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// REGISTER
app.post("/register", async (req, res) => {
  try {
    const { nickname, email, password } = req.body;
    if (!nickname || !email || !password) return res.status(400).json({ error: "Todos los campos son obligatorios" });

    const exists = await dbQuery(
      "SELECT Id FROM usuarios WHERE LOWER(NickUsuarios)=? OR LOWER(EmailUsuarios)=?",
      [nickname.trim().toLowerCase(), email.trim().toLowerCase()]
    );
    if (exists.length > 0) return res.status(400).json({ error: "Usuario o email ya existe" });

    const hashedPassword = await bcrypt.hash(password, 10);
    await dbQuery("INSERT INTO usuarios (NickUsuarios, EmailUsuarios, HashPwUsuarios, RolUsuarios) VALUES (?, ?, ?, ?)",
      [nickname.trim(), email.trim(), hashedPassword, "usuario"]);

    res.status(201).json({ message: "Usuario registrado correctamente" });
  } catch (err) {
    console.error("[REGISTER] Error:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// GET CURRENT USER
app.get("/api/me", verificarToken, async (req, res) => {
  try {
    const results = await dbQuery("SELECT Id, NickUsuarios, EmailUsuarios, RolUsuarios FROM usuarios WHERE Id=?", [req.user.id]);
    if (!results.length) return res.status(404).json({ error: "Usuario no encontrado" });
    const user = results[0];
    res.json({ user: { id: user.Id, nick: user.NickUsuarios, email: user.EmailUsuarios, rol: user.RolUsuarios } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// =============================
// 🎯 CRUD ANIMES / POSTS
// =============================

// GET ALL POSTS
app.get("/posts", async (req, res) => {
  try {
    const results = await dbQuery("SELECT * FROM posts ORDER BY created_at DESC");
    res.json(results.map(p => ({ ...p, Imagen: p.Imagen ? `/uploads/${p.Imagen}` : null })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener posts" });
  }
});

// CREATE POST
app.post("/api/posts", verificarToken, upload.single("imagen"), async (req, res) => {
  try {
    const { titulo, descripcion, episodio, hashtags } = req.body;
    if (!titulo || !descripcion) return res.status(400).json({ error: "Título y descripción son obligatorios" });

    const imagen = req.file ? req.file.filename : null;
    const result = await dbQuery(
      `INSERT INTO posts (user_id, Titulo, Descripcion, Imagen, Episodio, hashtags, Visitas, Puntos, created_at) 
       VALUES (?, ?, ?, ?, ?, ?, 0, 0, NOW())`,
      [req.user.id, titulo, descripcion, imagen, episodio || "Episodio 1", hashtags || ""]
    );

    io.emit("newPost", { PostId: result.insertId, Titulo: titulo, Descripcion: descripcion, Imagen: imagen, Episodio: episodio });
    res.status(201).json({ message: "Post creado exitosamente", postId: result.insertId });
  } catch (err) {
    console.error("[CREATE POST] Error:", err);
    res.status(500).json({ error: "Error al crear el post" });
  }
});

// DELETE POST
app.delete("/api/posts/:id", verificarToken, async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await dbQuery("SELECT Imagen FROM posts WHERE PostId=?", [id]);
    if (!existing.length) return res.status(404).json({ error: "Post no encontrado" });

    await dbQuery("DELETE FROM posts WHERE PostId=?", [id]);
    if (existing[0].Imagen) {
      const imagePath = path.join(uploadsPath, existing[0].Imagen);
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }

    res.json({ message: "Post eliminado exitosamente" });
  } catch (err) {
    console.error("[DELETE POST] Error:", err);
    res.status(500).json({ error: "Error al eliminar el post" });
  }
});

// =============================
// 🔧 UTILIDADES
// =============================

// UPLOAD IMAGE DE PERFIL
app.post("/api/profile/image", verificarToken, upload.single("imagenPerfil"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No se subió ninguna imagen" });
    await dbQuery("UPDATE usuarios SET ImagenPerfil=? WHERE Id=?", [req.file.filename, req.user.id]);
    res.json({ message: "Imagen de perfil actualizada", url: `/uploads/${req.file.filename}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al guardar la imagen" });
  }
});

// ERROR GLOBAL
app.use((err, req, res, next) => {
  console.error("ERROR GLOBAL:", err.message);
  if (err instanceof multer.MulterError) return res.status(400).json({ error: err.message });
  res.status(500).json({ error: "Error interno del servidor" });
});

// START SERVER
const PORT = process.env.PORT || 8000;
const HOST = process.env.HOST || '0.0.0.0'
server.listen(PORT, HOST, () => {
  console.log(`🚀 Servidor escuchando en https://cheanime.gamer.gd/`);
  console.log(`📁 Carpeta de uploads: ${uploadsPath}`);
  console.log(`🔐 JWT Secret configurado: ✅`);
  console.log(`🎯 Frontend servido desde: ${path.join(__dirname, 'dist')}`);
});

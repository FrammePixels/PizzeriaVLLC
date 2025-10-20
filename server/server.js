console.log("🚀 Iniciando server.js ...");

require("dotenv").config();
const express = require("express");
const mysql = require("mysql2"); // seguimos con mysql2 pero con .promise()
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

// ---------- Servir frontend ----------
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
  }).promise(); // 👈 importante: pool con promesas

  console.log("✅ Conectado a la base de datos local (MySQL)");
} catch (err) {
  console.error("❌ Error crítico MySQL:", err.message);
}

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

// ---------- Endpoints Productos ----------
app.get('/api/productos', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM productos');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener los productos' });
  }
});

app.get('/api/productos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM productos WHERE ProductoId = ?', [id]);
    if (!rows.length) return res.status(404).json({ message: 'Producto no encontrado' });
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener el producto' });
  }
});

app.get('/api/productos/ofertas', async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM en_oferta WHERE en_ofertas = '1'");
    res.json(rows);
  } catch (error) {
    console.error('Error fetching offers:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ---------- Endpoints Pagos ----------
// ✅ API para crear un pedido + pago
app.post("/api/pagos", async (req, res) => {
  try {
    const {
      customer,
      products,
      subtotal,
      total,
      discount,
      discountCode,
      CardNumber,
      CardName,
      ExpiryDate,
      CVV,
      DireccionEntrega,
    } = req.body;

    if (
      !customer ||
      !products ||
      !total ||
      !CardNumber ||
      !CardName ||
      !ExpiryDate ||
      !CVV
    ) {
      return res.status(400).json({ message: "Faltan datos para crear el pago" });
    }

    // Crear el pedido (orden)
    const [pedidoResult] = await db.query(
      "INSERT INTO pedidos (NombreCliente, Email, Direccion, Telefono, Subtotal, Total, Descuento, CodigoDescuento, FechaPedido, DireccionEntrega) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?)",
      [
        customer.name,
        customer.email,
        customer.address,
        customer.phone,
        subtotal,
        total,
        discount,
        discountCode,
        DireccionEntrega,
      ]
    );

    const PedId = pedidoResult.insertId;

    // Crear los productos del pedido
    for (const p of products) {
      await db.query(
        "INSERT INTO pedidos_detalle (PedId, ProductoId, NombreProducto, Cantidad, Precio) VALUES (?, ?, ?, ?, ?)",
        [PedId, p.id, p.name, p.quantity, p.price]
      );
    }

    // Crear el pago
    const Metodo = "Tarjeta de Crédito";
    const Estado = "Completado";

    const [pagoResult] = await db.query(
      "INSERT INTO pagos (PedId, Metodo, Monto, Estado, FechaPago, CardNumber, CardName, ExpiryDate, CVV) VALUES (?, ?, ?, ?, NOW(), ?, ?, ?, ?)",
      [PedId, Metodo, total, Estado, CardNumber, CardName, ExpiryDate, CVV]
    );

    res.status(201).json({
      message: "Pago y pedido creados correctamente",
      orderId: PedId,
      pagoId: pagoResult.insertId,
    });
  } catch (error) {
    console.error("Error en /api/pagos:", error);
    res.status(500).json({ message: "Error al procesar el pago", error });
  }
});

// ✅ Obtener todos los pagos
app.post("/api/pagos", async (req, res) => {
  const { PedId, Metodo, Monto, Estado, CardNumber, CardName, ExpiryDate, CVV, DireccionEntrega, products } = req.body;
  
  if (!PedId || !Metodo || !Monto || !Estado) {
    return res.status(400).json({ message: "Faltan datos para crear el pago" });
  }

  try {
    const [result] = await db.query(
      `INSERT INTO pagos 
       (PedId, Metodo, Monto, Estado, CardNumber, CardName, ExpiryDate, CVV, DireccionEntrega, FechaPago)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [PedId, Metodo, Monto, Estado, CardNumber, CardName, ExpiryDate, CVV, DireccionEntrega]
    );

    res.status(201).json({ message: "Pago creado", PagoId: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al crear el pago" });
  }
});


// ✅ Obtener un pago por ID
app.get("/api/pagos/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query("SELECT * FROM pagos WHERE PagoId = ?", [id]);
    if (!rows.length) return res.status(404).json({ message: "Pago no encontrado" });
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener el pago" });
  }
});

// ✅ Eliminar un pago
app.delete("/api/pagos/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query("DELETE FROM pagos WHERE PagoId = ?", [id]);
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Pago no encontrado" });
    res.json({ message: "Pago eliminado" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al eliminar el pago" });
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

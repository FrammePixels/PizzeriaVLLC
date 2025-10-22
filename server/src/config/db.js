    
require("dotenv").config();
const mysql = require("mysql2/promise");

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
});

db.getConnection()
  .then(() => console.log("✅ Conectado a la base de datos MySQL"))
  .catch(err => {
    console.error("❌ Error conectando a MySQL:", err.message);
    process.exit(1);
  });

module.exports = db;
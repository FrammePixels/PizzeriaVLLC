const mysql = require("mysql2");

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true
});

const dbQuery = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    pool.query(sql, params, (err, results) => {
      if (err) {
        console.error("❌ Error en consulta DB:", err);
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

const checkConnection = async () => {
  try {
    const [result] = await dbQuery("SELECT 1 as connected");
    return "connected";
  } catch (error) {
    console.error("❌ Error conectando a DB:", error);
    return "disconnected";
  }
};

module.exports = { dbQuery, checkConnection };
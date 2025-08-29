
import mysql from "mysql2/promise";

// Configuración de la base de datos
const dbConfig = {
  host: "localhost",
  user: "root",      // 👈 tu usuario
  password: "1234", // 👈 tu contraseña
  database: "biblioteca",   // 👈 el nombre de tu base de datos
   connectionLimit: 10, //Controls the number of active connections at the same time
    waitForConnections: true, //When the connection limit is reached, if set to true, users will be placed
    queueLimit: 0 //Maximum number of requests waiting (0 = no limit)
};
export const pool = mysql.createPool(dbConfig);


async function checkConnection() {
  try {
    const connection = await mysql.createConnection(dbConfig);
    console.log("✅ Conexión exitosa a la base de datos");
    
    // Hacemos un "ping" para probar
    await connection.ping();
    console.log("📡 El servidor respondió correctamente");
    
    await connection.end();
  } catch (error) {
    console.error("❌ Error al conectar a la base de datos:", error.message);
  }
}

// Ejecutar
checkConnection();

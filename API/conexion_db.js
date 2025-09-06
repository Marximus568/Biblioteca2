
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();
// Configuración de la base de datos
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER, 
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,   
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
